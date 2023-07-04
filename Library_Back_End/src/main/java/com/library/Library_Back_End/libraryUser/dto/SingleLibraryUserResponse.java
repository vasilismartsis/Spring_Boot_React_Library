package com.library.Library_Back_End.libraryUser.dto;

import com.library.Library_Back_End.auditing.dto.AuditableResource;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.Date;

@Data
@EqualsAndHashCode(callSuper = true)
public class SingleLibraryUserResponse extends AuditableResource<String> {
    private long id;
    private String username;

    public SingleLibraryUserResponse(String createdBy, String lastModifiedBy, Date creationDate, Date lastModifiedDate, long id, String username) {
        super(createdBy, creationDate, lastModifiedBy, lastModifiedDate);
        this.id = id;
        this.username = username;
    }
}
