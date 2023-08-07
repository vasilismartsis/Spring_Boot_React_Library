package com.library.Library_Back_End.book;

import com.itextpdf.text.DocumentException;
import com.library.Library_Back_End.Exception.OutOfStockException;
import com.library.Library_Back_End.auditing.AuditingConfig;
import com.library.Library_Back_End.book.BookExport.PDFBookExport;
import com.library.Library_Back_End.book.BookExport.PPTXBookExport;
import com.library.Library_Back_End.book.BookExport.XLSXBookExport;
import com.library.Library_Back_End.book.dto.*;
import com.library.Library_Back_End.libraryUser.LibraryUser;
import com.library.Library_Back_End.libraryUser.LibraryUserRepository;
import com.library.Library_Back_End.libraryUser.Role;
import com.library.Library_Back_End.libraryUser.RoleEnum;
import com.library.Library_Back_End.reservation.ReservationRepository;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.dao.DataAccessException;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;

class BookServiceTest {

    private BookService bookService;
    private LibraryUserRepository libraryUserRepository;
    private BookRepository bookRepository;
    private ReservationRepository reservationRepository;
    private BookConfiguration bookConfiguration;
    private AuditingConfig auditingConfig;
    private BookSpecifications bookSpecifications;
    private XLSXBookExport xlsxBookExport;
    private PDFBookExport pdfBookExport;
    private PPTXBookExport pptxBookExport;
    private List<Book> mockBooks;
    private List<LibraryUser> mockLibraryUsers;


    @BeforeEach
    void setUp() {
        libraryUserRepository = Mockito.mock(LibraryUserRepository.class);
        bookRepository = Mockito.mock(BookRepository.class);
        reservationRepository = Mockito.mock(ReservationRepository.class);
        bookConfiguration = Mockito.mock(BookConfiguration.class);
        auditingConfig = Mockito.mock(AuditingConfig.class);
        bookSpecifications = Mockito.mock(BookSpecifications.class);
        xlsxBookExport = Mockito.mock(XLSXBookExport.class);
        pdfBookExport = Mockito.mock(PDFBookExport.class);
        pptxBookExport = Mockito.mock(PPTXBookExport.class);

        bookService = new BookService(
                bookRepository,
                reservationRepository,
                bookConfiguration,
                libraryUserRepository,
                auditingConfig,
                bookSpecifications,
                xlsxBookExport,
                pdfBookExport,
                pptxBookExport
        );

        // Initialize mock data
        mockBooks = new ArrayList<>();
        mockBooks.add(new Book("Book 1", 3, Genre.HORROR));
        mockBooks.add(new Book("Book 2", 1, Genre.MYSTERY));

        mockLibraryUsers = new ArrayList<>();
        mockLibraryUsers.add(new LibraryUser("user1", "password1", Arrays.asList(new Role(RoleEnum.CUSTOMER)), null, null));
        mockLibraryUsers.add(new LibraryUser("user2", "password2", Arrays.asList(new Role(RoleEnum.ADMIN)), null, null));


        // Mock bookRepository methods
        when(bookRepository.count()).thenReturn((long) mockBooks.size());
        when(bookRepository.countByQuantity(0)).thenReturn(0L);
        when(bookRepository.sumQuantity()).thenReturn(mockBooks.stream().mapToInt(Book::getQuantity).sum());
        when(bookRepository.findAll()).thenReturn(mockBooks);
        when(bookRepository.findAll(any(Specification.class), any(org.springframework.data.domain.Pageable.class))).thenReturn(new PageImpl<>(mockBooks));
        when(bookRepository.findAll(any(org.springframework.data.domain.Pageable.class))).thenReturn(new PageImpl<>(mockBooks));
    }

    @Test
    public void testGetBooks() {
        ArrayList<String> genres = new ArrayList<>();
        int pageSize = 10;
        int page = 1;
        String order = "ascend";
        String sortedColumn = "title";
        String searchColumn = "";
        String searchValue = "";

        BookResponse response = bookService.getBooks(genres, pageSize, page, order, sortedColumn, searchColumn, searchValue);

        Assertions.assertEquals(mockBooks.size(), response.getTotalBooks());
        Assertions.assertEquals(0, response.getTotalZeroQuantityBooks());
        Assertions.assertEquals(4, response.getTotalBookCopies());
        Assertions.assertEquals(0, response.getTotalBookCopiesReserved());
        Assertions.assertEquals(mockBooks.size(), response.getSingleBookResponse().size());
    }

