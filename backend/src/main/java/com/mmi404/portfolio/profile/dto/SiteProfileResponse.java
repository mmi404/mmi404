package com.mmi404.portfolio.profile.dto;

import java.util.List;

public record SiteProfileResponse(
        String fullName,
        String headline,
        String aboutMeMarkdown,
        String profilePhotoUrl,
        String resumeUrl,
        List<EducationResponse> education,
        List<ContactLinkResponse> contactLinks) {}
