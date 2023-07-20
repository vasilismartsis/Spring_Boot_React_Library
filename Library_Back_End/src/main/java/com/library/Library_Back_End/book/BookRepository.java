package com.library.Library_Back_End.book;

import com.library.Library_Back_End.libraryUser.LibraryUser;
import io.micrometer.common.lang.NonNullApi;
import jakarta.persistence.criteria.Expression;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
@NonNullApi
public interface BookRepository extends JpaRepository<Book, Long> {
    Page<Book> findAll(Specification<Book> bookSpecification, Pageable pageable);

    Optional<Book> findByTitle(String title);

    long countByQuantity(int quantity);

    @Query("SELECT SUM(b.quantity) FROM Book b")
    int sumQuantity();
}
