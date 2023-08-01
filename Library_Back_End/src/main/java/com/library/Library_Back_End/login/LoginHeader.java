package com.library.Library_Back_End.login;

import lombok.AllArgsConstructor;
import lombok.Data;

@AllArgsConstructor
@Data
public class LoginHeader {
    private String token;
    private String role;
}
