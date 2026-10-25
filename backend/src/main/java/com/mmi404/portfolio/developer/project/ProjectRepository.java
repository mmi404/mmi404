package com.mmi404.portfolio.developer.project;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProjectRepository extends JpaRepository<Project, Long> {

    @EntityGraph(attributePaths = {"techTags", "projectImages"})
    List<Project> findByPersonaIdAndPublishedTrueOrderBySortOrderAsc(Long personaId);

    @EntityGraph(attributePaths = {"techTags", "projectImages"})
    Optional<Project> findBySlugAndPersonaIdAndPublishedTrue(String slug, Long personaId);
}
