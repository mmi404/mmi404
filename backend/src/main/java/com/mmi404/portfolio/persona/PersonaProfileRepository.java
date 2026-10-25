package com.mmi404.portfolio.persona;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PersonaProfileRepository extends JpaRepository<PersonaProfile, Long> {

    Optional<PersonaProfile> findByPersonaId(Long personaId);
}
