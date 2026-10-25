package com.mmi404.portfolio.profile;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClubActivityRepository extends JpaRepository<ClubActivity, Long> {

    List<ClubActivity> findAllByOrderBySortOrderAsc();
}
