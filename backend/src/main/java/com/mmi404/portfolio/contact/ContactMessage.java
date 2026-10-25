package com.mmi404.portfolio.contact;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.Instant;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "contact_message")
@Getter
@Setter
@NoArgsConstructor
public class ContactMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "message_body", nullable = false, length = 5000)
    private String messageBody;

    @Column(name = "reply_email")
    private String replyEmail;

    @Column(name = "reply_phone")
    private String replyPhone;

    @Column(name = "ip_address", nullable = false)
    private String ipAddress;

    @Column(name = "user_agent")
    private String userAgent;

    @Column(name = "is_read", nullable = false)
    private Boolean read = false;

    @Column(name = "submitted_at", insertable = false, updatable = false)
    private Instant submittedAt;
}
