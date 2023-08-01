package com.library.Library_Back_End.libraryUser.dto;

import com.library.Library_Back_End.libraryUser.RoleEnum;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.Date;
import java.util.List;

@AllArgsConstructor
@Data
public class AddLibraryUserRequest {
    private long id;
    private String username;
    private String password;
    private List<RoleEnum> roles;
    private String createdBy;
    private String lastModifiedBy;
    private Date creationDate;
    private Date lastModifiedDate;
}
