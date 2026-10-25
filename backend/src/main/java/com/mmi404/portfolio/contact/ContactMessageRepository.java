package com.mmi404.portfolio.contact;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ContactMessageRepository extends JpaRepository<ContactMessage, Long> {

    Page<ContactMessage> findAllByOrderBySubmittedAtDesc(Pageable pageable);

    Page<ContactMessage> findByReadOrderBySubmittedAtDesc(Boolean read, Pageable pageable);
}
