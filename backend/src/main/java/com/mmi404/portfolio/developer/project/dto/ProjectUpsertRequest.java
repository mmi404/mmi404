package com.mmi404.portfolio.developer.project.dto;

import com.mmi404.portfolio.developer.project.VisibilityTier;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.Set;

public record ProjectUpsertRequest(
        @NotNull Long personaId,
        @NotBlank String slug,
        @NotBlank String title,
        @NotNull VisibilityTier visibilityTier,
        String nontechnicalDescription,
        String technicalDescription,
        String experienceDescription,
        String liveUrl,
        String githubUrl,
        String clientName,
        @NotNull Integer sortOrder,
        @NotNull Boolean published,
        Set<Long> techTagIds) {}
