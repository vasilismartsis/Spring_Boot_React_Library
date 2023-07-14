package com.library.Library_Back_End.reservation;

import com.library.Library_Back_End.reservation.dto.ReserveRequest;
import com.library.Library_Back_End.reservation.dto.ReservationResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
    public ResponseEntity<?> reserve(@RequestBody ReserveRequest reserveRequest) {
        return reservationService.reserve(reserveRequest);
    }
}
