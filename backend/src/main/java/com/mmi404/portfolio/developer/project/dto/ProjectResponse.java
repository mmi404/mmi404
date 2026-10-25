package com.mmi404.portfolio.developer.project.dto;

/**
 * Marker type for the two genuinely distinct project response shapes.
 * Branching happens in exactly one place: {@code ProjectMapper}.
 */
public sealed interface ProjectResponse permits ProjectAddResponse, ProjectPartialResponse {}
