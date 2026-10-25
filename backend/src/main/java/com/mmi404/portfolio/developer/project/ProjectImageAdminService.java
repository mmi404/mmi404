package com.mmi404.portfolio.developer.project;

import com.mmi404.portfolio.developer.project.dto.ProjectImageAdminResponse;
import com.mmi404.portfolio.developer.project.dto.ProjectImageUpdateRequest;
import com.mmi404.portfolio.image.FileStorageService;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

/**
 * Enforces the second half of PARTIAL-tier confidentiality: an image can never be attached
 * to a PARTIAL-tier project, checked server-side before the file is even stored on disk.
 */
@Service
@Transactional
public class ProjectImageAdminService {

    private final ProjectRepository projectRepository;
    private final ProjectImageRepository projectImageRepository;
    private final FileStorageService fileStorageService;

    public ProjectImageAdminService(
            ProjectRepository projectRepository,
            ProjectImageRepository projectImageRepository,
            FileStorageService fileStorageService) {
        this.projectRepository = projectRepository;
        this.projectImageRepository = projectImageRepository;
        this.fileStorageService = fileStorageService;
    }

    @Transactional(readOnly = true)
    public List<ProjectImageAdminResponse> listForProject(Long projectId) {
        requireProject(projectId);
        return projectImageRepository.findByProjectIdOrderBySortOrderAsc(projectId).stream()
                .map(this::toResponse)
                .toList();
    }

    public ProjectImageAdminResponse upload(Long projectId, MultipartFile file, String caption, Integer sortOrder) {
        Project project = requireProject(projectId);

        if (project.getVisibilityTier() == VisibilityTier.PARTIAL) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Image uploads are not allowed for PARTIAL-tier projects.");
        }

        String imageUrl = fileStorageService.store(file);

        ProjectImage image = new ProjectImage();
        image.setProject(project);
        image.setImageUrl(imageUrl);
        image.setCaption(caption);
        image.setSortOrder(sortOrder != null ? sortOrder : 0);
        image = projectImageRepository.save(image);
        return toResponse(image);
    }

    public ProjectImageAdminResponse updateMetadata(Long imageId, ProjectImageUpdateRequest request) {
        ProjectImage image = requireImage(imageId);
        image.setCaption(request.caption());
        image.setSortOrder(request.sortOrder());
        return toResponse(projectImageRepository.save(image));
    }

    public void delete(Long imageId) {
        ProjectImage image = requireImage(imageId);
        fileStorageService.deleteByUrl(image.getImageUrl());
        projectImageRepository.delete(image);
    }

    private Project requireProject(Long projectId) {
        return projectRepository.findById(projectId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Project not found: " + projectId));
    }

    private ProjectImage requireImage(Long imageId) {
        return projectImageRepository.findById(imageId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Project image not found: " + imageId));
    }

    private ProjectImageAdminResponse toResponse(ProjectImage image) {
        return new ProjectImageAdminResponse(
                image.getId(), image.getProject().getId(), image.getImageUrl(), image.getCaption(), image.getSortOrder());
    }
}
