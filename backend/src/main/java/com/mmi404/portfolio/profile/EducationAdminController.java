package com.mmi404.portfolio.profile;

import com.mmi404.portfolio.profile.dto.EducationAdminResponse;
import com.mmi404.portfolio.profile.dto.EducationUpsertRequest;
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
@RequestMapping("/api/admin/education")
public class EducationAdminController {

    private final EducationRepository educationRepository;

    public EducationAdminController(EducationRepository educationRepository) {
        this.educationRepository = educationRepository;
    }

    @GetMapping
    public List<EducationAdminResponse> listAll() {
        return educationRepository.findAllByOrderBySortOrderAsc().stream().map(this::toResponse).toList();
    }

    @GetMapping("/{id}")
    public EducationAdminResponse getById(@PathVariable Long id) {
        return toResponse(require(id));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public EducationAdminResponse create(@Valid @RequestBody EducationUpsertRequest request) {
        Education education = new Education();
        apply(education, request);
        return toResponse(educationRepository.save(education));
    }

    @PutMapping("/{id}")
    public EducationAdminResponse update(@PathVariable Long id, @Valid @RequestBody EducationUpsertRequest request) {
        Education education = require(id);
        apply(education, request);
        return toResponse(educationRepository.save(education));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        educationRepository.delete(require(id));
    }

    private Education require(Long id) {
        return educationRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Education not found: " + id));
    }

    private void apply(Education education, EducationUpsertRequest request) {
        education.setInstitution(request.institution());
        education.setDegree(request.degree());
        education.setFieldOfStudy(request.fieldOfStudy());
        education.setStartDate(request.startDate());
        education.setEndDate(request.endDate());
        education.setDescription(request.description());
        education.setSortOrder(request.sortOrder());
    }

    private EducationAdminResponse toResponse(Education e) {
        return new EducationAdminResponse(
                e.getId(), e.getInstitution(), e.getDegree(), e.getFieldOfStudy(), e.getStartDate(), e.getEndDate(),
                e.getDescription(), e.getSortOrder());
    }
}
