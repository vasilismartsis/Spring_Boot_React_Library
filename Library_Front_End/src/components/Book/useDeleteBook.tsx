import { message } from "antd";
import { FormInstance, useForm } from "antd/es/form/Form";
import { useState } from "react";
import { useBooks } from "./useBooks";
import { Book } from "./types";

export interface useDeleteBookState {
  handleDeleteBookOk: () => void;
  setDeletedBook: React.Dispatch<React.SetStateAction<Book>>;
}

export const useDeleteBook: () => useDeleteBookState = () => {
  const [deletedBook, setDeletedBook] = useState<Book>({} as Book);

  const {
    totalBookNumber,
    books,
    bookError,
    setCurrentPage,
    currentPage,
    setGenres,
    bookRefetch,
    setSorterResult,
    setSearchColumn,
    setSearchValue,
    doAddBook,
    doEditBook,
    doDeleteBook,
  } = useBooks(5);

  const handleDeleteBookOk = () => {
    doDeleteBook(deletedBook, onDeleteBookSuccess, onDeleteBookError);
  };

  const onDeleteBookSuccess = () => {
    bookRefetch();
    message.info(
      <span style={{ fontSize: "30px" }}>Book deleted successfully</span>
    );
  };

  const onDeleteBookError = (error: any) => {
    {
      message.info(
        <span style={{ fontSize: "30px" }}>Internal Error: {error}</span>
      );
    }
  };
  return {
    handleDeleteBookOk,
    setDeletedBook,
  };
};
