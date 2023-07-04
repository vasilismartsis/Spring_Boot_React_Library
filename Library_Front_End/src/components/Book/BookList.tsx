import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Book, BookResource } from "./types";
import {
  Button,
  Dropdown,
  Input,
  MenuProps,
  Pagination,
  PaginationProps,
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
import { useReservation } from "./useReservation";
import { ColumnsType, TableProps } from "antd/es/table";
import {
  ColumnFilterItem,
  FilterSearchType,
  SorterResult,
  TablePaginationConfig,
  TableRowSelection,
} from "antd/es/table/interface";

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
    refetch,
    setSorterResult,
    setSearchColumn,
    setSearchValue,
  } = useBooks();
  const { doReservation } = useReservation();

  useEffect(() => {
    refetch();
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

  const onReservationSuccess = () => {
    message.success(
      <span style={{ fontSize: "30px" }}>
        You have succesfully reserved this book!
      </span>
    );
  };

  const onReservationError = (error: string) => {
    message.error(
      <span style={{ fontSize: "30px" }}>Reservation Failed: {error}</span>
    );
  };

  const onSearch = (searchColumnName: string, searchValue: string) => {
    setSearchColumn(searchColumnName);
    setSearchValue(searchValue);
  };

  const columns: ColumnsType<Book> = [
    {
      key: "id",
      title: "Id",
      dataIndex: "id",
      sorter: true,
    },
    {
      key: "title",
      title: "Title",
      dataIndex: "title",
      sorter: true,
      filterDropdown: ({ confirm }) => {
        return (
          <Input
            autoFocus
            placeholder="Search column"
            onChange={(e) => {
              onSearch("title", e.target.value);
            }}
            onPressEnter={() => confirm}
          />
        );
      },
      filterIcon: () => {
        return <SearchOutlined />;
      },
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
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <button
            style={{ color: "green" }}
            onClick={() => {
              doReservation(record, onReservationSuccess, onReservationError);
            }}
          >
            Reserve
          </button>
        </Space>
      ),
    },
  ];

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
      <Table<Book>
        columns={columns}
        dataSource={tableData}
        pagination={pagination}
        bordered={true}
        onChange={onChange}
      />
    </>
  );
};

export default BookList;
