package com.library.Library_Back_End.auditing;

import com.library.Library_Back_End.libraryUser.LibraryUser;
import com.library.Library_Back_End.libraryUser.LibraryUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.domain.AuditorAware;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

import java.util.Optional;

@Configuration
@EnableJpaAuditing
public class AuditingConfig {
    private final LibraryUserRepository libraryUserRepository;

    @Autowired
    public AuditingConfig(LibraryUserRepository libraryUserRepository) {
        this.libraryUserRepository = libraryUserRepository;
    }

    @Bean
    public AuditorAware<Long> auditorAware() {
        return new SpringSecurityAuditorAware();
    }
    
    public LibraryUser getAuditor() {
        Optional<Long> currentAuditorId = auditorAware().getCurrentAuditor();
        return libraryUserRepository.findById(currentAuditorId.get()).orElseThrow();
    }
}
