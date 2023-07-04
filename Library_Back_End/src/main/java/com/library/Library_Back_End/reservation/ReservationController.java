package com.library.Library_Back_End.reservation;

import com.library.Library_Back_End.reservation.dto.ReservationRequest;
import com.library.Library_Back_End.reservation.dto.ReservationResponse;
import jakarta.websocket.server.PathParam;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;

@RestController
@RequestMapping(path = "api/reservation")
public class ReservationController {
    private final ReservationService reservationService;

    @Autowired
    public ReservationController(ReservationService reservationService) {
        this.reservationService = reservationService;
    }

    @GetMapping("/getReservations")
    public ReservationResponse getReservations(@RequestParam int page,
                                               @RequestParam String order,
                                               @RequestParam String sortedColumn,
                                               @RequestParam String searchColumn,
                                               @RequestParam String searchValue) {
        return reservationService.getReservations(page, order, sortedColumn, searchColumn, searchValue);
    }

    @PostMapping("/reserve")
    public void reserve(@RequestBody ReservationRequest reservationRequest) {
        reservationService.reserve(reservationRequest);
    }
}
