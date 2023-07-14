package com.library.Library_Back_End.book;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Configuration
public class BookConfiguration {

    public Genre[] genres() {
        return Genre.values();
    }

    public ArrayList<Book> books() {
        ArrayList<Book> books = new ArrayList<Book>();
        books.add(new Book(
                "The book of the dead",
                Genre.ROMANCE,
                3
        ));
        books.add(new Book(
                "book1",
                Genre.MYSTERY,
                1
        ));
        books.add(new Book(
                "book2",
                Genre.THRILLER,
                2
        ));
        books.add(new Book(
                "book3",
                Genre.HORROR,
                2
        ));
        books.add(new Book(
                "book4",
                Genre.SCI_FI,
                2
        ));
        books.add(new Book(
                "book5",
                Genre.ROMANCE,
                2
        ));
        books.add(new Book(
                "book6",
                Genre.MYSTERY,
                2
        ));
        books.add(new Book(
                "book7",
                Genre.HORROR,
                2
        ));

        return books;
    }
}
