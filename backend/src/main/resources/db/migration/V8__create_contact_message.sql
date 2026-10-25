CREATE TABLE contact_message (
    id            BIGINT AUTO_INCREMENT PRIMARY KEY,
    message_body  VARCHAR(5000) NOT NULL,
    reply_email   VARCHAR(255)  NULL,
    reply_phone   VARCHAR(50)   NULL,
    ip_address    VARCHAR(45)   NOT NULL,
    user_agent    VARCHAR(500)  NULL,
    is_read       BOOLEAN       NOT NULL DEFAULT FALSE,
    submitted_at  TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE INDEX idx_contact_message_submitted_at ON contact_message (submitted_at);
CREATE INDEX idx_contact_message_is_read ON contact_message (is_read);
