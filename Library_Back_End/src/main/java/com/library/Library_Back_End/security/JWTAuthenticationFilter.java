package com.library.Library_Back_End.security;

import com.library.Library_Back_End.libraryUser.LibraryUserService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Optional;

public class JWTAuthenticationFilter extends OncePerRequestFilter {
    @Autowired
    private JWTToken tokenGenerator;

    @Autowired
    private LibraryUserService libraryUserService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        Optional<String> token = getJWTFromRequest(request);
        if (token.isPresent() && tokenGenerator.validateToken(token.get())) {
            // Token is valid
            String jwt = token.get();
            var username = tokenGenerator.getUsernameFromJWT(jwt);

            UserDetails userDetails = libraryUserService.loadUserByUsername(username);
            UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
            authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
            SecurityContextHolder.getContext().setAuthentication(authenticationToken);
        }
        filterChain.doFilter(request, response);
    }

    private Optional<String> getJWTFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");

        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith(SecurityConstants.BEARER)) {
            return Optional.of(bearerToken.substring(SecurityConstants.BEARER.length()));
        }
        return Optional.empty();
    }
}
