package com.library.Library_Back_End.book.dto;

import com.library.Library_Back_End.book.Genre;
import lombok.AllArgsConstructor;
import lombok.Data;

@AllArgsConstructor
@Data
public class AddBookRequest {
    private String title;
    private int quantity;
    private Genre genre;
    private String createdBy;
}
