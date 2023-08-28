import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Book, BookColumn, BookResource } from "./types";
import "./BookList.css";
import type { CollapseProps } from "antd";
import {
  Button,
  Collapse,
  Dropdown,
  Input,
  MenuProps,
  Modal,
  Pagination,
  PaginationProps,
  Popconfirm,
  Radio,
  Select,
  Space,
  Table,
  Tag,
  message,
} from "antd";
import { DownOutlined, UserOutlined, SearchOutlined } from "@ant-design/icons";
import { Line } from "@ant-design/charts";
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
import { useExportCSV } from "../TableExport/useExportCSV";
import { useReactToPrint } from "react-to-print";
import ExportCSVButton from "../TableExport/ExportCSVButton";
import PieChart from "./PieChart";
import { BookContext } from "./BookContext";

const BookList: React.FC = () => {
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
    pdfRefetch,
    pdfError,
    pptxRefetch,
    pptxError,
  } = useContext(BookContext);

  const [tableData, setTableData] = useState<Book[]>([]);
  const [isPiePanelOpen, setPiePanelOpen] = useState(false);
  const [showCopies, setShowCopies] = useState<boolean>(false);

  const { genres, error: genresError } = useGenres();

  const { doReserveBook } = useReserveBook();
  const { csvData } = useExportCSV(books);

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
        You have successfully reserved this book!
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
    pageSize,
    current: currentPage,
    total: totalBooks,
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
      <Collapse ghost activeKey={isPiePanelOpen ? "1" : ""}>
        <Collapse.Panel
          key="1"
          header=""
          collapsible="disabled"
          showArrow={false}
          style={{ pointerEvents: !isPiePanelOpen ? "none" : "auto" }}
        >
          <PieChart showCopies={showCopies} />
          <div className="pie-chart-toggle-container">
            <Button
              shape="round"
              className="pie-chart-toggle"
              onClick={() => {
                setShowCopies(!showCopies);
              }}
            >
              {showCopies ? "Show Available" : "Show Total"}
            </Button>
          </div>
        </Collapse.Panel>
      </Collapse>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        {sessionStorage.getItem("role") == "ADMIN" ? (
          <Button
            onClick={handleAddBook}
            type="primary"
            style={{ marginBottom: 16 }}
          >
            Add a new book
          </Button>
        ) : null}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
          }}
        >
          <Select
            value={"Export Table"}
            style={{
              width: 165,
              margin: "1%",
            }}
            status="error"
            options={[
              {
                value: "pdf",
                label: (
                  <Button
                    onClick={pdfRefetch}
                    style={{ backgroundColor: "red", color: "white" }}
                  >
                    Export to PDF
                  </Button>
                ),
              },
              {
                value: "pttx",
                label: (
                  <Button
                    onClick={pptxRefetch}
                    style={{ backgroundColor: "orange" }}
                  >
                    Export to PTTX
                  </Button>
                ),
              },
              {
                value: "xlsx",
                label: (
                  <Button
                    onClick={xlsxRefetch}
                    style={{ backgroundColor: "lightgreen" }}
                  >
                    Export to XLSX
                  </Button>
                ),
              },
              {
                value: "csv",
                label: <ExportCSVButton csvData={csvData}></ExportCSVButton>,
              },
            ]}
          />
          <Button
            style={{
              margin: "1%",
              backgroundColor: "rgb(237, 169, 59)",
            }}
            onClick={() => {
              setPiePanelOpen(!isPiePanelOpen);
            }}
          >
            Pie Chart
          </Button>
        </div>
      </div>
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
        key="editBookModal"
        title={<h1 className="table-label">Edit Book</h1>}
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
