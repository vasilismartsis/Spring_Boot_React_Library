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

//    public ArrayList<Book> books() {
//        ArrayList<Book> books = new ArrayList<Book>();
//        books.add(new Book(
//                "The book of the dead",
//                3,
//                Genre.ROMANCE
//        ));
//        books.add(new Book(
//                "book1",
//                1,
//                Genre.MYSTERY
//        ));
//        books.add(new Book(
//                "book2",
//                2,
//                Genre.THRILLER
//        ));
//        books.add(new Book(
//                "book3",
//                2,
//                Genre.HORROR
//        ));
//        books.add(new Book(
//                "book4",
//                2,
//                Genre.SCI_FI
//        ));
//        books.add(new Book(
//                "book5",
//                2,
//                Genre.ROMANCE
//        ));
//        books.add(new Book(
//                "book6",
//                2,
//                Genre.MYSTERY
//        ));
//        books.add(new Book(
//                "book7",
//                2,
//                Genre.HORROR
//        ));
//
//        return books;
//    }
}