    @Test
    void getGenres() {
        //Arrange - set up preconditions
        when(bookConfiguration.genres()).thenReturn(new Genre[]{Genre.HORROR, Genre.MYSTERY});

        //Act - exercise unit under test
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
        when(bookRepository.findById(bookId)).thenReturn(Optional.empty());

        bookService.deleteById(bookId, safe);

        Mockito.verify(bookRepository, Mockito.times(0)).deleteById(bookId);
    }

    @Test
    public void testDeleteByIdWithBookId1AndSafeAndIdExists() {
        var bookId = 1L;
        var safe = true;
        when(bookRepository.findById(bookId)).thenReturn(Optional.of(new Book()));

        bookService.deleteById(bookId, safe);

        Mockito.verify(bookRepository, Mockito.times(1)).deleteById(1L);
    }

    @Test
    void testAddBook() throws OutOfStockException {
        // Arrange
        AddBookRequest addBookRequest = new AddBookRequest("New Book", 5, Genre.SCI_FI, mockLibraryUsers.get(0).getUsername());
        Book expectedBook = new Book(addBookRequest.getTitle(), addBookRequest.getQuantity(), addBookRequest.getGenre(), auditingConfig.getAuditor(), auditingConfig.getAuditor());
        when(bookRepository.save(any(Book.class))).thenReturn(expectedBook);

        // Act
        bookService.addBook(addBookRequest);

        // Assert
        Mockito.verify(bookRepository).save(expectedBook);
    }

    @Test
    void testEditBook() {
        // Arrange
        EditBookRequest editBookRequest = new EditBookRequest(1L, "Edited Book", 10, Genre.ROMANCE);
        Book existingBook = new Book("Existing Book", 5, Genre.SCI_FI);
        when(bookRepository.findById(editBookRequest.getId())).thenReturn(Optional.of(existingBook));

        // Act
        bookService.editBook(editBookRequest);

        // Assert
        Mockito.verify(bookRepository).findById(editBookRequest.getId());
        Mockito.verify(bookRepository).save(existingBook);
        assertEquals(editBookRequest.getTitle(), existingBook.getTitle());
        assertEquals(editBookRequest.getQuantity(), existingBook.getQuantity());
        assertEquals(editBookRequest.getGenre(), existingBook.getGenre());
    }

    @Test
    void testDeleteBook() {
        // Arrange
        DeleteBookRequest deleteBookRequest = new DeleteBookRequest(1L);
        doNothing().when(bookRepository).deleteById(deleteBookRequest.getId());

        // Act
        bookService.deleteBook(deleteBookRequest);

        // Assert
        Mockito.verify(bookRepository).deleteById(deleteBookRequest.getId());
    }

    @Test
    void testGetXLSX() throws IOException {
        // Arrange
        byte[] expectedFileContent = {0x01, 0x02, 0x03}; // Mock XLSX file content
        when(xlsxBookExport.generateFile()).thenReturn(expectedFileContent);

        // Act
        byte[] fileContent = bookService.getXLSX();

        // Assert
        assertNotNull(fileContent);
        assertArrayEquals(expectedFileContent, fileContent);
    }

    @Test
    void testGetPDF() {
        // Arrange
        byte[] expectedFileContent = {0x04, 0x05, 0x06}; // Mock PDF file content
        when(pdfBookExport.generateFile()).thenReturn(expectedFileContent);

        // Act
        byte[] fileContent = bookService.getPDF();

        // Assert
        assertNotNull(fileContent);
        assertArrayEquals(expectedFileContent, fileContent);
    }

    @Test
    void testGetPPTX() throws IOException, DocumentException {
        // Arrange
        byte[] expectedFileContent = {0x07, 0x08, 0x09}; // Mock PPTX file content
        when(pptxBookExport.generateFile()).thenReturn(expectedFileContent);

        // Act
        byte[] fileContent = bookService.getPPTX();

        // Assert
        assertNotNull(fileContent);
        assertArrayEquals(expectedFileContent, fileContent);
    }
}