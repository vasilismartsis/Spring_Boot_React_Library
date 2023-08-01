import { message } from "antd";
import { FormInstance, useForm } from "antd/es/form/Form";
import { useContext, useEffect, useState } from "react";
import { useBooks } from "./useBooks";
import { Book } from "./types";
import { BookContext } from "./BookContext";

export interface useDeleteBookState {
  handleDeleteBookOk: () => void;
  setDeletedBook: React.Dispatch<React.SetStateAction<Book>>;
}

export const useDeleteBook: () => useDeleteBookState = () => {
  const { bookRefetch, doDeleteBook } = useContext(BookContext);

  const [deletedBook, setDeletedBook] = useState<Book>({} as Book);

  const handleDeleteBookOk = () => {
    // console.log(deletedBook);

    const mappedValues = {
      id: deletedBook.id,
    } as Book;

    doDeleteBook(mappedValues, onDeleteBookSuccess, onDeleteBookError);
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
