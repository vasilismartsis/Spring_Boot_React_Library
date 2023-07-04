package com.library.Library_Back_End.book.dto;

import lombok.Data;

import java.util.List;

@Data
public class BookResponse {
    private long totalBookNumber;
    private List<SingleBookResponse> singleBookResponse;

    public BookResponse(long totalBookNumber, List<SingleBookResponse> singleBookResponse) {
        this.totalBookNumber = totalBookNumber;
        this.singleBookResponse = singleBookResponse;
    }
}
