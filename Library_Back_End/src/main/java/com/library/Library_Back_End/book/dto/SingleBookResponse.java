package com.library.Library_Back_End.book.dto;

import com.library.Library_Back_End.auditing.dto.AuditableResource;
import com.library.Library_Back_End.book.Genre;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.Date;
import java.util.List;

@Data
@EqualsAndHashCode(callSuper = true)
public class SingleBookResponse extends AuditableResource<String> {
    private long id;
    private String title;
    private Genre genre;
    private int quantity;

    public SingleBookResponse(String createdBy, String lastModifiedBy, Date creationDate, Date lastModifiedDate, long id, String title, Genre  genre, int quantity) {
        super(createdBy, creationDate, lastModifiedBy, lastModifiedDate);
        this.id = id;
        this.title = title;
        this.genre = genre;
        this.quantity = quantity;
    }
}
