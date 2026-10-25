package com.mmi404.portfolio.persona;

import com.mmi404.portfolio.persona.dto.PersonaAdminResponse;
import com.mmi404.portfolio.persona.dto.PersonaUpsertRequest;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@Transactional
public class PersonaAdminService {

    private final PersonaRepository personaRepository;
    private final PersonaProfileRepository personaProfileRepository;

    public PersonaAdminService(PersonaRepository personaRepository, PersonaProfileRepository personaProfileRepository) {
        this.personaRepository = personaRepository;
        this.personaProfileRepository = personaProfileRepository;
    }

    @Transactional(readOnly = true)
    public List<PersonaAdminResponse> listAll() {
        return personaRepository.findAll().stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public PersonaAdminResponse getById(Long id) {
        Persona persona = requirePersona(id);
        return toResponse(persona);
    }

    public PersonaAdminResponse create(PersonaUpsertRequest request) {
        Persona persona = new Persona();
        applyRequest(persona, request);
        persona = personaRepository.save(persona);

        PersonaProfile profile = new PersonaProfile();
        profile.setPersona(persona);
        profile.setHeadline(request.headline());
        profile.setIntroMarkdown(request.introMarkdown());
        personaProfileRepository.save(profile);

        return toResponse(persona, profile);
    }

    public PersonaAdminResponse update(Long id, PersonaUpsertRequest request) {
        Persona persona = requirePersona(id);
        applyRequest(persona, request);
        final Persona savedPersona = personaRepository.save(persona);
        persona = savedPersona;

        PersonaProfile profile = personaProfileRepository.findByPersonaId(savedPersona.getId()).orElseGet(() -> {
            PersonaProfile p = new PersonaProfile();
            p.setPersona(savedPersona);
            return p;
        });
        profile.setHeadline(request.headline());
        profile.setIntroMarkdown(request.introMarkdown());
        personaProfileRepository.save(profile);

        return toResponse(persona, profile);
    }

    public void delete(Long id) {
        Persona persona = requirePersona(id);
        personaRepository.delete(persona);
    }

    private Persona requirePersona(Long id) {
        return personaRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Persona not found: " + id));
    }

    private void applyRequest(Persona persona, PersonaUpsertRequest request) {
        persona.setSlug(request.slug());
        persona.setDisplayName(request.displayName());
        persona.setTagline(request.tagline());
        persona.setIconKey(request.iconKey());
        persona.setNavOrder(request.navOrder());
        persona.setPublished(request.published());
    }

    private PersonaAdminResponse toResponse(Persona persona) {
        PersonaProfile profile = personaProfileRepository.findByPersonaId(persona.getId()).orElse(null);
        return toResponse(persona, profile);
    }

    private PersonaAdminResponse toResponse(Persona persona, PersonaProfile profile) {
        return new PersonaAdminResponse(
                persona.getId(),
                persona.getSlug(),
                persona.getDisplayName(),
                persona.getTagline(),
                persona.getIconKey(),
                persona.getNavOrder(),
                persona.getPublished(),
                profile != null ? profile.getHeadline() : null,
                profile != null ? profile.getIntroMarkdown() : null);
    }
}
