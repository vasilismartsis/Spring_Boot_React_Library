package com.library.Library_Back_End.book;

import com.itextpdf.text.DocumentException;
import com.library.Library_Back_End.book.dto.AddBookRequest;
import com.library.Library_Back_End.book.dto.BookResponse;
import com.library.Library_Back_End.book.dto.DeleteBookRequest;
import com.library.Library_Back_End.book.dto.EditBookRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.ArrayList;

@RestController
@RequestMapping(path = "api/book")
public class BookController {
    private final BookService bookService;

    @Autowired
    public BookController(BookService bookService) {
        this.bookService = bookService;
    }

    @GetMapping("/getBooks")
    public BookResponse getBooks(
            @RequestParam ArrayList<String> genres,
            @RequestParam int pageSize,
            @RequestParam int page,
            @RequestParam String order,
            @RequestParam String sortedColumn,
            @RequestParam String searchColumn,
            @RequestParam String searchValue
    ) {

        return bookService.getBooks(genres, pageSize, page, order, sortedColumn, searchColumn, searchValue);
    }

    @GetMapping("/getGenres")
    public Genre[] getGenres() {
        return bookService.getGenres();
    }

    @PostMapping("/addBook")
    public ResponseEntity<String> addBook(@RequestBody AddBookRequest addBookRequest) {
        try {
            bookService.addBook(addBookRequest);

            return ResponseEntity.ok("OK");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Internal server error");
        }
    }

    @PostMapping("/editBook")
    public ResponseEntity<String> editBook(@RequestBody EditBookRequest editBookRequest) {
        try {
            bookService.editBook(editBookRequest);
            return ResponseEntity.ok("OK");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Internal server error");
        }
    }

    @PostMapping("/deleteBook")
    public ResponseEntity<String> deleteBook(@RequestBody DeleteBookRequest deleteBookRequest) {
        try {
            bookService.deleteBook(deleteBookRequest);
            return ResponseEntity.ok("OK");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Internal server error");
        }
    }

    @GetMapping(value = "/getXLSX", produces = MediaType.APPLICATION_OCTET_STREAM_VALUE)
    public ResponseEntity<byte[]> getXLSX() {
        try {
            byte[] excelBytes = bookService.getXLSX();
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
            headers.setContentDispositionFormData("attachment", "Books.xlsx");
            return new ResponseEntity<>(excelBytes, headers, HttpStatus.OK);
        } catch (IOException e) {
            // Handle exception if needed
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping(value = "/getPDF", produces = MediaType.APPLICATION_OCTET_STREAM_VALUE)
    public ResponseEntity<byte[]> getPDF() {
        byte[] excelBytes = bookService.getPDF();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
        headers.setContentDispositionFormData("attachment", "Books.pdf");

        return new ResponseEntity<>(excelBytes, headers, HttpStatus.OK);
    }

    @GetMapping(value = "/getPPTX", produces = MediaType.APPLICATION_OCTET_STREAM_VALUE)
    public ResponseEntity<byte[]> getPPTX() {
        try {
            byte[] pptBytes = bookService.getPPTX();

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
            headers.setContentDispositionFormData("attachment", "Books.pptx");
            return new ResponseEntity<>(pptBytes, headers, HttpStatus.OK);
        } catch (IOException | DocumentException e) {
            // Handle the exception and return an appropriate response
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
