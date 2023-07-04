package com.library.Library_Back_End.reservation.dto;

import lombok.Data;

import java.util.List;

@Data
public class ReservationResponse {
    private long totalReservationNumber;
    private List<SingleReservationResponse> singleReservationResponse;

    public ReservationResponse(long totalReservationNumber, List<SingleReservationResponse> singleReservationResponse) {
        this.totalReservationNumber = totalReservationNumber;
        this.singleReservationResponse = singleReservationResponse;
    }
}
