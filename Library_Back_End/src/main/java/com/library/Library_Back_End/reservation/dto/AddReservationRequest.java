package com.library.Library_Back_End.reservation.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@AllArgsConstructor
@Data
public class AddReservationRequest {

    private String username;
    private long bookId;
}
