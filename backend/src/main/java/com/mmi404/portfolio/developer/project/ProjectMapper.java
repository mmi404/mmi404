package com.mmi404.portfolio.developer.project;

import com.mmi404.portfolio.developer.project.dto.ProjectAddResponse;
import com.mmi404.portfolio.developer.project.dto.ProjectImageResponse;
import com.mmi404.portfolio.developer.project.dto.ProjectPartialResponse;
import com.mmi404.portfolio.developer.project.dto.ProjectResponse;
import java.util.Comparator;
import java.util.List;

/**
 * The single chokepoint that branches a {@link Project} entity into one of the two
 * structurally distinct response DTOs by {@code visibilityTier}. No other code in the
 * application should build a project response directly.
 */
public final class ProjectMapper {

    private ProjectMapper() {}

    public static ProjectResponse toResponse(Project project) {
        List<String> techTags = project.getTechTags().stream()
                .map(TechTag::getName)
                .sorted()
                .toList();

        return switch (project.getVisibilityTier()) {
            case ADD -> toAddResponse(project, techTags);
            case PARTIAL -> toPartialResponse(project, techTags);
        };
    }

    private static ProjectAddResponse toAddResponse(Project project, List<String> techTags) {
        List<ProjectImageResponse> images = project.getProjectImages().stream()
                .sorted(Comparator.comparing(ProjectImage::getSortOrder))
                .map(img -> new ProjectImageResponse(img.getImageUrl(), img.getCaption(), img.getSortOrder()))
                .toList();

        return new ProjectAddResponse(
                project.getSlug(),
                project.getTitle(),
                project.getVisibilityTier().name(),
                project.getNontechnicalDescription(),
                project.getTechnicalDescription(),
                project.getExperienceDescription(),
                project.getLiveUrl(),
                project.getGithubUrl(),
                project.getClientName(),
                techTags,
                images);
    }

    private static ProjectPartialResponse toPartialResponse(Project project, List<String> techTags) {
        return new ProjectPartialResponse(
                project.getSlug(),
                project.getTitle(),
                project.getVisibilityTier().name(),
                project.getNontechnicalDescription(),
                project.getTechnicalDescription(),
                project.getExperienceDescription(),
                techTags);
    }
}
