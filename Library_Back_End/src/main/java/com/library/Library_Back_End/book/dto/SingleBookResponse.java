package com.library.Library_Back_End.book.dto;

import com.library.Library_Back_End.auditing.dto.AuditableResource;
import com.library.Library_Back_End.book.Genre;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.Date;

@Data
@EqualsAndHashCode(callSuper = true)
public class SingleBookResponse extends AuditableResource<String> {
    private long id;
    private String title;
    private Genre genre;

    public SingleBookResponse(String createdBy, String lastModifiedBy, Date creationDate, Date lastModifiedDate, long id, String title, Genre genre) {
        super(createdBy, creationDate, lastModifiedBy, lastModifiedDate);
        this.id = id;
        this.title = title;
        this.genre = genre;
    }
}
