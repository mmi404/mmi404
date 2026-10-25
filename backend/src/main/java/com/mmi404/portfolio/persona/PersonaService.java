package com.mmi404.portfolio.persona;

import com.mmi404.portfolio.persona.dto.PersonaDetailResponse;
import com.mmi404.portfolio.persona.dto.PersonaSummaryResponse;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@Transactional(readOnly = true)
public class PersonaService {

    private final PersonaRepository personaRepository;
    private final PersonaProfileRepository personaProfileRepository;

    public PersonaService(PersonaRepository personaRepository, PersonaProfileRepository personaProfileRepository) {
        this.personaRepository = personaRepository;
        this.personaProfileRepository = personaProfileRepository;
    }

    public List<PersonaSummaryResponse> listPublishedPersonas() {
        return personaRepository.findByPublishedTrueOrderByNavOrderAsc().stream()
                .map(p -> new PersonaSummaryResponse(p.getSlug(), p.getDisplayName(), p.getTagline(), p.getIconKey(), p.getNavOrder()))
                .toList();
    }

    public PersonaDetailResponse getPublishedPersonaDetail(String slug) {
        Persona persona = personaRepository.findBySlugAndPublishedTrue(slug)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Persona not found: " + slug));

        PersonaProfile profile = personaProfileRepository.findByPersonaId(persona.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Persona profile not found: " + slug));

        return new PersonaDetailResponse(
                persona.getSlug(),
                persona.getDisplayName(),
                persona.getTagline(),
                persona.getIconKey(),
                profile.getHeadline(),
                profile.getIntroMarkdown());
    }

    /** Resolves a published persona by slug or throws 404 — shared with the project endpoints. */
    public Persona requirePublishedPersona(String slug) {
        return personaRepository.findBySlugAndPublishedTrue(slug)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Persona not found: " + slug));
    }
}
