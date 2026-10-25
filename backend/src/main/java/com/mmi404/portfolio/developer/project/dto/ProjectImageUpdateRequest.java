package com.mmi404.portfolio.developer.project.dto;

import jakarta.validation.constraints.NotNull;

public record ProjectImageUpdateRequest(String caption, @NotNull Integer sortOrder) {}
