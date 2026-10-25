package com.mmi404.portfolio.developer.project;

import com.mmi404.portfolio.developer.project.dto.ProjectResponse;
import com.mmi404.portfolio.persona.Persona;
import com.mmi404.portfolio.persona.PersonaService;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@Transactional(readOnly = true)
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final PersonaService personaService;

    public ProjectService(ProjectRepository projectRepository, PersonaService personaService) {
        this.projectRepository = projectRepository;
        this.personaService = personaService;
    }

    public List<ProjectResponse> listPublishedProjects(String personaSlug) {
        Persona persona = personaService.requirePublishedPersona(personaSlug);
        return projectRepository.findByPersonaIdAndPublishedTrueOrderBySortOrderAsc(persona.getId()).stream()
                .map(ProjectMapper::toResponse)
                .toList();
    }

    public ProjectResponse getPublishedProject(String personaSlug, String projectSlug) {
        Persona persona = personaService.requirePublishedPersona(personaSlug);
        Project project = projectRepository.findBySlugAndPersonaIdAndPublishedTrue(projectSlug, persona.getId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Project not found: " + projectSlug));
        return ProjectMapper.toResponse(project);
    }
}
