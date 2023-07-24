package com.library.Library_Back_End.book;

import com.library.Library_Back_End.auditing.AuditingConfig;
import com.library.Library_Back_End.libraryUser.LibraryUserRepository;
import com.library.Library_Back_End.reservation.ReservationRepository;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.dao.DataAccessException;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.doNothing;

class BookServiceTest {

    private BookService bookService;

    private LibraryUserRepository libraryUserRepository;
    private BookRepository bookRepository;
    private ReservationRepository reservationRepository;
    private BookConfiguration bookConfiguration;
    private AuditingConfig auditingConfig;

    @BeforeEach
    void setUp() {
        libraryUserRepository = Mockito.mock(LibraryUserRepository.class);
        bookRepository = Mockito.mock(BookRepository.class);
        reservationRepository = Mockito.mock(ReservationRepository.class);
        bookConfiguration = Mockito.mock(BookConfiguration.class);
        auditingConfig = Mockito.mock(AuditingConfig.class);
        bookService = new BookService(
                bookRepository,
                reservationRepository,
                bookConfiguration,
                libraryUserRepository,
                auditingConfig
        );
    }

    @Test
    void getGenres() {
        //Arrange - set up preconditions
        Mockito.when(bookConfiguration.genres()).thenReturn(new Genre[]{Genre.HORROR, Genre.MYSTERY});

        //Act - excercise unit under test
        var output = bookService.getGenres();

        //Assert - verify behavior and result
        Assertions.assertNotNull(output);
        Assertions.assertTrue(output.length > 0);
        Assertions.assertFalse(output.length > 3);
    }

    @Test
    void testDivisionByZero() {
        //Arrange
        var dividend = 10;
        var divider = 0;
        //Act
        double result;
        try {
            result = bookService.divide(dividend, divider);
        } catch (Exception exc) {
            //Assert
            assertInstanceOf(ArithmeticException.class, exc);
        }
    }

    @Test
    public void testDeleteAll() {
        //Arrange
        doNothing()
        .doThrow(new IllegalStateException())
        .when(bookRepository).deleteAll();

        //Act
        bookService.doSomething();
        assertThrows(IllegalStateException.class, bookService::doSomething);


        //Assert
        Mockito.verify(bookRepository, Mockito.times(2)).deleteAll();
    }

    @Test
    public void testDeleteByIdWithBookId1AndUnsafe() {
        var bookId = 1L;
        var safe = false;

        bookService.deleteById(bookId, safe);

        Mockito.verify(bookRepository).deleteById(bookId);
    }

    @Test
    public void testDeleteByIdWithBookId1AndSafeAndIdDoesntExist() {
        var bookId = 1L;
        var safe = true;
        Mockito.when(bookRepository.findById(bookId)).thenReturn(Optional.empty());

        bookService.deleteById(bookId, safe);

        Mockito.verify(bookRepository, Mockito.times(0)).deleteById(bookId);
    }

    @Test
    public void testDeleteByIdWithBookId1AndSafeAndIdExists() {
        var bookId = 1L;
        var safe = true;
        Mockito.when(bookRepository.findById(bookId)).thenReturn(Optional.of(new Book()));

        bookService.deleteById(bookId, safe);

        Mockito.verify(bookRepository, Mockito.times(1)).deleteById(2L);
    }

}