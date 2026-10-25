package com.mmi404.portfolio.contact;

import com.mmi404.portfolio.contact.dto.ContactMessageAdminResponse;
import com.mmi404.portfolio.contact.dto.ContactMessageUpdateRequest;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/contact-messages")
public class ContactMessageAdminController {

    private final ContactMessageService contactMessageService;

    public ContactMessageAdminController(ContactMessageService contactMessageService) {
        this.contactMessageService = contactMessageService;
    }

    @GetMapping
    public Page<ContactMessageAdminResponse> list(
            @RequestParam(value = "isRead", required = false) Boolean isRead, Pageable pageable) {
        return contactMessageService.list(isRead, pageable);
    }

    @GetMapping("/{id}")
    public ContactMessageAdminResponse getById(@PathVariable Long id) {
        return contactMessageService.getById(id);
    }

    @PatchMapping("/{id}")
    public ContactMessageAdminResponse updateReadStatus(
            @PathVariable Long id, @Valid @RequestBody ContactMessageUpdateRequest request) {
        return contactMessageService.updateReadStatus(id, request);
    }
}
