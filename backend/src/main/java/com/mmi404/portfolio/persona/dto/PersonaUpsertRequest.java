package com.mmi404.portfolio.persona.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/** Covers both the persona row and its 1:1 persona_profile row in one upsert. */
public record PersonaUpsertRequest(
        @NotBlank @Size(max = 100) String slug,
        @NotBlank @Size(max = 150) String displayName,
        @Size(max = 255) String tagline,
        @Size(max = 100) String iconKey,
        @NotNull Integer navOrder,
        @NotNull Boolean published,
        @Size(max = 255) String headline,
        String introMarkdown) {}
