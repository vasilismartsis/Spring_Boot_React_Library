package com.library.Library_Back_End.book.dto;

import com.library.Library_Back_End.book.Genre;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class EditBookRequest {
    private long id;
    private String title;
    private int quantity;
    private Genre genre;
}
