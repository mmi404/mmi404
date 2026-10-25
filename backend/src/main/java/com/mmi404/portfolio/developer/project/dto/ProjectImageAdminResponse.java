package com.mmi404.portfolio.developer.project.dto;

public record ProjectImageAdminResponse(Long id, Long projectId, String imageUrl, String caption, Integer sortOrder) {}
