package com.library.Library_Back_End.Exception.dto;

import lombok.Data;

import java.util.Date;

@Data
public class ErrorResponse {
    private int status;
    private Date timestamp;
    private String message;
    private String description;
}
