package com.mmi404.portfolio.developer.project.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record TechTagUpsertRequest(
        @NotBlank @Size(max = 100) String name, @NotBlank @Size(max = 100) String slug) {}
