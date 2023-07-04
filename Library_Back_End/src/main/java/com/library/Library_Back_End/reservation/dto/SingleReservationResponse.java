package com.library.Library_Back_End.reservation.dto;

import com.library.Library_Back_End.libraryUser.LibraryUser;
import lombok.Data;

import java.time.LocalDate;
import java.util.Date;

@Data
public class SingleReservationResponse {
    private long id;
    private String username;
    private String bookTitle;
    private LocalDate reservationDate;
    private LocalDate expirationDate;
    protected LibraryUser createdBy;
    protected LibraryUser lastModifiedBy;
    protected Date creationDate;
    protected Date lastModifiedDate;

    public SingleReservationResponse(long id, String username, String bookTitle, LocalDate reservationDate, LocalDate expirationDate, LibraryUser createdBy, LibraryUser lastModifiedBy, Date creationDate, Date lastModifiedDate) {
        this.id = id;
        this.username = username;
        this.bookTitle = bookTitle;
        this.reservationDate = reservationDate;
        this.expirationDate = expirationDate;
        this.createdBy = createdBy;
        this.lastModifiedBy = lastModifiedBy;
        this.creationDate = creationDate;
        this.lastModifiedDate = lastModifiedDate;
    }
}
