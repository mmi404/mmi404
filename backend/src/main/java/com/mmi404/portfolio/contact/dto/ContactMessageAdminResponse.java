package com.mmi404.portfolio.contact.dto;

import java.time.Instant;

public record ContactMessageAdminResponse(
        Long id,
        String messageBody,
        String replyEmail,
        String replyPhone,
        String ipAddress,
        String userAgent,
        Boolean read,
        Instant submittedAt) {}
