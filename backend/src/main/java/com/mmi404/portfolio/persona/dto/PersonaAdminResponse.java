package com.mmi404.portfolio.persona.dto;

public record PersonaAdminResponse(
        Long id,
        String slug,
        String displayName,
        String tagline,
        String iconKey,
        Integer navOrder,
        Boolean published,
        String headline,
        String introMarkdown) {}
