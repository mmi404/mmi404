package com.mmi404.portfolio.persona.dto;

public record PersonaSummaryResponse(
        String slug,
        String displayName,
        String tagline,
        String iconKey,
        Integer navOrder) {}
