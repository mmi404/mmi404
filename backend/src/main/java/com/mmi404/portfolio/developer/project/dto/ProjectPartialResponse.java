package com.mmi404.portfolio.developer.project.dto;

import java.util.List;

/**
 * Confidentiality-restricted (PARTIAL tier) response. Structurally has NO liveUrl,
 * githubUrl, clientName, or images fields — not nulled-out, simply absent from the
 * class — so the JSON can never leak them regardless of what is in the database.
 */
public record ProjectPartialResponse(
        String slug,
        String title,
        String visibilityTier,
        String nontechnicalDescription,
        String technicalDescription,
        String experienceDescription,
        List<String> techTags)
        implements ProjectResponse {}
