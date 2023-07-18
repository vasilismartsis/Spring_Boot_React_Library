package com.library.Library_Back_End.reservation;

import com.library.Library_Back_End.libraryUser.dto.AddLibraryUserRequest;
import com.library.Library_Back_End.libraryUser.dto.DeleteLibraryUserRequest;
import com.library.Library_Back_End.libraryUser.dto.EditLibraryUserRequest;
import com.library.Library_Back_End.reservation.dto.AddReservationRequest;
import com.library.Library_Back_End.reservation.dto.DeleteReservationRequest;
import com.library.Library_Back_End.reservation.dto.EditReservationRequest;
import com.library.Library_Back_End.reservation.dto.ReservationResponse;
import org.springframework.beans.factory.annotation.Autowired;
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
    public ReservationResponse getReservations(
            @RequestParam String user,
            @RequestParam int page,
            @RequestParam String order,
            @RequestParam String sortedColumn,
            @RequestParam String searchColumn,
            @RequestParam String searchValue
    ) {
        return reservationService.getReservations(user, page, order, sortedColumn, searchColumn, searchValue);
    }

    @PostMapping("/addReservation")
    public ResponseEntity<?> addReservation(@RequestBody AddReservationRequest addReservationRequest) {
        return reservationService.addReservation(addReservationRequest);
    }

    @PostMapping("/editReservation")
    public ResponseEntity<String> editReservation(@RequestBody EditReservationRequest editReservationRequest) {
        return reservationService.editReservation(editReservationRequest);
    }

    @PostMapping("/deleteReservation")
    public ResponseEntity<String> deleteReservation(@RequestBody DeleteReservationRequest deleteReservationRequest) {
        return reservationService.deleteReservation(deleteReservationRequest);
    }
}
