package com.mmi404.portfolio.profile.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public record ClubActivityUpsertRequest(
        @NotBlank String name,
        String role,
        String description,
        LocalDate startDate,
        LocalDate endDate,
        @NotNull Integer sortOrder) {}
