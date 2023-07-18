package com.library.Library_Back_End.reservation;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.library.Library_Back_End.book.Book;
import com.library.Library_Back_End.libraryUser.LibraryUser;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.LastModifiedBy;

import java.time.LocalDate;
import java.util.Date;

import static jakarta.persistence.TemporalType.TIMESTAMP;

@Entity
@Table
@NoArgsConstructor
@Data
@EqualsAndHashCode
public class Reservation {
    @Id
    @SequenceGenerator(
            name = "reservation_sequence",
            sequenceName = "reservation_sequence",
            allocationSize = 1
    )
    @GeneratedValue(
            strategy = GenerationType.SEQUENCE,
            generator = "reservation_sequence"
    )
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

    public Reservation(LibraryUser libraryUser, Book book, LibraryUser createdBy, LibraryUser lastModifiedBy) {
        this.libraryUser = libraryUser;
        this.book = book;
        this.createdBy = createdBy;
        this.lastModifiedBy = lastModifiedBy;
    }
}
