package com.library.Library_Back_End.book;

import com.library.Library_Back_End.book.dto.AddBookRequest;
import com.library.Library_Back_End.book.dto.BookResponse;
import com.library.Library_Back_End.book.dto.DeleteBookRequest;
import com.library.Library_Back_End.book.dto.EditBookRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
        return bookService.addBook(addBookRequest);
    }

    @PostMapping("/editBook")
    public ResponseEntity<String> editBook(@RequestBody EditBookRequest editBookRequest) {
        return bookService.editBook(editBookRequest);
    }

    @PostMapping("/deleteBook")
    public ResponseEntity<String> deleteBook(@RequestBody DeleteBookRequest deleteBookRequest) {
        return bookService.deleteBook(deleteBookRequest);
    }

    @GetMapping(value = "/getXLSX", produces = MediaType.APPLICATION_OCTET_STREAM_VALUE)
    public ResponseEntity<byte[]> getXLSX() {
        return bookService.getXLSX();
    }

    @GetMapping(value = "/getPDF", produces = MediaType.APPLICATION_OCTET_STREAM_VALUE)
    public ResponseEntity<byte[]> getPDF() {
        return bookService.getPDF();
    }

    @GetMapping(value = "/getPPTX", produces = MediaType.APPLICATION_OCTET_STREAM_VALUE)
    public ResponseEntity<byte[]> getPPTX() {
        return bookService.getPPTX();
    }
}
