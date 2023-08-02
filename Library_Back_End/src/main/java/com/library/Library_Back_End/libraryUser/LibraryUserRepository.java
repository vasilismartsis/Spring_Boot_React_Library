package com.library.Library_Back_End.libraryUser;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LibraryUserRepository extends JpaRepository<LibraryUser, Long> {
    Optional<LibraryUser> findByUsername(String username);

    Boolean existsByUsername(String username);

    Page<LibraryUser> findAll(Specification<LibraryUser> libraryUserSpecification, Pageable pageable);

//    List<LibraryUser> findByCreatedByUsernameContaining(String searchValue);
}
