import axios, { AxiosError } from "axios";
import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Button, Dropdown, MenuProps, Pagination, Space, message } from "antd";
import { DownOutlined, UserOutlined } from "@ant-design/icons";
import { Book, BookResource, ReserveRequest } from "./types";
import { useMutation } from "react-query";

export interface ReserveBookState {
  doReserveBook: (
    bookId: number,
    onSuccess: () => void,
    onError: (error: string) => void
  ) => void;
}

export const useReserveBook: () => ReserveBookState = () => {
  type MyErrorResponse = {
    errors: { detail: string }[];
  };

  const postReserveBook = (values: ReserveRequest) => {
    const currentURL = window.location.href;
    const ip = new URL(currentURL).hostname;
    return axios.post(`http://${ip}:8080/api/reservation/reserve`, values, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    });
  };

  const ReserveBookMutation = useMutation("ReserveBookQuery", postReserveBook);

  const doReserveBook = (
    bookId: number,
    onSuccess: () => void,
    onError: (error: string) => void
  ) => {
    ReserveBookMutation.mutate(
      {
        username: sessionStorage.getItem("username") || "",
        bookId,
      },
      {
        onSuccess: () => {
          onSuccess();
        },
        onError: (error) => {
          onError(
            error instanceof AxiosError
              ? error.response?.data
              : "Unknown error occurred"
          );
        },
      }
    );
  };

  return { doReserveBook: doReserveBook };
};
