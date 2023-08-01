package com.library.Library_Back_End.reservation.dto;

import lombok.Data;

import java.util.List;

@Data
public class ReservationResponse {
    private long totalReservations;
    private List<SingleReservationResponse> singleReservationResponse;

    public ReservationResponse(long totalReservations, List<SingleReservationResponse> singleReservationResponse) {
        this.totalReservations = totalReservations;
        this.singleReservationResponse = singleReservationResponse;
    }
}
