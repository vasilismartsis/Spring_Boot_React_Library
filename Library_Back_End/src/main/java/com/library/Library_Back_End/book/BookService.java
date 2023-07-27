package com.library.Library_Back_End.book;

import com.itextpdf.text.DocumentException;
import com.library.Library_Back_End.auditing.AuditingConfig;
import com.library.Library_Back_End.book.BookExport.*;
import com.library.Library_Back_End.book.dto.*;
import com.library.Library_Back_End.libraryUser.LibraryUserRepository;
import com.library.Library_Back_End.reservation.ReservationRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BookService {
    private final LibraryUserRepository libraryUserRepository;
    private final BookRepository bookRepository;
    private final ReservationRepository reservationRepository;
    private final BookConfiguration bookConfiguration;
    private final BookSpecifications bookSpecifications;
    private final AuditingConfig auditingConfig;
    private final XLSXBookExport xlsxBookExport;
    private final PDFBookExport pdfBookExport;
    private final PPTXBookExport pptxBookExport;

    @Autowired
    public BookService(BookRepository bookRepository,
                       ReservationRepository reservationRepository,
                       BookConfiguration bookConfiguration,
                       LibraryUserRepository libraryUserRepository,
                       AuditingConfig auditingConfig,
                       BookSpecifications bookSpecifications,
                       XLSXBookExport xlsxBookExport,
                       PDFBookExport pdfBookExport,
                       PPTXBookExport pptxBookExport
    ) {
        this.bookRepository = bookRepository;
        this.reservationRepository = reservationRepository;
        this.bookConfiguration = bookConfiguration;
        this.libraryUserRepository = libraryUserRepository;
        this.auditingConfig = auditingConfig;
        this.bookSpecifications = bookSpecifications;
        this.xlsxBookExport = xlsxBookExport;
        this.pdfBookExport = pdfBookExport;
        this.pptxBookExport = pptxBookExport;
    }

    public BookResponse getBooks(ArrayList<String> genres, int pageSize, int page, String order, String sortedColumn, String searchColumn, String searchValue) {
        long totalBooks = bookRepository.count();
        long totalZeroQuantityBooks = bookRepository.countByQuantity(0);
        int totalBookCopiesNotReserved = bookRepository.sumQuantity();
        long totalBookCopiesReserved = reservationRepository.count();
        long totalBookCopies = totalBookCopiesNotReserved + totalBookCopiesReserved;

        Direction sortDirection = order.equals("descend") ? Direction.DESC : Direction.ASC;
        String noNullSortedColumn = sortedColumn.equals("undefined") ? "id" : sortedColumn;
        Sort sort = Sort.by(sortDirection, noNullSortedColumn);
        ArrayList<Genre> genresEnum = genres.stream()
                .map(genreString -> Genre.valueOf(genreString.toUpperCase()))
                .collect(Collectors.toCollection(ArrayList::new));
        Pageable pageable = !order.equals("undefined") ? PageRequest.of(page - 1, pageSize, sort) : PageRequest.of(page - 1, pageSize);
        Page<Book> bookPage;
        if (genresEnum.isEmpty()) {
            if (!searchColumn.equals("")) {
                bookPage = bookRepository.findAll(bookSpecifications.findAllByColumnContaining(searchColumn, searchValue), pageable);
            } else {
                bookPage = bookRepository.findAll(pageable);
            }
        } else {
            if (!searchColumn.equals("")) {
                bookPage = bookRepository.findAll(bookSpecifications.findAllByGenreAndColumnContaining(genresEnum, searchColumn, searchValue), pageable);
            } else {
                bookPage = bookRepository.findAll(bookSpecifications.findAllByGenre(genresEnum), pageable);
            }
        }
        List<SingleBookResponse> singleBookResource = bookPage.getContent().stream()
                .map(entity -> new SingleBookResponse(
                        entity.getCreatedBy() != null ? libraryUserRepository.findById(entity.getCreatedBy().getId()).orElseThrow().getUsername() : null,
                        entity.getLastModifiedBy() != null ? libraryUserRepository.findById(entity.getLastModifiedBy().getId()).orElseThrow().getUsername() : null,
                        entity.getCreationDate(),
                        entity.getLastModifiedDate(),
                        entity.getId(),
                        entity.getTitle(),
                        entity.getGenre(),
                        entity.getQuantity()
                ))
                .toList();

        return new BookResponse(totalBooks, totalZeroQuantityBooks, totalBookCopies, totalBookCopiesReserved, singleBookResource);
    }

//    public void saveDummyBooks() {
//        bookRepository.saveAll(bookConfiguration.books());
//    }

    public Genre[] getGenres() {
        return bookConfiguration.genres();
    }

    public double divide(int dividend, int divider) {
        return dividend / divider;
    }

    public void doSomething() {
        bookRepository.deleteAll();
    }

    public void deleteById(Long bookId, boolean safe) {
        if (safe && bookRepository.findById(bookId).isEmpty()) {
            return;
        }
        bookRepository.deleteById(bookId);
    }

    public ResponseEntity<String> addBook(AddBookRequest addBookRequest) {
        try {
            Book book = new Book(addBookRequest.getTitle(), addBookRequest.getQuantity(), addBookRequest.getGenre(), auditingConfig.getAuditor(), auditingConfig.getAuditor());
            bookRepository.save(book);
            return ResponseEntity.ok("OK");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Internal server error");
        }
    }

    public ResponseEntity<String> editBook(EditBookRequest editBookRequest) {
        try {
            Book book = bookRepository.findById(editBookRequest.getId()).orElseThrow();
            book.setTitle(editBookRequest.getTitle());
            book.setQuantity(editBookRequest.getQuantity());
            book.setGenre(editBookRequest.getGenre());
            book.setCreatedBy(auditingConfig.getAuditor());
            book.setLastModifiedBy(auditingConfig.getAuditor());
            bookRepository.save(book);
            return ResponseEntity.ok("OK");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Internal server error");
        }
    }

    public ResponseEntity<String> deleteBook(DeleteBookRequest deleteBookRequest) {
        try {
            bookRepository.deleteById(deleteBookRequest.getId());
            return ResponseEntity.ok("OK");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Internal server error");
        }
    }

    public ResponseEntity<byte[]> getXLSX() {
        try {
            byte[] excelBytes = xlsxBookExport.generateFile();

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
            headers.setContentDispositionFormData("attachment", "Books.xlsx");

            return new ResponseEntity<>(excelBytes, headers, HttpStatus.OK);
        } catch (IOException e) {
            // Handle exception if needed
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public ResponseEntity<byte[]> getPDF() {
        byte[] excelBytes = pdfBookExport.generateFile();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
        headers.setContentDispositionFormData("attachment", "Books.pdf");

        return new ResponseEntity<>(excelBytes, headers, HttpStatus.OK);
    }

    public ResponseEntity<byte[]> getPPTX() {
        try {
            byte[] pptBytes = pptxBookExport.generateFile();


            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
            headers.setContentDispositionFormData("attachment", "Books.pptx");
            return new ResponseEntity<>(pptBytes, headers, HttpStatus.OK);
        } catch (IOException e) {
            // Handle the exception and return an appropriate response
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        } catch (DocumentException e) {
            throw new RuntimeException(e);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
