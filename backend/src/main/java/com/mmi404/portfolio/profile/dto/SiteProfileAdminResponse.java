package com.mmi404.portfolio.profile.dto;

public record SiteProfileAdminResponse(
        Long id,
        String fullName,
        String headline,
        String aboutMeMarkdown,
        String profilePhotoUrl,
        String resumeUrl) {}
