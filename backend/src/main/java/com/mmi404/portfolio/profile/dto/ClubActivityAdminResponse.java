package com.mmi404.portfolio.profile.dto;

import java.time.LocalDate;

public record ClubActivityAdminResponse(
        Long id,
        String name,
        String role,
        String description,
        LocalDate startDate,
        LocalDate endDate,
        Integer sortOrder) {}
