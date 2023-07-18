package com.library.Library_Back_End.reservation;

import com.library.Library_Back_End.libraryUser.LibraryUser;
import jakarta.persistence.criteria.Expression;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

public class ReservationSpecifications {

    public Specification<Reservation> findAllByLibraryUserAndColumnContaining(LibraryUser libraryUser, String column, String value) {
        return (root, query, criteriaBuilder) -> {
            Expression<String> columnExpression;
            if (column.equals("createdBy") || column.equals("lastModifiedBy")) {
                columnExpression = root.get(column).get("username").as(String.class);
            } else if (column.equals("book")) {
                columnExpression = root.get(column).get("title").as(String.class);
            } else {
                columnExpression = root.get(column).as(String.class);
            }
            Predicate valuePredicate = criteriaBuilder.like(columnExpression, "%" + value + "%");
            Predicate libraryUserPredicate;
            if (libraryUser == null) {
                libraryUserPredicate = valuePredicate;
            } else {
                libraryUserPredicate = criteriaBuilder.equal(root.get("libraryUser"), libraryUser);
            }

            return criteriaBuilder.and(libraryUserPredicate);
        };
    }
}
