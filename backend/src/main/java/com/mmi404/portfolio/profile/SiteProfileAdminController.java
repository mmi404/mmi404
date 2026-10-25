package com.mmi404.portfolio.profile;

import com.mmi404.portfolio.profile.dto.SiteProfileAdminResponse;
import com.mmi404.portfolio.profile.dto.SiteProfileUpsertRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

/** site_profile is a singleton — GET 404s until the first PUT creates it; PUT upserts. */
@RestController
@RequestMapping("/api/admin/site-profile")
public class SiteProfileAdminController {

    private final SiteProfileRepository siteProfileRepository;

    public SiteProfileAdminController(SiteProfileRepository siteProfileRepository) {
        this.siteProfileRepository = siteProfileRepository;
    }

    @GetMapping
    public SiteProfileAdminResponse get() {
        SiteProfile siteProfile = siteProfileRepository.findFirstByOrderByIdAsc()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "site_profile has not been configured yet"));
        return toResponse(siteProfile);
    }

    @PutMapping
    public SiteProfileAdminResponse upsert(@Valid @RequestBody SiteProfileUpsertRequest request) {
        SiteProfile siteProfile = siteProfileRepository.findFirstByOrderByIdAsc().orElseGet(SiteProfile::new);
        siteProfile.setFullName(request.fullName());
        siteProfile.setHeadline(request.headline());
        siteProfile.setAboutMeMarkdown(request.aboutMeMarkdown());
        siteProfile.setProfilePhotoUrl(request.profilePhotoUrl());
        siteProfile.setResumeUrl(request.resumeUrl());
        siteProfile = siteProfileRepository.save(siteProfile);
        return toResponse(siteProfile);
    }

    private SiteProfileAdminResponse toResponse(SiteProfile siteProfile) {
        return new SiteProfileAdminResponse(
                siteProfile.getId(),
                siteProfile.getFullName(),
                siteProfile.getHeadline(),
                siteProfile.getAboutMeMarkdown(),
                siteProfile.getProfilePhotoUrl(),
                siteProfile.getResumeUrl());
    }
}
