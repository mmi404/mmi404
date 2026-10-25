package com.mmi404.portfolio.persona;

import com.mmi404.portfolio.persona.dto.PersonaAdminResponse;
import com.mmi404.portfolio.persona.dto.PersonaUpsertRequest;
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
@RequestMapping("/api/admin/personas")
public class PersonaAdminController {

    private final PersonaAdminService personaAdminService;

    public PersonaAdminController(PersonaAdminService personaAdminService) {
        this.personaAdminService = personaAdminService;
    }

    @GetMapping
    public List<PersonaAdminResponse> listAll() {
        return personaAdminService.listAll();
    }

    @GetMapping("/{id}")
    public PersonaAdminResponse getById(@PathVariable Long id) {
        return personaAdminService.getById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public PersonaAdminResponse create(@Valid @RequestBody PersonaUpsertRequest request) {
        return personaAdminService.create(request);
    }

    @PutMapping("/{id}")
    public PersonaAdminResponse update(@PathVariable Long id, @Valid @RequestBody PersonaUpsertRequest request) {
        return personaAdminService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        personaAdminService.delete(id);
    }
}
