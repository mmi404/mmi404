package com.mmi404.portfolio.developer.project;

import com.mmi404.portfolio.developer.project.dto.ProjectAdminResponse;
import com.mmi404.portfolio.developer.project.dto.ProjectUpsertRequest;
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
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/projects")
public class ProjectAdminController {

    private final ProjectAdminService projectAdminService;

    public ProjectAdminController(ProjectAdminService projectAdminService) {
        this.projectAdminService = projectAdminService;
    }

    @GetMapping
    public List<ProjectAdminResponse> listAll() {
        return projectAdminService.listAll();
    }

    @GetMapping("/{id}")
    public ProjectAdminResponse getById(@PathVariable Long id) {
        return projectAdminService.getById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ProjectAdminResponse create(@Valid @RequestBody ProjectUpsertRequest request) {
        return projectAdminService.create(request);
    }

    @PutMapping("/{id}")
    public ProjectAdminResponse update(@PathVariable Long id, @Valid @RequestBody ProjectUpsertRequest request) {
        return projectAdminService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        projectAdminService.delete(id);
    }
}
