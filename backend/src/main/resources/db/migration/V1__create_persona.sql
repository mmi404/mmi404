CREATE TABLE persona (
    id            BIGINT AUTO_INCREMENT PRIMARY KEY,
    slug          VARCHAR(100)  NOT NULL,
    display_name  VARCHAR(150)  NOT NULL,
    tagline       VARCHAR(255)  NULL,
    icon_key      VARCHAR(100)  NULL,
    nav_order     INT           NOT NULL DEFAULT 0,
    is_published  BOOLEAN       NOT NULL DEFAULT TRUE,
    created_at    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT uq_persona_slug UNIQUE (slug)
) ENGINE=InnoDB;
