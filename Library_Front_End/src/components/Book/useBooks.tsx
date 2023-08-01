import axios, { AxiosError, AxiosResponse } from "axios";
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
  totalBooks: number;
  totalZeroQuantityBooks: number;
  totalBookCopies: number;
  totalBookCopiesReserved: number;
  books: Book[];
  bookError?: any;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  currentPage: number;
  pageSize: number;
  setPageSize: React.Dispatch<React.SetStateAction<number>>;
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
  doEditBook: (
    data: Book,
    onSuccess: () => void,
    onError: (error: string) => void
  ) => void;
  doDeleteBook: (
    data: Book,
    onSuccess: () => void,
    onError: (error: string) => void
  ) => void;
  xlsxError?: any;
  xlsxRefetch: () => void;
  pdfError?: any;
  pdfRefetch: () => void;
  pptxError?: any;
  pptxRefetch: () => void;
}

export const useBooks: () => BooksState = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(5);
  const [genres, setGenres] = useState<string[]>([]);
  const [sorterResult, setSorterResult] = useState<SorterResult<Book>>({});
  const [searchColumn, setSearchColumn] = useState<string>("");
  const [searchValue, setSearchValue] = useState<string>("");

  //Get Books
  const getBooks = () => {
    const currentURL = window.location.href;
    const ip = new URL(currentURL).hostname;
    return axios
      .get<any, AxiosResponse<BookResource>>(
        `http://${ip}:8080/api/book/getBooks?genres=${genres}&pageSize=${pageSize}&page=${currentPage}&order=${sorterResult.order}&sortedColumn=${sorterResult.field}&searchColumn=${searchColumn}&searchValue=${searchValue}`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      )
      .then((r) => r.data);
  };

  const {
    error: bookError,
    refetch: bookRefetch,
    data: bookData,
  } = useQuery("getBooks", getBooks, {
    enabled: false,
    onError(err: AxiosError) {
      if (err.code == AxiosError.ERR_BAD_REQUEST) {
        window.location.href = "/login";
      }
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

  //Edit Book
  const postEditBook = (values: Book) => {
    const currentURL = window.location.href;
    const ip = new URL(currentURL).hostname;
    return axios.post(`http://${ip}:8080/api/book/editBook`, values, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    });
  };

  const editBookMutation = useMutation("editBookQuery", postEditBook);

  const doEditBook = (
    values: Book,
    onSuccess: () => void,
    onError: (error: string) => void
  ) => {
    editBookMutation.mutate(values, {
      onSuccess,
      onError: (error) => {
        onError(
          error instanceof Error ? error.message : "Unknown error occurred"
        );
      },
    });
  };

  //Delete Book
  const postDeleteBook = (values: Book) => {
    const currentURL = window.location.href;
    const ip = new URL(currentURL).hostname;
    return axios.post(`http://${ip}:8080/api/book/deleteBook`, values, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    });
  };

  const deleteBookMutation = useMutation("deleteBookQuery", postDeleteBook);

  const doDeleteBook = (
    values: Book,
    onSuccess: () => void,
    onError: (error: string) => void
  ) => {
    console.log(values);
    deleteBookMutation.mutate(values, {
      onSuccess,
      onError: (error) => {
        onError(
          error instanceof Error ? error.message : "Unknown error occurred"
        );
      },
    });
  };

  //Get XLSX
  const getXLSX = () => {
    const currentURL = window.location.href;
    const ip = new URL(currentURL).hostname;
    return axios.get(`http://${ip}:8080/api/book/getXLSX`, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
      responseType: "blob", // Set the response type to 'blob' to handle binary data
    });
  };

  const { error: xlsxError, refetch: xlsxRefetch } = useQuery(
    "getXLSX",
    getXLSX,
    {
      enabled: false,
      onSuccess: (res) => {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "Books.xlsx");
        document.body.appendChild(link);
        link.click();
      },
    }
  );

  //Get PDF
  const getPDF = () => {
    const currentURL = window.location.href;
    const ip = new URL(currentURL).hostname;
    return axios.get(`http://${ip}:8080/api/book/getPDF`, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
      responseType: "blob", // Set the response type to 'blob' to handle binary data
    });
  };

  const { error: pdfError, refetch: pdfRefetch } = useQuery("getPDF", getPDF, {
    enabled: false,
    onSuccess: (res) => {
      const pdfBlob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "Books.pdf");
      document.body.appendChild(link);
      link.click();
    },
  });

  //Get PPTX
  const getPPTX = () => {
    const currentURL = window.location.href;
    const ip = new URL(currentURL).hostname;
    return axios.get(`http://${ip}:8080/api/book/getPPTX`, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
      responseType: "blob", // Set the response type to 'blob' to handle binary data
    });
  };

  const { error: pptxError, refetch: pptxRefetch } = useQuery(
    "getPPTX",
    getPPTX,
    {
      enabled: false,
      onSuccess: (res) => {
        const pptxBlob = new Blob([res.data], { type: "application/pptx" });
        const url = window.URL.createObjectURL(pptxBlob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "Books.pptx");
        document.body.appendChild(link);
        link.click();
      },
    }
  );

  return {
    totalBooks: bookData?.totalBooks || 0,
    totalZeroQuantityBooks: bookData?.totalZeroQuantityBooks || 0,
    totalBookCopies: bookData?.totalBookCopies || 0,
    totalBookCopiesReserved: bookData?.totalBookCopiesReserved || 0,
    books: bookData?.singleBookResponse || [],
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
  };
};
