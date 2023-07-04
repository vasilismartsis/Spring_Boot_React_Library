package com.library.Library_Back_End.auditing;

import com.library.Library_Back_End.libraryUser.LibraryUser;
import com.library.Library_Back_End.libraryUser.LibraryUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.AuditorAware;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.Optional;

public class SpringSecurityAuditorAware implements AuditorAware<Long> {
    @Autowired
    private LibraryUserRepository libraryUserRepository;

    @Override
    public Optional<Long> getCurrentAuditor() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication != null && authentication.getPrincipal() instanceof UserDetails) {
                LibraryUser libraryUser = libraryUserRepository.findByUsername(authentication.getName()).orElseThrow(() -> new UsernameNotFoundException("Username not found"));
                return Optional.of(libraryUser.getId());
            }
            return Optional.empty();
        } catch (AuthenticationException e) {
            return Optional.empty();
        }
    }
}
