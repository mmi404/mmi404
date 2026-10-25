package com.mmi404.portfolio.developer.project;

import com.mmi404.portfolio.developer.project.dto.ProjectResponse;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/personas/{slug}/projects")
public class ProjectController {

    private final ProjectService projectService;

    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @GetMapping
    public List<ProjectResponse> listProjects(@PathVariable String slug) {
        return projectService.listPublishedProjects(slug);
    }

    @GetMapping("/{projectSlug}")
    public ProjectResponse getProject(@PathVariable String slug, @PathVariable String projectSlug) {
        return projectService.getPublishedProject(slug, projectSlug);
    }
}
