package com.library.Library_Back_End.libraryUser.dto;

import lombok.Data;

import java.util.List;

@Data
public class LibraryUserResponse {
    private long totalLibraryUsers;
    private List<SingleLibraryUserResponse> singleLibraryUserResponse;

    public LibraryUserResponse(long totalLibraryUsers, List<SingleLibraryUserResponse> singleLibraryUserResponse) {
        this.totalLibraryUsers = totalLibraryUsers;
        this.singleLibraryUserResponse = singleLibraryUserResponse;
    }
}
