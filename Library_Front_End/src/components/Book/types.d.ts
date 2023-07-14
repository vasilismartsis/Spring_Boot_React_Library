import { ColumnType } from "antd/es/table";

export type BookResource = {
    totalBookNumber: number;
    singleBookResponse: Book[];
}

export type Book = {
        id: number;
        title: string;
        genre: string;
        quantity: number;
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