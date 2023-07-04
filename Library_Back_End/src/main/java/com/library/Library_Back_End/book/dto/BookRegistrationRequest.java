package com.library.Library_Back_End.book.dto;

import com.library.Library_Back_End.book.Genre;
import lombok.Data;

@Data
public class BookRegistrationRequest {
    private String bookTitle;
    private Genre bookGenre;
}
