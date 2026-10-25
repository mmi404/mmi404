package com.mmi404.portfolio.developer.project;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProjectImageRepository extends JpaRepository<ProjectImage, Long> {

    List<ProjectImage> findByProjectIdOrderBySortOrderAsc(Long projectId);
}
