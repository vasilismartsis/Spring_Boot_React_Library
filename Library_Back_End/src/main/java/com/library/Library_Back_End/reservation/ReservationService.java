package com.library.Library_Back_End.reservation;

import com.library.Library_Back_End.book.Book;
import com.library.Library_Back_End.book.BookRepository;
import com.library.Library_Back_End.libraryUser.LibraryUserConfiguration;
import com.library.Library_Back_End.libraryUser.LibraryUserRepository;
import com.library.Library_Back_End.reservation.dto.ReservationRequest;
import com.library.Library_Back_End.reservation.dto.ReservationResponse;
import com.library.Library_Back_End.reservation.dto.SingleReservationResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final BookRepository bookRepository;

    private final LibraryUserRepository libraryUserRepository;
    private final LibraryUserConfiguration libraryUserConfiguration;
    private final ReservationSpecifications reservationSpecifications;

    public ReservationService(LibraryUserRepository libraryUserRepository, ReservationRepository reservationRepository, BookRepository bookRepository, LibraryUserConfiguration libraryUserConfiguration) {
        this.libraryUserRepository = libraryUserRepository;
        this.reservationRepository = reservationRepository;
        this.bookRepository = bookRepository;
        this.libraryUserConfiguration = libraryUserConfiguration;
        reservationSpecifications = new ReservationSpecifications();

    }

    public ReservationResponse getReservations(@PageableDefault(size = 5) int page, String order, String sortedColumn, String searchColumn, String searchValue) {
        long totalReservationNumber = reservationRepository.count();

        Sort.Direction sortDirection = order.equals("descend") ? Sort.Direction.DESC : Sort.Direction.ASC;
        String noNullSortedColumn = sortedColumn.equals("undefined") ? "id" : sortedColumn;
        Sort sort = Sort.by(sortDirection, noNullSortedColumn);
        Pageable pageable = !order.equals("undefined") ? PageRequest.of(page - 1, 5, sort) : PageRequest.of(page - 1, 5);
        Page<Reservation> reservationPage;
        if (!searchColumn.equals("")) {
            reservationPage = reservationRepository.findAll(reservationSpecifications.findAllByColumnContaining(searchColumn, searchValue), pageable);
        } else {
            reservationPage = reservationRepository.findAll(pageable);
        }

        List<SingleReservationResponse> singleReservationResponses = reservationPage
                .getContent()
                .stream()
                .map(entity -> new SingleReservationResponse(
                        entity.getId(),
                        entity.getLibraryUser().getUsername(),
                        bookRepository.findById(entity.getBook().getId()).orElse(null).getTitle(),
                        entity.getReservationDate(),
                        entity.getExpirationDate(),
                        entity.getCreatedBy(),
                        entity.getLastModifiedBy(),
                        entity.getCreationDate(),
                        entity.getLastModifiedDate()
                ))
                .toList();

        return new ReservationResponse(totalReservationNumber, singleReservationResponses);
    }

    @Transactional
    public void reserve(ReservationRequest reservationRequest) {
        Book book = bookRepository.findById(reservationRequest.getBookId()).orElseThrow();
        Reservation reservation = new Reservation(libraryUserRepository.findByUsername(reservationRequest.getUsername()).orElseThrow(), book);
        reservationRepository.save(reservation);
    }
}
