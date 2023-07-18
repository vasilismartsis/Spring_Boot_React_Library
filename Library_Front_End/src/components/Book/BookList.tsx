import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Book, BookColumn, BookResource } from "./types";
import {
  Button,
  Dropdown,
  Input,
  MenuProps,
  Modal,
  Pagination,
  PaginationProps,
  Popconfirm,
  Radio,
  Space,
  Table,
  Tag,
  message,
} from "antd";
import { DownOutlined, UserOutlined, SearchOutlined } from "@ant-design/icons";
import axios from "axios";
import { useGenres } from "./useGenres";
import { useBooks } from "./useBooks";
import { parse } from "path";
import { useReserveBook } from "./useReserveBook";
import { ColumnsType, TableProps } from "antd/es/table";
import {
  ColumnFilterItem,
  FilterSearchType,
  SorterResult,
  TablePaginationConfig,
  TableRowSelection,
} from "antd/es/table/interface";
import { CSVLink } from "react-csv";
import { useAddBook } from "./useAddBook";
import AddBook from "./AddBook";
import { useEditBook } from "./useEditBook";
import EditBook from "./EditBook";
import { useDeleteBook } from "./useDeleteBook";
import moment from "moment";
import { useExportCSV } from "../TableExport.tsx/useExportCSV";
import { useReactToPrint } from "react-to-print";
import { useExportPDF } from "../TableExport.tsx/useExportPDF";
import ExportCSVButton from "../TableExport.tsx/ExportCSVButton";
import ExportPDFButton from "../TableExport.tsx/ExportPDFButton";

