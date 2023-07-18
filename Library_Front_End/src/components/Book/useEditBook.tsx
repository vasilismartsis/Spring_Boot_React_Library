import { message } from "antd";
import { FormInstance, useForm } from "antd/es/form/Form";
import { useEffect, useState } from "react";
import { Book, EditBookForm } from "./types";
import { useBooks } from "./useBooks";

export interface useEditBookState {
  openEditBookModal: boolean;
  editBookForm: FormInstance<EditBookForm>;
  handleEditBook: () => void;
  handleEditBookOk: () => void;
  handleEditBookCancel: () => void;
  onEditBookFinish: (values: any) => void;
  onEditBookFinishFailed: (errorInfo: any) => void;
  editedBook: Book;
  setEditedBook: React.Dispatch<React.SetStateAction<Book>>;
}

export const useEditBook: () => useEditBookState = () => {
  const [openEditBookModal, setOpenEditBookModal] = useState(false);
  const [editBookForm] = useForm<EditBookForm>();
  const [editedBook, setEditedBook] = useState<Book>({} as Book);

  const {
    totalBookNumber,
    books,
    bookError: bookError,
    setCurrentPage,
    currentPage,
    setGenres,
    bookRefetch,
    setSorterResult,
    setSearchColumn,
    setSearchValue,
    doEditBook,
  } = useBooks(5);

  useEffect(() => {
    if (Object.keys(editedBook).length > 0) {
      editBookForm.setFieldsValue({
        title: editedBook.title,
        quantity: editedBook.quantity,
        genre: editedBook.genre,
      });
    }
  }, [editBookForm, editedBook, openEditBookModal]);

  const handleEditBook = () => {
    setOpenEditBookModal(true);
  };

  const handleEditBookOk = () => {
    editBookForm.submit();
  };

  const handleEditBookCancel = () => {
    setOpenEditBookModal(false);
    editBookForm.resetFields();
  };

  const onEditBookFinish = (values: any) => {
    const mappedValues = {
      ...values,
      id: editedBook.id,
    };

    doEditBook(mappedValues, onEditBookSuccess, onEditBookError);
  };

  const onEditBookFinishFailed = (errorInfo: any) => {
    message.info(
      <span style={{ fontSize: "30px" }}>Please complete all fields</span>
    );
  };

  const onEditBookSuccess = () => {
    bookRefetch();
    setOpenEditBookModal(false);
    editBookForm.resetFields();
    message.info(
      <span style={{ fontSize: "30px" }}>Book edited successfully</span>
    );
  };

  const onEditBookError = (error: any) => {
    {
      message.info(<span style={{ fontSize: "30px" }}>Error: {error}</span>);
    }
  };
  return {
    openEditBookModal,
    editBookForm,
    handleEditBook,
    handleEditBookOk,
    handleEditBookCancel,
    onEditBookFinish,
    onEditBookFinishFailed,
    editedBook,
    setEditedBook,
  };
};
