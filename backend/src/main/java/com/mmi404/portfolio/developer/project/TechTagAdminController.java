package com.mmi404.portfolio.developer.project;

import com.mmi404.portfolio.developer.project.dto.TechTagAdminResponse;
import com.mmi404.portfolio.developer.project.dto.TechTagUpsertRequest;
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
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/admin/tech-tags")
public class TechTagAdminController {

    private final TechTagRepository techTagRepository;

    public TechTagAdminController(TechTagRepository techTagRepository) {
        this.techTagRepository = techTagRepository;
    }

    @GetMapping
    public List<TechTagAdminResponse> listAll() {
        return techTagRepository.findAll().stream().map(this::toResponse).toList();
    }

    @GetMapping("/{id}")
    public TechTagAdminResponse getById(@PathVariable Long id) {
        return toResponse(require(id));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public TechTagAdminResponse create(@Valid @RequestBody TechTagUpsertRequest request) {
        TechTag tag = new TechTag();
        tag.setName(request.name());
        tag.setSlug(request.slug());
        return toResponse(techTagRepository.save(tag));
    }

    @PutMapping("/{id}")
    public TechTagAdminResponse update(@PathVariable Long id, @Valid @RequestBody TechTagUpsertRequest request) {
        TechTag tag = require(id);
        tag.setName(request.name());
        tag.setSlug(request.slug());
        return toResponse(techTagRepository.save(tag));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        techTagRepository.delete(require(id));
    }

    private TechTag require(Long id) {
        return techTagRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Tech tag not found: " + id));
    }

    private TechTagAdminResponse toResponse(TechTag tag) {
        return new TechTagAdminResponse(tag.getId(), tag.getName(), tag.getSlug());
    }
}
