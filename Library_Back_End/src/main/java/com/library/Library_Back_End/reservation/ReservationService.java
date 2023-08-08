package com.library.Library_Back_End.reservation;

import com.library.Library_Back_End.Exception.InternalServerErrorException;
import com.library.Library_Back_End.Exception.NotFoundException;
import com.library.Library_Back_End.Exception.OutOfStockException;
import com.library.Library_Back_End.auditing.AuditingConfig;
import com.library.Library_Back_End.book.Book;
import com.library.Library_Back_End.book.BookRepository;
import com.library.Library_Back_End.libraryUser.LibraryUser;
import com.library.Library_Back_End.libraryUser.LibraryUserRepository;
import com.library.Library_Back_End.reservation.dto.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.time.LocalDate;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class ReservationService {
    private final ReservationRepository reservationRepository;
    private final BookRepository bookRepository;
    private final LibraryUserRepository libraryUserRepository;
    private final ReservationSpecifications reservationSpecifications;
    private final AuditingConfig auditingConfig;

    public ReservationService(LibraryUserRepository libraryUserRepository, ReservationRepository reservationRepository, BookRepository bookRepository, AuditingConfig auditingConfig) {
        this.libraryUserRepository = libraryUserRepository;
        this.reservationRepository = reservationRepository;
        this.bookRepository = bookRepository;

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
            if (!user.equals("")) {
                reservationPage = reservationRepository.findAll(reservationSpecifications.findAllByLibraryUser(libraryUser), pageable);
            } else {
                reservationPage = reservationRepository.findAll(pageable);
            }
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
    public void addReservation(AddReservationRequest addReservationRequest) throws NotFoundException, OutOfStockException, InternalServerErrorException {
        LibraryUser libraryUser = libraryUserRepository.findByUsername(addReservationRequest.getUsername()).orElseThrow(NotFoundException::new);
        Book book = bookRepository.findById(addReservationRequest.getBookId()).orElseThrow(NotFoundException::new);

        if (book.getQuantity() > 0) {
            Reservation reservation = new Reservation(libraryUser, book, LocalDate.now(), LocalDate.now().plusDays(7), auditingConfig.getAuditor(), auditingConfig.getAuditor());
            reservationRepository.save(reservation);
            decreaseBookQuantity(book);
        } else {
            throw new OutOfStockException();
        }
    }

    @Transactional
    public void editReservation(EditReservationRequest editReservationRequest) {
        Reservation reservation = reservationRepository.findById(editReservationRequest.getId()).orElseThrow();
        reservation.setReservationDate(ZonedDateTime.parse(editReservationRequest.getReservationDate(), DateTimeFormatter.ISO_DATE_TIME).toLocalDate().plusDays(1));
        reservation.setExpirationDate(ZonedDateTime.parse(editReservationRequest.getExpirationDate(), DateTimeFormatter.ISO_DATE_TIME).toLocalDate().plusDays(1));
        reservation.setLastModifiedBy(auditingConfig.getAuditor());
        reservationRepository.save(reservation);
    }

    @Transactional
    public void deleteReservation(DeleteReservationRequest deleteReservationRequest) {
        reservationRepository.deleteById(deleteReservationRequest.getId());
        increaseBookQuantity(bookRepository.findByTitle(deleteReservationRequest.getBookTitle()).orElseThrow());
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
