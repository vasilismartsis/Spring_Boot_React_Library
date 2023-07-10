package com.library.Library_Back_End.libraryUser.dto;

import com.library.Library_Back_End.auditing.dto.AuditableResource;
import com.library.Library_Back_End.libraryUser.Role;
import com.library.Library_Back_End.libraryUser.RoleEnum;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.Date;
import java.util.List;

@Data
@EqualsAndHashCode(callSuper = true)
public class SingleLibraryUserResponse extends AuditableResource<String> {
    private long id;
    private String username;
    private String password;
    private List<RoleEnum> roles;

    public SingleLibraryUserResponse(String createdBy, String lastModifiedBy, Date creationDate, Date lastModifiedDate, long id, String username, String password, List<RoleEnum> roles) {
        super(createdBy, creationDate, lastModifiedBy, lastModifiedDate);
        this.id = id;
        this.username = username;
        this.password = password;
        this.roles = roles;
    }
}
