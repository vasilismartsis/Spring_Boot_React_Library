import axios, { AxiosResponse } from "axios";
import React, { useEffect, useMemo, useState } from "react";
import { Button, Dropdown, MenuProps, Pagination, Space, message } from "antd";
import { DownOutlined, BookOutlined } from "@ant-design/icons";
import { Book, BookResource } from "./types";
import {
  QueryObserverResult,
  RefetchOptions,
  RefetchQueryFilters,
  useMutation,
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
  bookRefetch: () => void;
  setSorterResult: React.Dispatch<React.SetStateAction<SorterResult<Book>>>;
  setSearchColumn: React.Dispatch<React.SetStateAction<string>>;
  setSearchValue: React.Dispatch<React.SetStateAction<string>>;
  doAddBook: (
    data: Book,
    onSuccess: () => void,
    onError: (error: string) => void
  ) => void;
}

export const useBooks: () => BooksState = () => {
  const [totalBookNumber, setTotalBookNumber] = useState<number>(0);
  const [books, setBooks] = useState<Book[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [genres, setGenres] = useState<string[]>([]);
  const [sorterResult, setSorterResult] = useState<SorterResult<Book>>({});
  const [searchColumn, setSearchColumn] = useState<string>("");
  const [searchValue, setSearchValue] = useState<string>("");

  //Get Books
  const getBooks = () => {
    const currentURL = window.location.href;
    const ip = new URL(currentURL).hostname;
    return axios.get(
      `http://${ip}:8080/api/book/getBooks?genres=${genres}&page=${currentPage}&order=${sorterResult.order}&sortedColumn=${sorterResult.field}&searchColumn=${searchColumn}&searchValue=${searchValue}`,
      {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      }
    );
  };

  const { error, refetch: bookRefetch } = useQuery("getBooks", getBooks, {
    enabled: false,
    onSuccess: (res) => {
      setTotalBookNumber(() => (res.data as BookResource).totalBookNumber);
      setBooks(() => (res.data as BookResource).singleBookResponse);
    },
  });

  useEffect(() => {
    bookRefetch();
  }, [currentPage, genres, sorterResult, searchValue, searchColumn]);

  //Add Book
  const postAddBook = (values: Book) => {
    const currentURL = window.location.href;
    const ip = new URL(currentURL).hostname;
    return axios.post(`http://${ip}:8080/api/book/addBook`, values, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    });
  };

  const addBookMutation = useMutation("addBookQuery", postAddBook);

  const doAddBook = (
    values: Book,
    onSuccess: () => void,
    onError: (error: string) => void
  ) => {
    addBookMutation.mutate(values, {
      onSuccess,
      onError: (error) => {
        onError(
          error instanceof Error ? error.message : "Unknown error occurred"
        );
      },
    });
  };

  return {
    totalBookNumber,
    books,
    error,
    setCurrentPage,
    currentPage,
    setGenres,
    bookRefetch,
    setSorterResult,
    setSearchColumn,
    setSearchValue,
    doAddBook,
  };
};
