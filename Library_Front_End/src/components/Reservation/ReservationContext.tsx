import { createContext } from "react";
import { Reservation } from "./types";
import { SorterResult } from "antd/es/table/interface";

interface ReservationContextValue {
  totalReservations: number;
  reservations: Reservation[];
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  currentPage: number;
  reservationError?: any;
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

export const ReservationContext = createContext<ReservationContextValue>({
  totalReservations: 0,
  reservations: [],
  reservationError: {},
  setCurrentPage: () => {},
  currentPage: 1,
  reservationRefetch: () => {},
  setSorterResult: () => {},
  setSearchColumn: () => {},
  setSearchValue: () => {},
  doEditReservation: () => {},
  doDeleteReservation: () => {},
});
