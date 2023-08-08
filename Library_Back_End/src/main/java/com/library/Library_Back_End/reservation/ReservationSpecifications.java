package com.library.Library_Back_End.reservation;

import com.library.Library_Back_End.libraryUser.LibraryUser;
import jakarta.persistence.criteria.Expression;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;

@Component
public class ReservationSpecifications {
    public Specification<Reservation> findAllByLibraryUserAndColumnContaining(LibraryUser libraryUser, String column, String value) {
        return (root, query, criteriaBuilder) -> {
            Expression<String> columnExpression;
            if (column.equals("libraryUser") || column.equals("createdBy") || column.equals("lastModifiedBy")) {
                columnExpression = root.get(column).get("username").as(String.class);
            } else if (column.equals("book")) {
                columnExpression = root.get(column).get("title").as(String.class);
            } else {
                columnExpression = root.get(column).as(String.class);
            }
            Predicate valuePredicate = criteriaBuilder.like(criteriaBuilder.lower(columnExpression), "%" + value + "%");
            Predicate libraryUserPredicate = criteriaBuilder.equal(root.get("libraryUser"), libraryUser);

            if (libraryUser == null) {
                return criteriaBuilder.and(valuePredicate);
            } else {
                return criteriaBuilder.and(valuePredicate, libraryUserPredicate);
            }
        };
    }

    public Specification<Reservation> findAllByLibraryUser(LibraryUser libraryUser) {
        return (root, query, criteriaBuilder) -> {
            Predicate libraryUserPredicate = criteriaBuilder.equal(root.get("libraryUser"), libraryUser);
            return criteriaBuilder.and(libraryUserPredicate);
        };
    }
}
