package com.library.Library_Back_End.reservation;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.library.Library_Back_End.book.Book;
import com.library.Library_Back_End.libraryUser.LibraryUser;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.LastModifiedBy;

import java.time.LocalDate;
import java.util.Date;

import static jakarta.persistence.TemporalType.TIMESTAMP;

@Entity
@Table
@EqualsAndHashCode
@NoArgsConstructor
@Getter
@Setter
public class Reservation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    @ManyToOne
    private LibraryUser libraryUser;
    @ManyToOne
    private Book book;
    @Column(name = "reservation_date")
    private LocalDate reservationDate;
    @Column(name = "expiration_date")
    private LocalDate expirationDate;
    @ManyToOne
    @CreatedBy
    protected LibraryUser createdBy;
    @ManyToOne
    @LastModifiedBy
    protected LibraryUser lastModifiedBy;
    @Column(name = "creation_date")
    @CreationTimestamp
    @Temporal(TIMESTAMP)
    protected Date creationDate;
    @Column(name = "last_modified_date")
    @UpdateTimestamp
    @Temporal(TIMESTAMP)
    protected Date lastModifiedDate;

    public Reservation(LibraryUser libraryUser, Book book, LocalDate reservationDate, LocalDate expirationDate, LibraryUser createdBy, LibraryUser lastModifiedBy) {
        this.libraryUser = libraryUser;
        this.book = book;
        this.reservationDate = reservationDate;
        this.expirationDate = expirationDate;
        this.createdBy = createdBy;
        this.lastModifiedBy = lastModifiedBy;
    }
}
