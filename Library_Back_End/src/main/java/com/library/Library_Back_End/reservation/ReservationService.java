package com.library.Library_Back_End.reservation;

import com.library.Library_Back_End.auditing.AuditingConfig;
import com.library.Library_Back_End.book.Book;
import com.library.Library_Back_End.book.BookRepository;
import com.library.Library_Back_End.libraryUser.LibraryUser;
import com.library.Library_Back_End.libraryUser.LibraryUserConfiguration;
import com.library.Library_Back_End.libraryUser.LibraryUserRepository;
import com.library.Library_Back_End.libraryUser.Role;
import com.library.Library_Back_End.libraryUser.dto.DeleteLibraryUserRequest;
import com.library.Library_Back_End.libraryUser.dto.EditLibraryUserRequest;
import com.library.Library_Back_End.reservation.dto.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.time.LocalDate;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final BookRepository bookRepository;

    private final LibraryUserRepository libraryUserRepository;
    private final LibraryUserConfiguration libraryUserConfiguration;
    private final ReservationSpecifications reservationSpecifications;
    private final AuditingConfig auditingConfig;

    public ReservationService(LibraryUserRepository libraryUserRepository, ReservationRepository reservationRepository, BookRepository bookRepository, LibraryUserConfiguration libraryUserConfiguration, AuditingConfig auditingConfig) {
        this.libraryUserRepository = libraryUserRepository;
        this.reservationRepository = reservationRepository;
        this.bookRepository = bookRepository;
        this.libraryUserConfiguration = libraryUserConfiguration;
        this.auditingConfig = auditingConfig;
        reservationSpecifications = new ReservationSpecifications();

    }

    public ReservationResponse getReservations(String user, @PageableDefault(size = 5) int page, String order, String sortedColumn, String searchColumn, String searchValue) {
        long totalReservationNumber = reservationRepository.count();

        LibraryUser libraryUser = !user.equals("") ? libraryUserRepository.findByUsername(user).orElseThrow() : null;
        Sort.Direction sortDirection = order.equals("descend") ? Sort.Direction.DESC : Sort.Direction.ASC;
        String noNullSortedColumn = sortedColumn.equals("undefined") ? "id" : sortedColumn;
        Sort sort = Sort.by(sortDirection, noNullSortedColumn);
        Pageable pageable = !order.equals("undefined") ? PageRequest.of(page - 1, 5, sort) : PageRequest.of(page - 1, 5);
        Page<Reservation> reservationPage;

        if (!searchColumn.equals("")) {
            reservationPage = reservationRepository.findAll(reservationSpecifications.findAllByLibraryUserAndColumnContaining(libraryUser, searchColumn, searchValue), pageable);
        } else {
            reservationPage = reservationRepository.findAll(pageable);
        }

        List<SingleReservationResponse> singleReservationResponses = reservationPage
                .getContent()
                .stream()
                .map(entity -> new SingleReservationResponse(
                        entity.getCreatedBy() != null ? entity.createdBy.getUsername() : null,
                        entity.getLastModifiedBy() != null ? entity.lastModifiedBy.getUsername() : null,
                        entity.getCreationDate(),
                        entity.getLastModifiedDate(),
                        entity.getId(),
                        entity.getLibraryUser().getUsername(),
                        bookRepository.findById(entity.getBook().getId()).orElse(null).getTitle(),
                        entity.getReservationDate(),
                        entity.getExpirationDate()
                ))
                .toList();

        return new ReservationResponse(totalReservationNumber, singleReservationResponses);
    }

    @Transactional
    public ResponseEntity<String> addReservation(AddReservationRequest addReservationRequest) {
        try {
            LibraryUser libraryUser = libraryUserRepository.findByUsername(addReservationRequest.getUsername()).orElseThrow();
            Book book = bookRepository.findById(addReservationRequest.getBookId()).orElseThrow();

            if (book.getQuantity() > 0) {
                Reservation reservation = new Reservation(libraryUser, book, auditingConfig.getAuditor(), auditingConfig.getAuditor());
                decreaseBookQuantity(book);
                reservationRepository.save(reservation);
                return ResponseEntity.ok("OK");
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Book out of stock");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Internal server error");
        }
    }

    @Transactional
    public ResponseEntity<String> editReservation(EditReservationRequest editReservationRequest) {
        try {
            Reservation reservation = reservationRepository.findById(editReservationRequest.getId()).orElseThrow();
            reservation.setReservationDate(ZonedDateTime.parse(editReservationRequest.getReservationDate()).toLocalDate());
            reservation.setExpirationDate(ZonedDateTime.parse(editReservationRequest.getExpirationDate()).toLocalDate());
            reservation.setLastModifiedBy(auditingConfig.getAuditor());
            reservationRepository.save(reservation);
            return ResponseEntity.ok("OK");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Internal server error");
        }
    }

    @Transactional
    public ResponseEntity<String> deleteReservation(DeleteReservationRequest deleteReservationRequest) {
        try {
            reservationRepository.deleteById(deleteReservationRequest.getId());
            increaseBookQuantity(bookRepository.findByTitle(deleteReservationRequest.getBookTitle()).orElseThrow());
            return ResponseEntity.ok("OK");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Internal server error");
        }
    }

    private void decreaseBookQuantity(Book book) {
        book.setQuantity(book.getQuantity() - 1);
        bookRepository.save(book);
    }

    private void increaseBookQuantity(Book book) {
        book.setQuantity(book.getQuantity() + 1);
        bookRepository.save(book);
    }
}
