package com.library.Library_Back_End.libraryUser.dto;

import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.List;

@Data
public class LibraryUserResponse {
    private long totalLibraryUserNumber;
    private List<SingleLibraryUserResponse> singleLibraryUserResponse;

    public LibraryUserResponse(long totalLibraryUserNumber, List<SingleLibraryUserResponse> singleLibraryUserResponse) {
        this.totalLibraryUserNumber = totalLibraryUserNumber;
        this.singleLibraryUserResponse = singleLibraryUserResponse;
    }
}
