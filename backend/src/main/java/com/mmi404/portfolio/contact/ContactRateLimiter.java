package com.mmi404.portfolio.contact;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Refill;
import java.time.Duration;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.stereotype.Component;

/**
 * In-memory, per-IP token bucket (5 requests/hour) guarding POST /api/contact-messages.
 * In-memory is fine for a single backend instance; if this ever runs behind a load balancer
 * with multiple instances, swap the cache for a distributed Bucket4j backend (e.g. Redis).
 */
@Component
public class ContactRateLimiter {

    private static final int CAPACITY = 5;
    private static final Duration REFILL_PERIOD = Duration.ofHours(1);

    private final ConcurrentHashMap<String, Bucket> buckets = new ConcurrentHashMap<>();

    public boolean tryConsume(String ipAddress) {
        return buckets.computeIfAbsent(ipAddress, ip -> newBucket()).tryConsume(1);
    }

    private Bucket newBucket() {
        Bandwidth limit = Bandwidth.classic(CAPACITY, Refill.intervally(CAPACITY, REFILL_PERIOD));
        return Bucket.builder().addLimit(limit).build();
    }
}
