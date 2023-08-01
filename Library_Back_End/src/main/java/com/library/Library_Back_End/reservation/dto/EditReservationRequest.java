package com.library.Library_Back_End.reservation.dto;

import com.library.Library_Back_End.libraryUser.RoleEnum;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;


@AllArgsConstructor
@Data
public class EditReservationRequest {
    private long id;
    private String username;
    private String bookTitle;
    private String reservationDate;
    private String expirationDate;
    private String lastModifiedBy;
}
