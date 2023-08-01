import { ColumnType } from "antd/es/table";

export type BookResource = {
    totalBooks: number;
    totalZeroQuantityBooks: number;
    totalBookCopies: number;
    totalBookCopiesReserved: number;
    singleBookResponse: Book[];
}

export type Book = {
        id: number;
        title: string;
        quantity: number;
        genre: string;
        createdBy: string;
        lastModifiedBy: string;
        creationDate: Date;
        lastModifiedDate: Date;
}

export interface BookColumn extends ColumnType<Book> {
    searchable?: boolean;
    sortable?: boolean;
}

export type ReserveRequest = {
    username: string;
    bookId: number;
}

export type AddBookForm = {
    title: string;
    quantity: number;
    genre: string;
}
  
export type EditBookForm = {
  title: string;
  quantity: number;
  genre: string;
}