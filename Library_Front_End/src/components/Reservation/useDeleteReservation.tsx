import { message } from "antd";
import { FormInstance, useForm } from "antd/es/form/Form";
import { useContext, useState } from "react";
import { useReservations } from "./useReservations";
import { Reservation } from "./types";
import { ReservationContext } from "./ReservationContext";

export interface useDeleteReservationState {
  handleDeleteReservationOk: () => void;
  setDeletedReservation: React.Dispatch<React.SetStateAction<Reservation>>;
}

export const useDeleteReservation: () => useDeleteReservationState = () => {
  const [deletedReservation, setDeletedReservation] = useState<Reservation>(
    {} as Reservation
  );

  const {
    totalReservations: totalReservationNumber,
    reservations,
    setCurrentPage,
    currentPage,
    reservationError,
    reservationRefetch,
    setSorterResult,
    setSearchColumn,
    setSearchValue,
    doEditReservation,
    doDeleteReservation,
  } = useContext(ReservationContext);

  const handleDeleteReservationOk = () => {
    const mappedValues = {
      id: deletedReservation.id,
      bookTitle: deletedReservation.bookTitle,
    } as Reservation;

    doDeleteReservation(
      mappedValues,
      onDeleteReservationSuccess,
      onDeleteReservationError
    );
  };

  const onDeleteReservationSuccess = () => {
    reservationRefetch();
    message.info(
      <span style={{ fontSize: "30px" }}>Reservation deleted successfully</span>
    );
  };

  const onDeleteReservationError = (error: any) => {
    {
      message.info(
        <span style={{ fontSize: "30px" }}>Internal Error: {error}</span>
      );
    }
  };
  return {
    handleDeleteReservationOk,
    setDeletedReservation,
  };
};
