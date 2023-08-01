package com.library.Library_Back_End.login;

import com.library.Library_Back_End.login.dto.LoginRequest;
import com.library.Library_Back_End.security.JWTToken;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.TestingAuthenticationToken;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.authority.AuthorityUtils;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

public class LoginServiceTest {

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JWTToken jwtToken;

    @InjectMocks
    private LoginService loginService;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testLogin() {
        // Mock the necessary data for the test
        String username = "testUser";
        String password = "testPassword";
        String token = "testToken";
        String role = "ROLE_CUSTOMER";

        LoginRequest loginRequest = new LoginRequest(username, password);

        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(username, password);
        Authentication authentication = new TestingAuthenticationToken(username, password, AuthorityUtils.createAuthorityList(role));

        when(authenticationManager.authenticate(authenticationToken)).thenReturn(authentication);
        when(jwtToken.generateToken(authentication)).thenReturn(token);

        // Execute the method to be tested
        LoginHeader loginHeader = loginService.login(loginRequest);

        // Assert the result
        assertNotNull(loginHeader);
        assertEquals(token, loginHeader.getToken());
        assertEquals(role, loginHeader.getRole());
    }

    @Test
    public void testLogin_InvalidCredentials() {
        // Mock the necessary data for the test
        String username = "testUser";
        String password = "testPassword";

        LoginRequest loginRequest = new LoginRequest(username, password);

        // Simulate authentication exception
        when(authenticationManager.authenticate(any())).thenThrow(new BadCredentialsException("Invalid credentials"));

        // Execute the method to be tested
        assertThrows(AuthenticationException.class, () -> loginService.login(loginRequest));
    }
}