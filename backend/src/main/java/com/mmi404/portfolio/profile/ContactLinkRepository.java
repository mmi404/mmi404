package com.mmi404.portfolio.profile;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ContactLinkRepository extends JpaRepository<ContactLink, Long> {

    List<ContactLink> findAllByOrderBySortOrderAsc();
}
