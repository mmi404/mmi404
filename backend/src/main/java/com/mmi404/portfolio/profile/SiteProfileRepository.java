package com.mmi404.portfolio.profile;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SiteProfileRepository extends JpaRepository<SiteProfile, Long> {

    Optional<SiteProfile> findFirstByOrderByIdAsc();
}
