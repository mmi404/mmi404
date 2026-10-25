package com.mmi404.portfolio.auth;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Bootstraps exactly one admin_user row from ADMIN_BOOTSTRAP_USERNAME/ADMIN_BOOTSTRAP_PASSWORD
 * env vars, but only when the table is empty. Never checked into a migration — intentionally
 * absent from Flyway (see V3__create_admin_user.sql).
 */
@Component
public class AdminBootstrapRunner implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(AdminBootstrapRunner.class);

    private final AdminUserRepository adminUserRepository;
    private final PasswordEncoder passwordEncoder;
    private final String bootstrapUsername;
    private final String bootstrapPassword;

    public AdminBootstrapRunner(
            AdminUserRepository adminUserRepository,
            PasswordEncoder passwordEncoder,
            @Value("${ADMIN_BOOTSTRAP_USERNAME:}") String bootstrapUsername,
            @Value("${ADMIN_BOOTSTRAP_PASSWORD:}") String bootstrapPassword) {
        this.adminUserRepository = adminUserRepository;
        this.passwordEncoder = passwordEncoder;
        this.bootstrapUsername = bootstrapUsername;
        this.bootstrapPassword = bootstrapPassword;
    }

    @Override
    public void run(String... args) {
        if (adminUserRepository.count() > 0) {
            return;
        }

        if (bootstrapUsername == null || bootstrapUsername.isBlank()
                || bootstrapPassword == null || bootstrapPassword.isBlank()) {
            log.warn("admin_user table is empty and ADMIN_BOOTSTRAP_USERNAME/ADMIN_BOOTSTRAP_PASSWORD "
                    + "are not set — skipping admin bootstrap. No admin login is possible until these "
                    + "are set and the app is restarted.");
            return;
        }

        AdminUser admin = new AdminUser();
        admin.setUsername(bootstrapUsername);
        admin.setPasswordHash(passwordEncoder.encode(bootstrapPassword));
        adminUserRepository.save(admin);
        log.info("Bootstrapped initial admin user '{}'.", bootstrapUsername);
    }
}
