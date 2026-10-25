CREATE TABLE project (
    id                         BIGINT AUTO_INCREMENT PRIMARY KEY,
    persona_id                 BIGINT        NOT NULL,
    slug                       VARCHAR(150)  NOT NULL,
    title                      VARCHAR(255)  NOT NULL,
    visibility_tier            ENUM('ADD', 'PARTIAL') NOT NULL,
    nontechnical_description   LONGTEXT      NULL,
    technical_description      LONGTEXT      NULL,
    experience_description     LONGTEXT      NULL,
    live_url                   VARCHAR(500)  NULL,
    github_url                 VARCHAR(500)  NULL,
    client_name                VARCHAR(150)  NULL,
    sort_order                 INT           NOT NULL DEFAULT 0,
    is_published                BOOLEAN       NOT NULL DEFAULT TRUE,
    created_at                 TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at                 TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT uq_project_slug UNIQUE (slug),
    CONSTRAINT fk_project_persona FOREIGN KEY (persona_id) REFERENCES persona (id) ON DELETE CASCADE,
    CONSTRAINT chk_partial_no_reveal CHECK (
        visibility_tier <> 'PARTIAL' OR (live_url IS NULL AND github_url IS NULL AND client_name IS NULL)
    )
) ENGINE=InnoDB;

CREATE TABLE project_image (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    project_id  BIGINT        NOT NULL,
    image_url   VARCHAR(500)  NOT NULL,
    caption     VARCHAR(255)  NULL,
    sort_order  INT           NOT NULL DEFAULT 0,
    CONSTRAINT fk_project_image_project FOREIGN KEY (project_id) REFERENCES project (id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE project_tech_tag (
    project_id   BIGINT NOT NULL,
    tech_tag_id  BIGINT NOT NULL,
    PRIMARY KEY (project_id, tech_tag_id),
    CONSTRAINT fk_project_tech_tag_project FOREIGN KEY (project_id) REFERENCES project (id) ON DELETE CASCADE,
    CONSTRAINT fk_project_tech_tag_tech_tag FOREIGN KEY (tech_tag_id) REFERENCES tech_tag (id) ON DELETE CASCADE
) ENGINE=InnoDB;
