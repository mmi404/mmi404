package com.mmi404.portfolio.profile;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EducationRepository extends JpaRepository<Education, Long> {

    List<Education> findAllByOrderBySortOrderAsc();
}
