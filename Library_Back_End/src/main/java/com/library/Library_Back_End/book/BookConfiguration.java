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
                Genre.ROMANCE
        ));
        books.add(new Book(
                "book1",
                Genre.MYSTERY
        ));
        books.add(new Book(
                "book2",
                Genre.THRILLER
        ));
        books.add(new Book(
                "book3",
                Genre.HORROR
        ));
        books.add(new Book(
                "book4",
                Genre.SCI_FI
        ));
        books.add(new Book(
                "book5",
                Genre.ROMANCE
        ));
        books.add(new Book(
                "book6",
                Genre.MYSTERY
        ));
        books.add(new Book(
                "book7",
                Genre.HORROR
        ));

        return books;
    }
}
