package com.mmi404.portfolio.profile;

import com.mmi404.portfolio.profile.dto.ClubActivityAdminResponse;
import com.mmi404.portfolio.profile.dto.ClubActivityUpsertRequest;
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

/**
 * Mirrors EducationAdminController exactly — same CRUD shape, same
 * validation/not-found pattern. club_activity has had a DB table (V2
 * migration) and JPA entity/repository since M2, but never got an admin
 * controller until now.
 */
@RestController
@RequestMapping("/api/admin/club-activities")
public class ClubActivityAdminController {

    private final ClubActivityRepository clubActivityRepository;

    public ClubActivityAdminController(ClubActivityRepository clubActivityRepository) {
        this.clubActivityRepository = clubActivityRepository;
    }

    @GetMapping
    public List<ClubActivityAdminResponse> listAll() {
        return clubActivityRepository.findAllByOrderBySortOrderAsc().stream().map(this::toResponse).toList();
    }

    @GetMapping("/{id}")
    public ClubActivityAdminResponse getById(@PathVariable Long id) {
        return toResponse(require(id));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ClubActivityAdminResponse create(@Valid @RequestBody ClubActivityUpsertRequest request) {
        ClubActivity clubActivity = new ClubActivity();
        apply(clubActivity, request);
        return toResponse(clubActivityRepository.save(clubActivity));
    }

    @PutMapping("/{id}")
    public ClubActivityAdminResponse update(
            @PathVariable Long id, @Valid @RequestBody ClubActivityUpsertRequest request) {
        ClubActivity clubActivity = require(id);
        apply(clubActivity, request);
        return toResponse(clubActivityRepository.save(clubActivity));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        clubActivityRepository.delete(require(id));
    }

    private ClubActivity require(Long id) {
        return clubActivityRepository
                .findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Club activity not found: " + id));
    }

    private void apply(ClubActivity clubActivity, ClubActivityUpsertRequest request) {
        clubActivity.setName(request.name());
        clubActivity.setRole(request.role());
        clubActivity.setDescription(request.description());
        clubActivity.setStartDate(request.startDate());
        clubActivity.setEndDate(request.endDate());
        clubActivity.setSortOrder(request.sortOrder());
    }

    private ClubActivityAdminResponse toResponse(ClubActivity c) {
        return new ClubActivityAdminResponse(
                c.getId(), c.getName(), c.getRole(), c.getDescription(), c.getStartDate(), c.getEndDate(),
                c.getSortOrder());
    }
}
