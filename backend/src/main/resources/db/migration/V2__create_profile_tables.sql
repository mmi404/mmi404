CREATE TABLE persona_profile (
    id             BIGINT AUTO_INCREMENT PRIMARY KEY,
    persona_id     BIGINT        NOT NULL,
    headline       VARCHAR(255)  NULL,
    intro_markdown LONGTEXT      NULL,
    created_at     TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at     TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT uq_persona_profile_persona_id UNIQUE (persona_id),
    CONSTRAINT fk_persona_profile_persona FOREIGN KEY (persona_id) REFERENCES persona (id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE site_profile (
    id                  BIGINT AUTO_INCREMENT PRIMARY KEY,
    full_name           VARCHAR(150)  NOT NULL,
    headline            VARCHAR(255)  NULL,
    about_me_markdown   LONGTEXT      NULL,
    profile_photo_url   VARCHAR(500)  NULL,
    resume_url          VARCHAR(500)  NULL,
    created_at          TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE education (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    institution     VARCHAR(255)  NOT NULL,
    degree          VARCHAR(255)  NULL,
    field_of_study  VARCHAR(255)  NULL,
    start_date      DATE          NULL,
    end_date        DATE          NULL,
    description     LONGTEXT      NULL,
    sort_order      INT           NOT NULL DEFAULT 0
) ENGINE=InnoDB;

CREATE TABLE club_activity (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(255)  NOT NULL,
    role        VARCHAR(255)  NULL,
    description LONGTEXT      NULL,
    start_date  DATE          NULL,
    end_date    DATE          NULL,
    sort_order  INT           NOT NULL DEFAULT 0
) ENGINE=InnoDB;

CREATE TABLE contact_link (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    label       VARCHAR(100)  NOT NULL,
    url         VARCHAR(500)  NOT NULL,
    icon_key    VARCHAR(100)  NULL,
    sort_order  INT           NOT NULL DEFAULT 0
) ENGINE=InnoDB;
