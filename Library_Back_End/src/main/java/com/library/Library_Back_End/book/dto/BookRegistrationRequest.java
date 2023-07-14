package com.library.Library_Back_End.book.dto;

import com.library.Library_Back_End.book.Genre;
import lombok.Data;

import java.util.List;

@Data
public class BookRegistrationRequest {
    private String bookTitle;
    private Genre bookGenre;
    private int quantity;
}