const BookList: React.FC = () => {
  const [tableData, setTableData] = useState<Book[]>([]);

  const { genres, error: genresError } = useGenres();
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
  } = useBooks();
  const { doReserveBook } = useReserveBook();
  const { csvData } = useExportCSV(books);
  const { exportToPDF } = useExportPDF(books);

  const {
    openAddBookModal,
    addBookForm,
    handleAddBook,
    handleAddBookOk,
    handleAddBookCancel,
    onAddBookFinish,
    onAddBookFinishFailed,
  } = useAddBook();

  const {
    openEditBookModal,
    editBookForm,
    handleEditBook,
    handleEditBookOk,
    handleEditBookCancel,
    onEditBookFinish,
    onEditBookFinishFailed,
    editedBook,
    setEditedBook,
  } = useEditBook();

  const { handleDeleteBookOk, setDeletedBook } = useDeleteBook();

  useEffect(() => {
    bookRefetch();
  }, []);

  useEffect(() => {
    if (!!genresError) {
      message.info(
        <span style={{ fontSize: "30px" }}>
          "There was an error on the server. Please reload the page! Error:{" "}
          {genresError}"
        </span>
      );
    }
  }, [genresError]);

  useEffect(() => {
    if (!!bookError) {
      message.info(
        <span style={{ fontSize: "30px" }}>
          "There was an error on the server. Please reload the page! Error:{" "}
          {bookError}"
        </span>
      );
    }
  }, [bookError]);

  const onReserveBookSuccess = () => {
    message.success(
      <span style={{ fontSize: "30px" }}>
        You have succesfully reserved this book!
      </span>
    );
    bookRefetch();
  };

  const onReserveBookError = (error: string) => {
    message.error(
      <span style={{ fontSize: "30px" }}>Reservation Failed: {error}</span>
    );
  };

  const onSearch = (searchColumnName: string, searchValue: string) => {
    setSearchColumn(searchColumnName);
    setSearchValue(searchValue);
  };

  const columns: BookColumn[] = [
    {
      key: "id",
      title: "Id",
      dataIndex: "id",
      sortable: true,
      searchable: true,
    },
    {
      key: "title",
      title: "Title",
      dataIndex: "title",
      sortable: true,
      searchable: true,
    },
    {
      key: "genre",
      title: "Genre",
      dataIndex: "genre",
      sorter: true,
      filters: genres.map((genre) => ({
        text: genre,
        value: genre,
      })),
      filterSearch: true,
      sortable: true,
    },
    {
      key: "quantity",
      title: "Quantity",
      dataIndex: "quantity",
      sortable: true,
      searchable: true,
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <>
          <Button
            style={{ borderColor: "green", margin: "3px" }}
            onClick={() => {
              doReserveBook(
                record.id,
                onReserveBookSuccess,
                onReserveBookError
              );
            }}
          >
            Reserve
          </Button>
          {sessionStorage.getItem("role") == "ADMIN" ? (
            <>
              <Button
                style={{ borderColor: "blue", margin: "3px" }}
                onClick={() => {
                  setEditedBook(record);
                  handleEditBook();
                }}
              >
                Edit
              </Button>
              <Popconfirm
                title="Delete Book"
                description="Are you sure to delete this book?"
                onConfirm={handleDeleteBookOk}
                okText="Yes"
                cancelText="No"
              >
                <Button
                  style={{ margin: "3px" }}
                  danger
                  onClick={() => {
                    setDeletedBook(record);
                  }}
                >
                  Delete
                </Button>
              </Popconfirm>
            </>
          ) : null}
        </>
      ),
    },
  ];

  const enhancedColumns: ColumnsType<Book> = columns.map((col) => {
    const columnType =
      books.length > 0
        ? typeof (books[0] as any)[String(col.dataIndex)]
        : "string";

    return {
      ...col,
      width: 200,
      align: columnType == "number" ? "right" : "left",
      sorter: col.sortable ? true : false,
      filterDropdown: col.searchable
        ? ({ confirm }) => {
            return (
              <Input
                autoFocus
                placeholder="Search column"
                onChange={(e) => {
                  onSearch(String(col.key), e.target.value);
                }}
                onPressEnter={() => confirm}
              />
            );
          }
        : false,
      filterIcon: col.searchable
        ? () => {
            return <SearchOutlined />;
          }
        : false,
    };
  });

  useEffect(() => {
    setTableData(
      books.map((book) => ({
        key: book.id,
        ...book,
      }))
    );
  }, [books]);

  const pagination: TablePaginationConfig = {
    position: ["bottomCenter"],
    onChange(page) {
      setCurrentPage(() => page);
    },
    pageSize: 5,
    current: currentPage,
    total: totalBookNumber,
    defaultCurrent: 1,
  };

  const onChange: TableProps<Book>["onChange"] = (_, filter, sorter) => {
    const sorterResult = sorter as SorterResult<Book>;
    setSorterResult(sorterResult);
    setGenres(
      (filter.genre as string[]) != null ? (filter.genre as string[]) : []
    );
  };

  return (
    <>
      {sessionStorage.getItem("role") == "ADMIN" ? (
        <Button
          onClick={handleAddBook}
          type="primary"
          style={{ marginBottom: 16 }}
        >
          Add a new book
        </Button>
      ) : null}
      <ExportCSVButton csvData={csvData}></ExportCSVButton>
      <ExportPDFButton exportToPDF={exportToPDF}></ExportPDFButton>
      <Table<Book>
        columns={enhancedColumns}
        dataSource={tableData}
        pagination={pagination}
        bordered={true}
        onChange={onChange}
      />
      <Modal
        title={<h1 className="table-label">Add Book</h1>}
        open={openAddBookModal}
        onOk={handleAddBookOk}
        onCancel={handleAddBookCancel}
      >
        <AddBook
          genres={genres}
          form={addBookForm}
          onFinish={onAddBookFinish}
          onFinishFailed={onAddBookFinishFailed}
        />
      </Modal>
      <Modal
        key="editUserModal"
        title={<h1 className="table-label">Edit User</h1>}
        open={openEditBookModal}
        onOk={handleEditBookOk}
        onCancel={handleEditBookCancel}
      >
        <EditBook
          genres={genres}
          form={editBookForm}
          onFinish={onEditBookFinish}
          onFinishFailed={onEditBookFinishFailed}
          editedBook={editedBook}
        />
      </Modal>
    </>
  );
};

export default BookList;
