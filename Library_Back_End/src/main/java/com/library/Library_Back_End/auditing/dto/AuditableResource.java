package com.library.Library_Back_End.auditing.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
public abstract class AuditableResource<U> {
    protected U createdBy;
    protected Date creationDate;
    protected U lastModifiedBy;
    protected Date lastModifiedDate;

    public AuditableResource(U createdBy, Date creationDate, U lastModifiedBy, Date lastModifiedDate) {
        this.createdBy = createdBy;
        this.creationDate = creationDate;
        this.lastModifiedBy = lastModifiedBy;
        this.lastModifiedDate = lastModifiedDate;
    }
}
