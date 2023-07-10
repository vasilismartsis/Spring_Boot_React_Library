import axios from "axios";
import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Button, Dropdown, MenuProps, Pagination, Space, message } from "antd";
import { DownOutlined, UserOutlined } from "@ant-design/icons";
import { Book, BookResource } from "./types";
import { useMutation } from "react-query";

export interface ReservationState {
  doReservation: (
    value: Book,
    onSuccess: () => void,
    onError: (error: string) => void
  ) => void;
}

export const useReservation: () => ReservationState = () => {
  const postReservation = ({
    username,
    bookId,
  }: {
    username: string;
    bookId: number;
  }) => {
    const currentURL = window.location.href;
    const ip = new URL(currentURL).hostname;
    return axios.post(
      `http://${ip}:8080/api/reservation/reserve`,
      { username, bookId },
      {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      }
    );
  };

  const reservationMutation = useMutation("reservationQuery", postReservation);

  const doReservation = (
    value: Book,
    onSuccess: () => void,
    onError: (error: string) => void
  ) => {
    reservationMutation.mutate(
      {
        username: sessionStorage.getItem("username") || "",
        bookId: value.id,
      },
      {
        onSuccess: () => {
          onSuccess();
        },
        onError: (error) => {
          onError(
            error instanceof Error ? error.message : "Unknown error occurred"
          );
        },
      }
    );
  };

  return { doReservation };
};
