package com.library.Library_Back_End.reservation.dto;

import lombok.Data;

@Data
public class ReservationRequest {

    private String username;
    private long bookId;
}
