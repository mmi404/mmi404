package com.mmi404.portfolio.persona;

import com.mmi404.portfolio.persona.dto.PersonaDetailResponse;
import com.mmi404.portfolio.persona.dto.PersonaSummaryResponse;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/personas")
public class PersonaController {

    private final PersonaService personaService;

    public PersonaController(PersonaService personaService) {
        this.personaService = personaService;
    }

    @GetMapping
    public List<PersonaSummaryResponse> listPersonas() {
        return personaService.listPublishedPersonas();
    }

    @GetMapping("/{slug}")
    public PersonaDetailResponse getPersona(@PathVariable String slug) {
        return personaService.getPublishedPersonaDetail(slug);
    }
}
