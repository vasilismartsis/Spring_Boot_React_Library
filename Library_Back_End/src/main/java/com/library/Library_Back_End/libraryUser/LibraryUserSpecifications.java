package com.library.Library_Back_End.libraryUser;

import com.library.Library_Back_End.book.Book;
import com.library.Library_Back_End.book.Genre;
import jakarta.persistence.criteria.Expression;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class LibraryUserSpecifications {
    public Specification<LibraryUser> findAllByRoleAndColumnContaining(List<RoleEnum> roles, String column, String value) {
        return (root, query, criteriaBuilder) -> {
            Join<LibraryUser, Role> roleJoin = root.join("roles");
            Predicate rolePredicate = roleJoin.get("role").in(roles);

            Expression<String> columnExpression;
            if (column.equals("createdBy") || column.equals("lastModifiedBy")) {
                columnExpression = root.get(column).get("username").as(String.class);
            } else {
                columnExpression = root.get(column).as(String.class);
            }
            Predicate valuePredicate = criteriaBuilder.like(columnExpression, "%" + value + "%");

            return criteriaBuilder.and(rolePredicate, valuePredicate);
        };
    }

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

    public Specification<LibraryUser> findAllByRole(List<RoleEnum> roles) {
        return (root, query, criteriaBuilder) -> {
            Join<LibraryUser, Role> roleJoin = root.join("roles");
            Predicate rolePredicate = roleJoin.get("role").in(roles);

            return criteriaBuilder.and(rolePredicate);
        };
    }
}
