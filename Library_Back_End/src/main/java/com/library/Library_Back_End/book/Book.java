package com.library.Library_Back_End.book;

import com.library.Library_Back_End.libraryUser.LibraryUser;
import com.library.Library_Back_End.reservation.Reservation;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.LastModifiedBy;

import java.util.Date;
import java.util.List;

import static jakarta.persistence.TemporalType.TIMESTAMP;


@Entity
@Table
@Data
@EqualsAndHashCode
public class Book {
    @Id
    @SequenceGenerator(
            name = "book_sequence",
            sequenceName = "book_sequence",
            allocationSize = 1
    )
    @GeneratedValue(
            strategy = GenerationType.SEQUENCE,
            generator = "book_sequence"
    )
    @Column
    private long id;
    @Column
    private String title;
    @Column
    private Genre genre;
    @OneToMany(mappedBy = "book", cascade = CascadeType.REMOVE, orphanRemoval = true)
    private List<Reservation> reservations;
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

    public Book() {
    }

    public Book(long id, String title, Genre genre) {
        this.id = id;
        this.title = title;
        this.genre = genre;
    }

    public Book(String title, Genre genre) {
        this.title = title;
        this.genre = genre;
    }
}
