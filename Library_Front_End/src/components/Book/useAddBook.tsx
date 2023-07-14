import { message } from "antd";
import { FormInstance, useForm } from "antd/es/form/Form";
import { useState } from "react";
import { AddBookForm } from "./types";
import { useBooks } from "./useBooks";

export interface useAddBookState {
  openAddBookModal: boolean;
  addBookForm: FormInstance<AddBookForm>;
  handleAddBook: () => void;
  handleAddBookOk: () => void;
  handleAddBookCancel: () => void;
  onAddBookFinish: (values: any) => void;
  onAddBookFinishFailed: (errorInfo: any) => void;
}

export const useAddBook: () => useAddBookState = () => {
  const [openAddBookModal, setOpenAddBookModal] = useState(false);
  const [addBookForm] = useForm<AddBookForm>();

  const {
    totalBookNumber,
    books,
    error: bookError,
    setCurrentPage,
    currentPage,
    setGenres,
    bookRefetch,
    setSorterResult,
    setSearchColumn,
    setSearchValue,
    doAddBook,
  } = useBooks();

  const handleAddBook = () => {
    setOpenAddBookModal(true);
  };

  const handleAddBookOk = () => {
    addBookForm.submit();
  };

  const handleAddBookCancel = () => {
    setOpenAddBookModal(false);
  };

  const onAddBookFinish = (values: any) => {
    const mappedValues = {
      ...values,
      createdBy: sessionStorage.getItem("username") ?? "",
      lastModifiedBy: sessionStorage.getItem("username") ?? "",
    };

    doAddBook(mappedValues, onAddBookSuccess, onAddBookError);
  };

  const onAddBookFinishFailed = (errorInfo: any) => {
    message.info(
      <span style={{ fontSize: "30px" }}>Please complete all fields</span>
    );
  };

  const onAddBookSuccess = () => {
    bookRefetch();
    setOpenAddBookModal(false);
    addBookForm.resetFields();
    message.info(
      <span style={{ fontSize: "30px" }}>Book added successfully</span>
    );
  };

  const onAddBookError = (error: any) => {
    {
      message.info(
        <span style={{ fontSize: "30px" }}>Internal Error: {error}</span>
      );
    }
  };
  return {
    openAddBookModal,
    addBookForm,
    handleAddBook,
    handleAddBookOk,
    handleAddBookCancel,
    onAddBookFinish,
    onAddBookFinishFailed,
  };
};
