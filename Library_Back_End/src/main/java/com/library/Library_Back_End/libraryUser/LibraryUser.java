package com.library.Library_Back_End.libraryUser;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.LastModifiedBy;

import java.util.Date;
import java.util.List;

import static jakarta.persistence.TemporalType.TIMESTAMP;

@EqualsAndHashCode
@NoArgsConstructor
@Entity
@Table
@Getter
@Setter
public class LibraryUser {
    @Id
    @Column
    @SequenceGenerator(
            name = "user_sequence",
            sequenceName = "user_sequence",
            allocationSize = 1
    )
    @GeneratedValue(
            strategy = GenerationType.SEQUENCE,
            generator = "user_sequence"
    )
    private long id;
    @Column
    private String username;
    @Column
    private String password;
    @ManyToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @Column
    @JoinTable(name = "User_Role", joinColumns = @JoinColumn(name = "user_id", referencedColumnName = "id"),
            inverseJoinColumns = @JoinColumn(name = "role_id", referencedColumnName = "id"))
    private List<Role> roles;
    @ManyToOne
    @CreatedBy
    private LibraryUser createdBy;
    @ManyToOne
    @LastModifiedBy
    private LibraryUser lastModifiedBy;
    @Column(name = "creation_date")
    @CreationTimestamp
    @Temporal(TIMESTAMP)
    private Date creationDate;
    @Column(name = "last_modified_date")
    @UpdateTimestamp
    @Temporal(TIMESTAMP)
    private Date lastModifiedDate;

    public LibraryUser(String username, String password, List<Role> roles) {
        this.username = username;
        this.password = password;
        this.roles = roles;
    }
}
