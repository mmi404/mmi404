package com.mmi404.portfolio.profile.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record SiteProfileUpsertRequest(
        @NotBlank @Size(max = 150) String fullName,
        @Size(max = 255) String headline,
        String aboutMeMarkdown,
        @Size(max = 500) String profilePhotoUrl,
        @Size(max = 500) String resumeUrl) {}
