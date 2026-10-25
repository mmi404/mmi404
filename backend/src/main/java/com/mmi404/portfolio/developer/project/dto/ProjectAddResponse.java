package com.mmi404.portfolio.developer.project.dto;

import java.util.List;

/**
 * Full-showcase (ADD tier) response. Deliberately carries liveUrl/githubUrl/clientName
 * and image galleries — fields that must NEVER appear on a PARTIAL-tier response.
 */
public record ProjectAddResponse(
        String slug,
        String title,
        String visibilityTier,
        String nontechnicalDescription,
        String technicalDescription,
        String experienceDescription,
        String liveUrl,
        String githubUrl,
        String clientName,
        List<String> techTags,
        List<ProjectImageResponse> images)
        implements ProjectResponse {}
