package com.library.Library_Back_End.book;

import com.library.Library_Back_End.book.dto.AddBookRequest;
import com.library.Library_Back_End.book.dto.BookResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;

@RestController
@RequestMapping(path = "api/book")
public class BookController {
    private final BookService bookService;

    @Autowired
    public BookController(BookService bookService) {
        this.bookService = bookService;
        saveDummyBooks();
    }

    public void saveDummyBooks() {
        bookService.saveDummyBooks();
    }

    @GetMapping("/getBooks")
    public BookResponse getBooks(
            @RequestParam ArrayList<String> genres,
            @RequestParam int page,
            @RequestParam String order,
            @RequestParam String sortedColumn,
            @RequestParam String searchColumn,
            @RequestParam String searchValue
                                ) {

        return bookService.getBooks(genres, page, order, sortedColumn, searchColumn, searchValue);
    }

    @GetMapping("/getGenres")
    public Genre[] getGenres() {
        return bookService.getGenres();
    }

    @PostMapping("/addBook")
    public void addBook(@RequestBody AddBookRequest addBookRequest) {
        bookService.addBook(addBookRequest);
    }
}
