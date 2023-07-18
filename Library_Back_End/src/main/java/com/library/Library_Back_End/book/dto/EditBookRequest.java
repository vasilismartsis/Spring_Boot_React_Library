package com.library.Library_Back_End.book.dto;

import com.library.Library_Back_End.book.Genre;
import lombok.Data;

@Data
public class EditBookRequest {
    private long id;
    private String title;
    private int quantity;
    private Genre genre;
}
