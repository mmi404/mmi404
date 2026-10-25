package com.mmi404.portfolio.contact;

import com.mmi404.portfolio.contact.dto.ContactMessageCreateRequest;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/contact-messages")
public class ContactMessageController {

    private final ContactMessageService contactMessageService;

    public ContactMessageController(ContactMessageService contactMessageService) {
        this.contactMessageService = contactMessageService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Map<String, String> submit(@Valid @RequestBody ContactMessageCreateRequest request, HttpServletRequest httpRequest) {
        // ip_address/user_agent are derived server-side from the request — never accepted as
        // client-supplied fields, so there's nothing for a caller to spoof via the POST body.
        // With server.forward-headers-strategy=framework, getRemoteAddr() already reflects the
        // real client IP once this sits behind a reverse proxy that sets X-Forwarded-For.
        String ipAddress = httpRequest.getRemoteAddr();
        String userAgent = httpRequest.getHeader("User-Agent");
        contactMessageService.submit(request, ipAddress, userAgent);
        return Map.of("status", "received");
    }
}
