import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import { Button, Dropdown, MenuProps, Pagination, Space, message } from "antd";
import { DownOutlined, UserOutlined } from "@ant-design/icons";
import { Reservation, ReservationResource } from "./types";
import { useQuery } from "react-query";
import { SorterResult } from "antd/es/table/interface";
import { Book } from "../Book/types";

export interface ReservationsState {
  totalReservationNumber: number;
  reservations: Reservation[];
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  currentPage: number;
  error?: any;
  refetch: () => void;
  setSorterResult: React.Dispatch<
    React.SetStateAction<SorterResult<Reservation>>
  >;
  setSearchColumn: React.Dispatch<React.SetStateAction<string>>;
  setSearchValue: React.Dispatch<React.SetStateAction<string>>;
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

  const getReservations = () => {
    return axios.get(
      `http://localhost:8080/api/reservation/getReservations?page=${currentPage}&order=${sorterResult.order}&sortedColumn=${sorterResult.columnKey}&searchColumn=${searchColumn}&searchValue=${searchValue}`,
      {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      }
    );
  };

  const { error, refetch } = useQuery("getReservations", getReservations, {
    enabled: false,
    onSuccess: (res) => {
      setTotalReservationNumber(
        () => (res.data as ReservationResource).totalReservationNumber
      );
      setReservations(
        () => (res.data as ReservationResource).singleReservationResponse
      );
    },
  });

  useEffect(() => {
    refetch();
  }, [currentPage, sorterResult, searchValue, searchColumn]);

  return {
    totalReservationNumber,
    reservations,
    setCurrentPage,
    currentPage,
    error,
    refetch,
    setSorterResult,
    setSearchColumn,
    setSearchValue,
  };
};
