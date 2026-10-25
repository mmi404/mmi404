package com.mmi404.portfolio.developer.project;

import com.mmi404.portfolio.developer.project.dto.ProjectAdminResponse;
import com.mmi404.portfolio.developer.project.dto.ProjectImageAdminResponse;
import com.mmi404.portfolio.developer.project.dto.ProjectUpsertRequest;
import com.mmi404.portfolio.developer.project.dto.TechTagAdminResponse;
import com.mmi404.portfolio.persona.Persona;
import com.mmi404.portfolio.persona.PersonaRepository;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

/**
 * Admin-side project CRUD. Enforces the PARTIAL-tier confidentiality rule server-side,
 * BEFORE the row ever reaches the database — the DB CHECK constraint (chk_partial_no_reveal)
 * is a second, independent backstop, not the only line of defense.
 */
@Service
@Transactional
public class ProjectAdminService {

    private final ProjectRepository projectRepository;
    private final PersonaRepository personaRepository;
    private final TechTagRepository techTagRepository;

    public ProjectAdminService(
            ProjectRepository projectRepository, PersonaRepository personaRepository, TechTagRepository techTagRepository) {
        this.projectRepository = projectRepository;
        this.personaRepository = personaRepository;
        this.techTagRepository = techTagRepository;
    }

    @Transactional(readOnly = true)
    public List<ProjectAdminResponse> listAll() {
        return projectRepository.findAll().stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public ProjectAdminResponse getById(Long id) {
        return toResponse(requireProject(id));
    }

    public ProjectAdminResponse create(ProjectUpsertRequest request) {
        validatePartialConfidentiality(request.visibilityTier(), request.liveUrl(), request.githubUrl(), request.clientName());

        Persona persona = personaRepository.findById(request.personaId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Persona not found: " + request.personaId()));

        Project project = new Project();
        project.setPersona(persona);
        apply(project, request);
        project = projectRepository.save(project);
        return toResponse(project);
    }

    public ProjectAdminResponse update(Long id, ProjectUpsertRequest request) {
        validatePartialConfidentiality(request.visibilityTier(), request.liveUrl(), request.githubUrl(), request.clientName());

        Project project = requireProject(id);
        if (!project.getPersona().getId().equals(request.personaId())) {
            Persona persona = personaRepository.findById(request.personaId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Persona not found: " + request.personaId()));
            project.setPersona(persona);
        }
        apply(project, request);
        project = projectRepository.save(project);
        return toResponse(project);
    }

    public void delete(Long id) {
        projectRepository.delete(requireProject(id));
    }

    /**
     * The service-layer confidentiality gate: a PARTIAL-tier project may never carry a
     * liveUrl, githubUrl, or clientName. Rejected with 400 here, independent of (and before)
     * the DB CHECK constraint.
     */
    private void validatePartialConfidentiality(VisibilityTier tier, String liveUrl, String githubUrl, String clientName) {
        if (tier == VisibilityTier.PARTIAL && (liveUrl != null || githubUrl != null || clientName != null)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "PARTIAL-tier projects may not have liveUrl, githubUrl, or clientName set.");
        }
    }

    private void apply(Project project, ProjectUpsertRequest request) {
        project.setSlug(request.slug());
        project.setTitle(request.title());
        project.setVisibilityTier(request.visibilityTier());
        project.setNontechnicalDescription(request.nontechnicalDescription());
        project.setTechnicalDescription(request.technicalDescription());
        project.setExperienceDescription(request.experienceDescription());
        project.setLiveUrl(request.liveUrl());
        project.setGithubUrl(request.githubUrl());
        project.setClientName(request.clientName());
        project.setSortOrder(request.sortOrder());
        project.setPublished(request.published());

        Set<Long> techTagIds = request.techTagIds() == null ? Set.of() : request.techTagIds();
        Set<TechTag> techTags = new HashSet<>(techTagRepository.findAllById(techTagIds));
        if (techTags.size() != techTagIds.size()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "One or more techTagIds do not exist.");
        }
        project.setTechTags(techTags);
    }

    private Project requireProject(Long id) {
        return projectRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Project not found: " + id));
    }

    private ProjectAdminResponse toResponse(Project project) {
        List<TechTagAdminResponse> techTags = project.getTechTags().stream()
                .sorted(Comparator.comparing(TechTag::getName))
                .map(t -> new TechTagAdminResponse(t.getId(), t.getName(), t.getSlug()))
                .toList();

        List<ProjectImageAdminResponse> images = project.getProjectImages().stream()
                .sorted(Comparator.comparing(ProjectImage::getSortOrder))
                .map(i -> new ProjectImageAdminResponse(i.getId(), project.getId(), i.getImageUrl(), i.getCaption(), i.getSortOrder()))
                .toList();

        return new ProjectAdminResponse(
                project.getId(),
                project.getPersona().getId(),
                project.getSlug(),
                project.getTitle(),
                project.getVisibilityTier().name(),
                project.getNontechnicalDescription(),
                project.getTechnicalDescription(),
                project.getExperienceDescription(),
                project.getLiveUrl(),
                project.getGithubUrl(),
                project.getClientName(),
                project.getSortOrder(),
                project.getPublished(),
                techTags,
                images);
    }
}
