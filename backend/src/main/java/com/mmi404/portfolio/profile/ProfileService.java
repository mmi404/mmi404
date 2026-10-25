package com.mmi404.portfolio.profile;

import com.mmi404.portfolio.profile.dto.ContactLinkResponse;
import com.mmi404.portfolio.profile.dto.EducationResponse;
import com.mmi404.portfolio.profile.dto.SiteProfileResponse;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class ProfileService {

    private final SiteProfileRepository siteProfileRepository;
    private final EducationRepository educationRepository;
    private final ContactLinkRepository contactLinkRepository;

    public ProfileService(
            SiteProfileRepository siteProfileRepository,
            EducationRepository educationRepository,
            ContactLinkRepository contactLinkRepository) {
        this.siteProfileRepository = siteProfileRepository;
        this.educationRepository = educationRepository;
        this.contactLinkRepository = contactLinkRepository;
    }

    public SiteProfileResponse getProfile() {
        SiteProfile siteProfile = siteProfileRepository.findFirstByOrderByIdAsc().orElse(null);

        List<EducationResponse> education = educationRepository.findAllByOrderBySortOrderAsc().stream()
                .map(e -> new EducationResponse(
                        e.getInstitution(), e.getDegree(), e.getFieldOfStudy(), e.getStartDate(), e.getEndDate(), e.getDescription()))
                .toList();

        List<ContactLinkResponse> contactLinks = contactLinkRepository.findAllByOrderBySortOrderAsc().stream()
                .map(c -> new ContactLinkResponse(c.getLabel(), c.getUrl(), c.getIconKey()))
                .toList();

        if (siteProfile == null) {
            return new SiteProfileResponse(null, null, null, null, null, education, contactLinks);
        }

        return new SiteProfileResponse(
                siteProfile.getFullName(),
                siteProfile.getHeadline(),
                siteProfile.getAboutMeMarkdown(),
                siteProfile.getProfilePhotoUrl(),
                siteProfile.getResumeUrl(),
                education,
                contactLinks);
    }
}
