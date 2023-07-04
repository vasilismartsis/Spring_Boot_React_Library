package com.library.Library_Back_End.login;


import com.library.Library_Back_End.login.dto.LoginAuthResponse;
import com.library.Library_Back_End.login.dto.LoginRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(path = "api")
public class LoginController {
    private final LoginService loginService;

    public LoginController(LoginService loginService) {
        this.loginService = loginService;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginAuthResponse> login(@RequestBody LoginRequest loginRequest) {
        return loginService.login(loginRequest);
    }
}
