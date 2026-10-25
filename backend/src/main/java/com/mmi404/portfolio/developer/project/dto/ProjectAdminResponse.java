package com.mmi404.portfolio.developer.project.dto;

import java.util.List;

/**
 * Full admin-facing view of a project — unlike the public API this is a single shape for
 * both tiers (the admin needs to see/edit everything), with liveUrl/githubUrl/clientName
 * simply null for PARTIAL projects. The ADD/PARTIAL *public* response split lives only in
 * ProjectMapper and is untouched by this admin DTO.
 */
public record ProjectAdminResponse(
        Long id,
        Long personaId,
        String slug,
        String title,
        String visibilityTier,
        String nontechnicalDescription,
        String technicalDescription,
        String experienceDescription,
        String liveUrl,
        String githubUrl,
        String clientName,
        Integer sortOrder,
        Boolean published,
        List<TechTagAdminResponse> techTags,
        List<ProjectImageAdminResponse> images) {}
