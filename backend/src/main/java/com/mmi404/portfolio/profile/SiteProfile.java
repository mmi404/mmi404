package com.mmi404.portfolio.profile;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.Table;
import java.time.Instant;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** Singleton table — one row holds the site-wide bio/profile content. */
@Entity
@Table(name = "site_profile")
@Getter
@Setter
@NoArgsConstructor
public class SiteProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "full_name", nullable = false)
    private String fullName;

    private String headline;

    @Lob
    @Column(name = "about_me_markdown", length = Integer.MAX_VALUE)
    private String aboutMeMarkdown;

    @Column(name = "profile_photo_url")
    private String profilePhotoUrl;

    @Column(name = "resume_url")
    private String resumeUrl;

    @Column(name = "created_at", insertable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at", insertable = false, updatable = false)
    private Instant updatedAt;
}
