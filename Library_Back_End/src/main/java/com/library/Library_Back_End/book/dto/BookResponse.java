package com.library.Library_Back_End.book.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class BookResponse {
    private long totalBooks;
    private long totalZeroQuantityBooks;
    private long totalBookCopies;
    private long totalBookCopiesReserved;
    private List<SingleBookResponse> singleBookResponse;
}
