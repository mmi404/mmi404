package com.mmi404.portfolio.persona;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PersonaRepository extends JpaRepository<Persona, Long> {

    List<Persona> findByPublishedTrueOrderByNavOrderAsc();

    Optional<Persona> findBySlugAndPublishedTrue(String slug);
}
