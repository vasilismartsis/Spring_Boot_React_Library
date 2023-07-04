package com.library.Library_Back_End.login;

import com.library.Library_Back_End.login.dto.LoginAuthResponse;
import com.library.Library_Back_End.login.dto.LoginRequest;
import com.library.Library_Back_End.security.JWTToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Service;

@Service
public class LoginService {
    private final AuthenticationManager authenticationManager;
    private final JWTToken jwtToken;

    @Autowired
    public LoginService(AuthenticationManager authenticationManager, JWTToken jwtToken) {
        this.authenticationManager = authenticationManager;
        this.jwtToken = jwtToken;
    }

    public ResponseEntity<LoginAuthResponse> login(LoginRequest loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getUsername()
                            , loginRequest.getPassword()
                    ));
//            SecurityContextHolder.getContext().setAuthentication(authentication);
            // Authentication successful
            String token = jwtToken.generateToken(authentication);
            String role = authentication.getAuthorities().toArray()[0].toString();

            return new ResponseEntity<>(new LoginAuthResponse(token, role), HttpStatus.OK);
        } catch (AuthenticationException e) {
            // Authentication failed
            return new ResponseEntity<>(new LoginAuthResponse("Wrong Credentials!"), HttpStatus.UNAUTHORIZED);
        }
    }
}
