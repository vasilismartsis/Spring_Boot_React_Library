package com.library.Library_Back_End.libraryUser.dto;

import com.library.Library_Back_End.libraryUser.RoleEnum;
import lombok.Data;

import java.util.Date;
import java.util.List;

@Data
public class UpdateLibraryUserRequest {
    private long id;
    private String username;
    private String password;
    private List<RoleEnum> roles;
    private String lastModifiedBy;
}
