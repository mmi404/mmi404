package com.mmi404.portfolio.profile;

import com.mmi404.portfolio.profile.dto.ContactLinkAdminResponse;
import com.mmi404.portfolio.profile.dto.ContactLinkUpsertRequest;
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
@RequestMapping("/api/admin/contact-links")
public class ContactLinkAdminController {

    private final ContactLinkRepository contactLinkRepository;

    public ContactLinkAdminController(ContactLinkRepository contactLinkRepository) {
        this.contactLinkRepository = contactLinkRepository;
    }

    @GetMapping
    public List<ContactLinkAdminResponse> listAll() {
        return contactLinkRepository.findAllByOrderBySortOrderAsc().stream().map(this::toResponse).toList();
    }

    @GetMapping("/{id}")
    public ContactLinkAdminResponse getById(@PathVariable Long id) {
        return toResponse(require(id));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ContactLinkAdminResponse create(@Valid @RequestBody ContactLinkUpsertRequest request) {
        ContactLink link = new ContactLink();
        apply(link, request);
        return toResponse(contactLinkRepository.save(link));
    }

    @PutMapping("/{id}")
    public ContactLinkAdminResponse update(@PathVariable Long id, @Valid @RequestBody ContactLinkUpsertRequest request) {
        ContactLink link = require(id);
        apply(link, request);
        return toResponse(contactLinkRepository.save(link));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        contactLinkRepository.delete(require(id));
    }

    private ContactLink require(Long id) {
        return contactLinkRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Contact link not found: " + id));
    }

    private void apply(ContactLink link, ContactLinkUpsertRequest request) {
        link.setLabel(request.label());
        link.setUrl(request.url());
        link.setIconKey(request.iconKey());
        link.setSortOrder(request.sortOrder());
    }

    private ContactLinkAdminResponse toResponse(ContactLink link) {
        return new ContactLinkAdminResponse(link.getId(), link.getLabel(), link.getUrl(), link.getIconKey(), link.getSortOrder());
    }
}
