package com.mmi404.portfolio.persona.dto;

public record PersonaDetailResponse(
        String slug,
        String displayName,
        String tagline,
        String iconKey,
        String headline,
        String introMarkdown) {}
