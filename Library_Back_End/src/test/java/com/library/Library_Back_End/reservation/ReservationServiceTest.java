package com.library.Library_Back_End.reservation;

import com.library.Library_Back_End.auditing.AuditingConfig;
import com.library.Library_Back_End.book.Book;
import com.library.Library_Back_End.book.BookRepository;
import com.library.Library_Back_End.book.Genre;
import com.library.Library_Back_End.libraryUser.LibraryUser;
import com.library.Library_Back_End.libraryUser.LibraryUserRepository;
import com.library.Library_Back_End.libraryUser.Role;
import com.library.Library_Back_End.libraryUser.RoleEnum;
import com.library.Library_Back_End.reservation.dto.AddReservationRequest;
import com.library.Library_Back_End.reservation.dto.DeleteReservationRequest;
import com.library.Library_Back_End.reservation.dto.EditReservationRequest;
import com.library.Library_Back_End.reservation.dto.ReservationResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.time.LocalDate;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class ReservationServiceTest {

    @Mock
    private LibraryUserRepository libraryUserRepository;

    @Mock
    private ReservationRepository reservationRepository;

    @Mock
    private BookRepository bookRepository;

    @Mock
    private AuditingConfig auditingConfig;

    @InjectMocks
    private ReservationService reservationService;

    private List<Book> mockBooks;

    private List<LibraryUser> mockLibraryUsers;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);

        // Initialize mock data
        mockBooks = new ArrayList<>();
        mockBooks.add(new Book("Book 1", 3, Genre.HORROR));
        mockBooks.add(new Book("Book 2", 1, Genre.MYSTERY));

        mockLibraryUsers = new ArrayList<>();
        mockLibraryUsers.add(new LibraryUser("user1", "password1", Arrays.asList(new Role(RoleEnum.CUSTOMER)), null, null));
        mockLibraryUsers.add(new LibraryUser("user2", "password2", Arrays.asList(new Role(RoleEnum.ADMIN)), null, null));
    }

    @Test
    public void testGetReservations() {
        // Mock the necessary data for the test
        String username = "testUser";
        int page = 1;
        String order = "descend";
        String sortedColumn = "id";
        String searchColumn = "";
        String searchValue = "";
        long totalReservationNumber = 10L;

        LibraryUser libraryUser = new LibraryUser(username, "password", new ArrayList<>());

        when(libraryUserRepository.findByUsername(username)).thenReturn(Optional.of(libraryUser));
        when(bookRepository.findById(any())).thenReturn(Optional.of(mockBooks.get(0)));

        Reservation reservation1 = new Reservation(mockLibraryUsers.get(0), mockBooks.get(0), LocalDate.now(), LocalDate.now().plusDays(7), mockLibraryUsers.get(0), mockLibraryUsers.get(0));
        Page<Reservation> reservationPage = new PageImpl<>(Arrays.asList(reservation1));


        when(reservationRepository.count()).thenReturn(totalReservationNumber);
        when(reservationRepository.findAll(any(Specification.class), any(org.springframework.data.domain.Pageable.class))).thenReturn(reservationPage);
        when(reservationRepository.findAll(any(org.springframework.data.domain.Pageable.class))).thenReturn(reservationPage);

        // Execute the method to be tested
        ReservationResponse response = reservationService.getReservations(username, page, order, sortedColumn, searchColumn, searchValue);

        // Assert the result
        assertNotNull(response);
        assertEquals(totalReservationNumber, response.getTotalReservations());
        assertFalse(response.getSingleReservationResponse().isEmpty());
    }

    @Test
    public void testAddReservation() {
        // Mock the necessary data for the test
        String username = "testUser";
        long bookId = 1;

        LibraryUser libraryUser = new LibraryUser(username, "password", new ArrayList<>());
        Book book = new Book("Book 1", 3, Genre.HORROR);

        AddReservationRequest addReservationRequest = new AddReservationRequest(username, bookId);

        when(libraryUserRepository.findByUsername(username)).thenReturn(Optional.of(libraryUser));
        when(bookRepository.findById(bookId)).thenReturn(Optional.of(book));

        // Execute the method to be tested
        assertDoesNotThrow(() -> reservationService.addReservation(addReservationRequest));

        // Verify that the book quantity is decreased and the reservation is saved
        verify(bookRepository, times(1)).save(book);
        verify(reservationRepository, times(1)).save(any(Reservation.class));
    }

    @Test
    public void testEditReservation() {
        // Mock the necessary data for the test
        long reservationId = 1;
        String reservationDate = "2023-08-01T10:00:00Z";
        String expirationDate = "2023-08-10T10:00:00Z";

        Reservation reservation = new Reservation(mockLibraryUsers.get(0), mockBooks.get(0), LocalDate.now(), LocalDate.now().plusDays(7), mockLibraryUsers.get(0), mockLibraryUsers.get(0));
        EditReservationRequest editReservationRequest = new EditReservationRequest(reservationId, mockLibraryUsers.get(0).getUsername(), mockBooks.get(0).getTitle(), reservationDate, expirationDate, mockLibraryUsers.get(0).getUsername());

        when(reservationRepository.findById(reservationId)).thenReturn(Optional.of(reservation));

        // Execute the method to be tested
        assertDoesNotThrow(() -> reservationService.editReservation(editReservationRequest));

        // Verify that the reservation is updated and saved
        verify(reservationRepository, times(1)).save(reservation);
    }

    @Test
    public void testDeleteReservation() {
        // Mock the necessary data for the test
        long reservationId = 1;
        String bookTitle = "Book 1";

        Reservation reservation = new Reservation(mockLibraryUsers.get(0), mockBooks.get(0), LocalDate.now(), LocalDate.now().plusDays(7), mockLibraryUsers.get(0), mockLibraryUsers.get(0));
        DeleteReservationRequest deleteReservationRequest = new DeleteReservationRequest(reservationId, bookTitle);

        when(reservationRepository.findById(reservationId)).thenReturn(Optional.of(reservation));
        when(bookRepository.findByTitle(bookTitle)).thenReturn(Optional.of(mockBooks.get(0)));

        // Execute the method to be tested
        assertDoesNotThrow(() -> reservationService.deleteReservation(deleteReservationRequest));

        // Verify that the reservation is deleted and book quantity is increased
        verify(reservationRepository, times(1)).deleteById(reservationId);
        verify(bookRepository, times(1)).save(mockBooks.get(0));
    }
}
