import { createContext } from "react";
import { Book } from "./types";
import { SorterResult } from "antd/es/table/interface";

interface BookContextValue {
  totalBooks: number;
  totalZeroQuantityBooks: number;
  totalBookCopies: number;
  totalBookCopiesReserved: number;
  books: Book[];
  bookError?: any;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  currentPage: number;
  pageSize: number;
  setPageSize: React.Dispatch<React.SetStateAction<number>>;
  setGenres: React.Dispatch<React.SetStateAction<string[]>>;
  bookRefetch: () => void;
  setSorterResult: React.Dispatch<React.SetStateAction<SorterResult<Book>>>;
  setSearchColumn: React.Dispatch<React.SetStateAction<string>>;
  setSearchValue: React.Dispatch<React.SetStateAction<string>>;
  doAddBook: (
    data: Book,
    onSuccess: () => void,
    onError: (error: string) => void
  ) => void;
  doEditBook: (
    data: Book,
    onSuccess: () => void,
    onError: (error: string) => void
  ) => void;
  doDeleteBook: (
    data: Book,
    onSuccess: () => void,
    onError: (error: string) => void
  ) => void;
  xlsxError?: any;
  xlsxRefetch: () => void;
  pdfError?: any;
  pdfRefetch: () => void;
  pptxError?: any;
  pptxRefetch: () => void;
}

export const BookContext = createContext<BookContextValue>({
  totalBooks: 0,
  totalZeroQuantityBooks: 0,
  totalBookCopies: 0,
  totalBookCopiesReserved: 0,
  books: [],
  bookError: {},
  setCurrentPage: () => {},
  currentPage: 1,
  pageSize: 5,
  setPageSize: () => {},
  setGenres: () => {},
  bookRefetch: () => {},
  setSorterResult: () => {},
  setSearchColumn: () => {},
  setSearchValue: () => {},
  doAddBook: () => {},
  doEditBook: () => {},
  doDeleteBook: () => {},
  xlsxError: {},
  xlsxRefetch: () => {},
  pdfError: {},
  pdfRefetch: () => {},
  pptxError: {},
  pptxRefetch: () => {},
});
