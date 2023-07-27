package com.library.Library_Back_End.libraryUser.dto;

import com.library.Library_Back_End.libraryUser.RoleEnum;
import lombok.Data;

import java.util.List;

@Data
public class EditLibraryUserRequest {
    private long id;
    private String username;
    private String password;
    private List<RoleEnum> roles;
}