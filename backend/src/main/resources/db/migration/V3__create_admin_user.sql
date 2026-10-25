-- Schema only. No seeded rows/credentials: the admin account is bootstrapped at
-- runtime (later milestone) from environment variables, never checked into a migration.
CREATE TABLE admin_user (
    id             BIGINT AUTO_INCREMENT PRIMARY KEY,
    username       VARCHAR(100)  NOT NULL,
    password_hash  VARCHAR(255)  NOT NULL,
    created_at     TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_login_at  TIMESTAMP     NULL,
    CONSTRAINT uq_admin_user_username UNIQUE (username)
) ENGINE=InnoDB;
