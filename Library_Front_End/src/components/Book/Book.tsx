import { BookContext } from "./BookContext";
import BookList from "./BookList";
import { useBooks } from "./useBooks";

export interface BookProps {}

const Book: React.FC<BookProps> = (props) => {
  const {
    totalBooks,
    totalZeroQuantityBooks,
    totalBookCopies,
    totalBookCopiesReserved,
    books,
    bookError,
    setCurrentPage,
    currentPage,
    pageSize,
    setPageSize,
    setGenres,
    bookRefetch,
    setSorterResult,
    setSearchColumn,
    setSearchValue,
    doAddBook,
    doEditBook,
    doDeleteBook,
    xlsxError,
    xlsxRefetch,
    pdfError,
    pdfRefetch,
    pptxError,
    pptxRefetch,
  } = useBooks();

  return (
    <>
      <h1 className="table-label">Books</h1>
      <BookContext.Provider
        value={{
          totalBooks,
          totalZeroQuantityBooks,
          totalBookCopies,
          totalBookCopiesReserved,
          books,
          bookError,
          setCurrentPage,
          currentPage,
          pageSize,
          setPageSize,
          setGenres,
          bookRefetch,
          setSorterResult,
          setSearchColumn,
          setSearchValue,
          doAddBook,
          doEditBook,
          doDeleteBook,
          xlsxError,
          xlsxRefetch,
          pdfError,
          pdfRefetch,
          pptxError,
          pptxRefetch,
        }}
      >
        <BookList />
      </BookContext.Provider>
    </>
  );
};

export default Book;
