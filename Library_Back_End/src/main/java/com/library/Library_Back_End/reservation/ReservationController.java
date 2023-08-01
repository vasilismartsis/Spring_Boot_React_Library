package com.library.Library_Back_End.reservation;

import com.library.Library_Back_End.Exception.InternalServerErrorException;
import com.library.Library_Back_End.Exception.NotFoundException;
import com.library.Library_Back_End.Exception.OutOfStockException;
import com.library.Library_Back_End.book.Book;
import com.library.Library_Back_End.libraryUser.LibraryUser;
import com.library.Library_Back_End.libraryUser.dto.AddLibraryUserRequest;
import com.library.Library_Back_End.libraryUser.dto.DeleteLibraryUserRequest;
import com.library.Library_Back_End.libraryUser.dto.EditLibraryUserRequest;
import com.library.Library_Back_End.reservation.dto.AddReservationRequest;
import com.library.Library_Back_End.reservation.dto.DeleteReservationRequest;
import com.library.Library_Back_End.reservation.dto.EditReservationRequest;
import com.library.Library_Back_End.reservation.dto.ReservationResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.crossstore.ChangeSetPersister;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.ZonedDateTime;

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
    public ResponseEntity<String> addReservationHandler(@RequestBody AddReservationRequest addReservationRequest) {
        try {
            reservationService.addReservation(addReservationRequest);
            return ResponseEntity.ok("OK");
        } catch (NotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User or Book not found");
        } catch (OutOfStockException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Book out of stock");
        } catch (InternalServerErrorException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Internal server error");
        }
    }

    @PostMapping("/editReservation")
    public ResponseEntity<String> editReservation(@RequestBody EditReservationRequest editReservationRequest) {
        try {
            reservationService.editReservation(editReservationRequest);
            return ResponseEntity.ok("OK");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Internal server error");
        }
    }

    @PostMapping("/deleteReservation")
    public ResponseEntity<String> deleteReservation(@RequestBody DeleteReservationRequest deleteReservationRequest) {
        try {
            reservationService.deleteReservation(deleteReservationRequest);
            return ResponseEntity.ok("OK");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Internal server error");
        }
    }
}
