package com.mmi404.portfolio.developer.project;

import com.mmi404.portfolio.developer.project.dto.ProjectImageAdminResponse;
import com.mmi404.portfolio.developer.project.dto.ProjectImageUpdateRequest;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
public class ProjectImageAdminController {

    private final ProjectImageAdminService projectImageAdminService;

    public ProjectImageAdminController(ProjectImageAdminService projectImageAdminService) {
        this.projectImageAdminService = projectImageAdminService;
    }

    @GetMapping("/api/admin/projects/{projectId}/images")
    public List<ProjectImageAdminResponse> listForProject(@PathVariable Long projectId) {
        return projectImageAdminService.listForProject(projectId);
    }

    @PostMapping(path = "/api/admin/projects/{projectId}/images", consumes = "multipart/form-data")
    @ResponseStatus(HttpStatus.CREATED)
    public ProjectImageAdminResponse upload(
            @PathVariable Long projectId,
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "caption", required = false) String caption,
            @RequestParam(value = "sortOrder", required = false, defaultValue = "0") Integer sortOrder) {
        return projectImageAdminService.upload(projectId, file, caption, sortOrder);
    }

    @PutMapping("/api/admin/project-images/{imageId}")
    public ProjectImageAdminResponse updateMetadata(
            @PathVariable Long imageId, @Valid @RequestBody ProjectImageUpdateRequest request) {
        return projectImageAdminService.updateMetadata(imageId, request);
    }

    @DeleteMapping("/api/admin/project-images/{imageId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long imageId) {
        projectImageAdminService.delete(imageId);
    }
}
