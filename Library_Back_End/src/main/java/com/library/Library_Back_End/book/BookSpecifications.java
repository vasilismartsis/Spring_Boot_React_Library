package com.library.Library_Back_End.book;

import jakarta.persistence.criteria.Expression;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;

public class BookSpecifications {
    public Specification<Book> findAllByGenreAndColumnContaining(ArrayList<Genre> genres, String column, String value) {
        return (root, query, criteriaBuilder) -> {
//            Predicate genrePredicate = criteriaBuilder.equal(root.get("genre"), genre);
            Predicate genrePredicate = root.get("genre").in(genres);

            Expression<String> columnExpression = root.get(column.toLowerCase()).as(String.class);
            Predicate valuePredicate = criteriaBuilder.like(columnExpression, "%" + value.toLowerCase() + "%");

            return criteriaBuilder.and(genrePredicate, valuePredicate);
        };
    }

    public Specification<Book> findAllByColumnContaining(String column, String value) {
        return (root, query, criteriaBuilder) -> {
            Expression<String> columnExpression = root.get(column.toLowerCase()).as(String.class);
            Predicate valuePredicate = criteriaBuilder.like(columnExpression, "%" + value.toLowerCase() + "%");

            return criteriaBuilder.and(valuePredicate);
        };
    }

    public Specification<Book> findAllByGenre(ArrayList<Genre> genres) {
        return (root, query, criteriaBuilder) -> {
            Predicate genrePredicate = root.get("genre").in(genres);

            return criteriaBuilder.and(genrePredicate);
        };
    }
}
