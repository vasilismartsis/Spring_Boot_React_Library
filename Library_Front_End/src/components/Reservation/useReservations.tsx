import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import { Button, Dropdown, MenuProps, Pagination, Space, message } from "antd";
import { DownOutlined, UserOutlined } from "@ant-design/icons";
import { Reservation, ReservationResource } from "./types";
import { useMutation, useQuery } from "react-query";
import { SorterResult } from "antd/es/table/interface";
import { Book } from "../Book/types";

export interface ReservationsState {
  totalReservationNumber: number;
  reservations: Reservation[];
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  currentPage: number;
  error?: any;
  reservationRefetch: () => void;
  setSorterResult: React.Dispatch<
    React.SetStateAction<SorterResult<Reservation>>
  >;
  setSearchColumn: React.Dispatch<React.SetStateAction<string>>;
  setSearchValue: React.Dispatch<React.SetStateAction<string>>;
  doEditReservation: (
    data: Reservation,
    onSuccess: () => void,
    onError: (error: string) => void
  ) => void;
  doDeleteReservation: (
    data: Reservation,
    onSuccess: () => void,
    onError: (error: string) => void
  ) => void;
}

export const useReservations: () => ReservationsState = () => {
  const [totalReservationNumber, setTotalReservationNumber] =
    useState<number>(0);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [sorterResult, setSorterResult] = useState<SorterResult<Reservation>>(
    {}
  );
  const [searchColumn, setSearchColumn] = useState<string>("");
  const [searchValue, setSearchValue] = useState<string>("");

  //Get reservations
  const getReservations = () => {
    const currentURL = window.location.href;
    const ip = new URL(currentURL).hostname;
    return axios.get(
      `http://${ip}:8080/api/reservation/getReservations?user=${sessionStorage.getItem(
        "username"
      )}&page=${currentPage}&order=${sorterResult.order}&sortedColumn=${
        sorterResult.columnKey
      }&searchColumn=${searchColumn}&searchValue=${searchValue}`,
      {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      }
    );
  };

  const { error, refetch: reservationRefetch } = useQuery(
    "getReservations",
    getReservations,
    {
      enabled: false,
      onSuccess: (res) => {
        setTotalReservationNumber(
          () => (res.data as ReservationResource).totalReservationNumber
        );
        setReservations(
          () => (res.data as ReservationResource).singleReservationResponse
        );
      },
    }
  );

  useEffect(() => {
    reservationRefetch();
  }, [currentPage, sorterResult, searchValue, searchColumn]);

  //Edit reservation
  const postEditReservation = (values: Reservation) => {
    const currentURL = window.location.href;
    const ip = new URL(currentURL).hostname;
    return axios.post(
      `http://${ip}:8080/api/reservation/editReservation`,
      values,
      {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      }
    );
  };

  const editReservationMutation = useMutation(
    "editReservationQuery",
    postEditReservation
  );

  const doEditReservation = (
    values: Reservation,
    onSuccess: () => void,
    onError: (error: string) => void
  ) => {
    editReservationMutation.mutate(values, {
      onSuccess,
      onError: (error) => {
        onError(
          error instanceof Error ? error.message : "Unknown error occurred"
        );
      },
    });
  };

  //Delete reservation
  const postDeleteReservation = (values: Reservation) => {
    const currentURL = window.location.href;
    const ip = new URL(currentURL).hostname;
    return axios.post(
      `http://${ip}:8080/api/reservation/deleteReservation`,
      values,
      {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      }
    );
  };

  const deleteReservationMutation = useMutation(
    "deleteReservationQuery",
    postDeleteReservation
  );

  const doDeleteReservation = (
    values: Reservation,
    onSuccess: () => void,
    onError: (error: string) => void
  ) => {
    deleteReservationMutation.mutate(values, {
      onSuccess,
      onError: (error) => {
        onError(
          error instanceof Error ? error.message : "Unknown error occurred"
        );
      },
    });
  };

  return {
    totalReservationNumber,
    reservations,
    setCurrentPage,
    currentPage,
    error,
    reservationRefetch,
    setSorterResult,
    setSearchColumn,
    setSearchValue,
    doEditReservation,
    doDeleteReservation,
  };
};
