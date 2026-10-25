package com.mmi404.portfolio.profile.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record ContactLinkUpsertRequest(
        @NotBlank String label, @NotBlank String url, String iconKey, @NotNull Integer sortOrder) {}
