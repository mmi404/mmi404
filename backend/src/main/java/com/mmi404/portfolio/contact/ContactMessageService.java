package com.mmi404.portfolio.contact;

import com.mmi404.portfolio.contact.dto.ContactMessageAdminResponse;
import com.mmi404.portfolio.contact.dto.ContactMessageCreateRequest;
import com.mmi404.portfolio.contact.dto.ContactMessageUpdateRequest;
import org.jsoup.Jsoup;
import org.jsoup.safety.Safelist;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@Transactional
public class ContactMessageService {

    private static final int USER_AGENT_MAX_LENGTH = 500;

    private final ContactMessageRepository contactMessageRepository;
    private final ContactRateLimiter rateLimiter;

    public ContactMessageService(ContactMessageRepository contactMessageRepository, ContactRateLimiter rateLimiter) {
        this.contactMessageRepository = contactMessageRepository;
        this.rateLimiter = rateLimiter;
    }

    /**
     * Submits a public contact message. A filled honeypot field means a bot filled in every
     * field (real visitors never see it — it's hidden via CSS) — such submissions are
     * silently dropped: nothing is persisted and the rate-limit bucket isn't touched, but the
     * caller still gets back the same success response a real submission would, so the bot
     * can't tell it was caught.
     */
    public void submit(ContactMessageCreateRequest request, String ipAddress, String userAgent) {
        if (request.honeypot() != null && !request.honeypot().isBlank()) {
            return;
        }

        if (!rateLimiter.tryConsume(ipAddress)) {
            throw new ResponseStatusException(HttpStatus.TOO_MANY_REQUESTS, "Too many contact submissions. Please try again later.");
        }

        String sanitizedBody = Jsoup.clean(request.messageBody(), Safelist.none()).trim();
        if (sanitizedBody.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "messageBody must contain visible text.");
        }

        ContactMessage message = new ContactMessage();
        message.setMessageBody(sanitizedBody);
        message.setReplyEmail(blankToNull(request.replyEmail()));
        message.setReplyPhone(blankToNull(request.replyPhone()));
        message.setIpAddress(ipAddress);
        message.setUserAgent(truncate(userAgent, USER_AGENT_MAX_LENGTH));
        message.setRead(false);
        contactMessageRepository.save(message);
    }

    @Transactional(readOnly = true)
    public Page<ContactMessageAdminResponse> list(Boolean isRead, Pageable pageable) {
        Page<ContactMessage> page = isRead == null
                ? contactMessageRepository.findAllByOrderBySubmittedAtDesc(pageable)
                : contactMessageRepository.findByReadOrderBySubmittedAtDesc(isRead, pageable);
        return page.map(this::toResponse);
    }

    @Transactional(readOnly = true)
    public ContactMessageAdminResponse getById(Long id) {
        return toResponse(require(id));
    }

    public ContactMessageAdminResponse updateReadStatus(Long id, ContactMessageUpdateRequest request) {
        ContactMessage message = require(id);
        message.setRead(request.read());
        return toResponse(contactMessageRepository.save(message));
    }

    private ContactMessage require(Long id) {
        return contactMessageRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Contact message not found: " + id));
    }

    private ContactMessageAdminResponse toResponse(ContactMessage m) {
        return new ContactMessageAdminResponse(
                m.getId(), m.getMessageBody(), m.getReplyEmail(), m.getReplyPhone(), m.getIpAddress(), m.getUserAgent(),
                m.getRead(), m.getSubmittedAt());
    }

    private String blankToNull(String value) {
        return (value == null || value.isBlank()) ? null : value;
    }

    private String truncate(String value, int maxLength) {
        if (value == null) {
            return null;
        }
        return value.length() <= maxLength ? value : value.substring(0, maxLength);
    }
}
