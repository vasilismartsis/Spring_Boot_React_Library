package com.library.Library_Back_End.reservation.dto;

import com.library.Library_Back_End.auditing.dto.AuditableResource;
import com.library.Library_Back_End.libraryUser.LibraryUser;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDate;
import java.util.Date;

@Data
@EqualsAndHashCode(callSuper = true)
public class SingleReservationResponse extends AuditableResource<String> {
    private long id;
    private String username;
    private String bookTitle;
    private LocalDate reservationDate;
    private LocalDate expirationDate;

    public SingleReservationResponse(String createdBy, String lastModifiedBy, Date creationDate, Date lastModifiedDate, long id, String username, String bookTitle, LocalDate reservationDate, LocalDate expirationDate) {
        super(createdBy, creationDate, lastModifiedBy, lastModifiedDate);
        this.id = id;
        this.username = username;
        this.bookTitle = bookTitle;
        this.reservationDate = reservationDate;
        this.expirationDate = expirationDate;
    }
}
