import axios, { AxiosResponse } from "axios";
import React, { useEffect, useMemo, useState } from "react";
import { Button, Dropdown, MenuProps, Pagination, Space, message } from "antd";
import { DownOutlined, UserOutlined } from "@ant-design/icons";
import { Book, BookResource } from "./types";
import {
  QueryObserverResult,
  RefetchOptions,
  RefetchQueryFilters,
  useQuery,
} from "react-query";
import { SorterResult } from "antd/es/table/interface";

export interface BooksState {
  totalBookNumber: number;
  books: Book[];
  error?: any;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  currentPage: number;
  setGenres: React.Dispatch<React.SetStateAction<string[]>>;
  refetch: () => void;
  setSorterResult: React.Dispatch<React.SetStateAction<SorterResult<Book>>>;
  setSearchColumn: React.Dispatch<React.SetStateAction<string>>;
  setSearchValue: React.Dispatch<React.SetStateAction<string>>;
}

export const useBooks: () => BooksState = () => {
  const [totalBookNumber, setTotalBookNumber] = useState<number>(0);
  const [books, setBooks] = useState<Book[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [genres, setGenres] = useState<string[]>([]);
  const [sorterResult, setSorterResult] = useState<SorterResult<Book>>({});
  const [searchColumn, setSearchColumn] = useState<string>("");
  const [searchValue, setSearchValue] = useState<string>("");

  const getBooks = () => {
    return axios.get(
      `http://localhost:8080/api/book/getBooks?genres=${genres}&page=${currentPage}&order=${sorterResult.order}&sortedColumn=${sorterResult.field}&searchColumn=${searchColumn}&searchValue=${searchValue}`,
      {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      }
    );
  };

  const { error, refetch } = useQuery("getBooks", getBooks, {
    enabled: false,
    onSuccess: (res) => {
      setTotalBookNumber(() => (res.data as BookResource).totalBookNumber);
      setBooks(() => (res.data as BookResource).singleBookResponse);
    },
  });

  useEffect(() => {
    refetch();
  }, [currentPage, genres, sorterResult, searchValue, searchColumn]);

  return {
    totalBookNumber,
    books,
    error,
    setCurrentPage,
    currentPage,
    setGenres,
    refetch,
    setSorterResult,
    setSearchColumn,
    setSearchValue,
  };
};
