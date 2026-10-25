package com.mmi404.portfolio.contact.dto;

import jakarta.validation.constraints.NotNull;

public record ContactMessageUpdateRequest(@NotNull Boolean read) {}
