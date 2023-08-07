package com.library.Library_Back_End.libraryUser.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@AllArgsConstructor
@Data
public class ChangePasswordRequest {
    private String username;
    private String currentPassword;
    private String newPassword;

    public ChangePasswordRequest(String username, String newPassword) {
        this.username = username;
        this.newPassword = newPassword;
    }
}
