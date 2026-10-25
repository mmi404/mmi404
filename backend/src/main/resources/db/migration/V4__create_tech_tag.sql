CREATE TABLE tech_tag (
    id    BIGINT AUTO_INCREMENT PRIMARY KEY,
    name  VARCHAR(100) NOT NULL,
    slug  VARCHAR(100) NOT NULL,
    CONSTRAINT uq_tech_tag_name UNIQUE (name),
    CONSTRAINT uq_tech_tag_slug UNIQUE (slug)
) ENGINE=InnoDB;
