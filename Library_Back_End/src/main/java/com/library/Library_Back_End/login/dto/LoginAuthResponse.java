package com.library.Library_Back_End.login.dto;

import lombok.Data;

@Data
public class LoginAuthResponse {
    private String accessToken;
    private String tokenType = "Bearer ";
    private String role;

    public LoginAuthResponse(String accessToken) {
        this.accessToken = accessToken;
    }

    public LoginAuthResponse(String accessToken, String role) {
        this.accessToken = accessToken;
        this.role = role;
    }
}
