package com.library.Library_Back_End.book;

import com.library.Library_Back_End.book.dto.AddBookRequest;
import com.library.Library_Back_End.book.dto.BookResponse;
import com.library.Library_Back_End.book.dto.SingleBookResponse;
import com.library.Library_Back_End.libraryUser.LibraryUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;

import org.springframework.data.web.PageableDefault;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BookService {
    private final LibraryUserRepository libraryUserRepository;
    private final BookRepository bookRepository;
    private final BookConfiguration bookConfiguration;
    private final BookSpecifications bookSpecifications;

    @Autowired
    public BookService(BookRepository bookRepository, BookConfiguration bookConfiguration, LibraryUserRepository libraryUserRepository) {
        this.bookRepository = bookRepository;
        this.bookConfiguration = bookConfiguration;
        this.libraryUserRepository = libraryUserRepository;
        bookSpecifications = new BookSpecifications();
    }

    public BookResponse getBooks(ArrayList<String> genres, @PageableDefault(size = 5) int page, String order, String sortedColumn, String searchColumn, String searchValue) {
        long totalBookNumber = bookRepository.count();
        Direction sortDirection = order.equals("descend") ? Direction.DESC : Direction.ASC;
        String noNullSortedColumn = sortedColumn.equals("undefined") ? "id" : sortedColumn;
        Sort sort = Sort.by(sortDirection, noNullSortedColumn);
        ArrayList<Genre> genresEnum = genres.stream()
                .map(genreString -> Genre.valueOf(genreString.toUpperCase()))
                .collect(Collectors.toCollection(ArrayList::new));
        Pageable pageable = !order.equals("undefined") ? PageRequest.of(page - 1, 5, sort) : PageRequest.of(page - 1, 5);
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

        return new BookResponse(totalBookNumber, singleBookResource);
    }

    public void saveDummyBooks() {
        bookRepository.saveAll(bookConfiguration.books());
    }

    public Genre[] getGenres() {
        return bookConfiguration.genres();
    }

    public void addBook(AddBookRequest addBookRequest) {
        Book book = new Book(addBookRequest.getTitle(), addBookRequest.getQuantity(), addBookRequest.getGenre());
        book.setCreatedBy(libraryUserRepository.findByUsername(addBookRequest.getCreatedBy()).orElseThrow());
        book.setLastModifiedBy(libraryUserRepository.findByUsername(addBookRequest.getCreatedBy()).orElseThrow());
        bookRepository.save(book);
    }

}
