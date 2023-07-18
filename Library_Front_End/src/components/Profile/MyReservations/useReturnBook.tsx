import { message } from "antd";
import { FormInstance, useForm } from "antd/es/form/Form";
import { useState } from "react";
import { Reservation } from "../../Reservation/types";
import { useReservations } from "../../Reservation/useReservations";

export interface useDeleteReservationState {
  handleDeleteReservationOk: () => void;
  setDeletedReservation: React.Dispatch<React.SetStateAction<Reservation>>;
}

export const useDeleteReservation: () => useDeleteReservationState = () => {
  const [deletedReservation, setDeletedReservation] = useState<Reservation>(
    {} as Reservation
  );

  const {
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
  } = useReservations();

  const handleDeleteReservationOk = () => {
    const mappedValues = {
      ...deletedReservation,
      bookTitle: deletedReservation.bookTitle,
    };

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
