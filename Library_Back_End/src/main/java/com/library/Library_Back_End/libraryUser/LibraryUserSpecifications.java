package com.library.Library_Back_End.libraryUser;

import jakarta.persistence.criteria.Expression;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

public class LibraryUserSpecifications {
    public Specification<LibraryUser> findAllByColumnContaining(String column, String value) {
        return (root, query, criteriaBuilder) -> {
            Expression<String> columnExpression;
            if (column.equals("createdBy") || column.equals("lastModifiedBy")) {
                columnExpression = root.get(column).get("username").as(String.class);
            } else {
                columnExpression = root.get(column).as(String.class);
            }
            Predicate valuePredicate = criteriaBuilder.like(columnExpression, "%" + value + "%");

            return criteriaBuilder.and(valuePredicate);
        };
    }
}
