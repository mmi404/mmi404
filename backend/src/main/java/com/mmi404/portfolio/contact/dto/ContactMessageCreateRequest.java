package com.mmi404.portfolio.contact.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * {@code honeypot} is an invisible field real visitors never fill in (hidden via CSS on the
 * form); a non-blank value means a bot filled every field, so the submission is silently
 * dropped (see ContactMessageService) rather than rejected loudly.
 */
public record ContactMessageCreateRequest(
        @NotBlank @Size(max = 5000) String messageBody,
        @Email @Size(max = 255) String replyEmail,
        @Size(max = 50) String replyPhone,
        String honeypot) {}
