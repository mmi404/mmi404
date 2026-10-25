package com.mmi404.portfolio.profile;

import com.mmi404.portfolio.profile.dto.SiteProfileResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    private final ProfileService profileService;

    public ProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }

    @GetMapping
    public SiteProfileResponse getProfile() {
        return profileService.getProfile();
    }
}
