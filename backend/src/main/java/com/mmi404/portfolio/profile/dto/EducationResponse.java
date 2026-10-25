package com.mmi404.portfolio.profile.dto;

import java.time.LocalDate;

public record EducationResponse(
        String institution,
        String degree,
        String fieldOfStudy,
        LocalDate startDate,
        LocalDate endDate,
        String description) {}
