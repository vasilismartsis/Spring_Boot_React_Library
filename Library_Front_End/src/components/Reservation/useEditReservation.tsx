import { FormInstance, message } from "antd";
import { EditReservationForm, Reservation } from "./types";
import { useReservations } from "./useReservations";
import { useCallback, useContext, useEffect, useState } from "react";
import { useForm } from "antd/es/form/Form";
import dayjs from "dayjs";
import { ReservationContext } from "./ReservationContext";

export interface useEditReservationState {
  openEditReservationModal: boolean;
  editReservationForm: FormInstance<EditReservationForm>;
  handleEditReservation: () => void;
  handleEditReservationOk: () => void;
  handleEditReservationCancel: () => void;
  onEditReservationFinish: (values: any) => void;
  onEditReservationFinishFailed: (errorInfo: any) => void;
  setOpenEditReservationModal: React.Dispatch<React.SetStateAction<boolean>>;
  editedReservation: Reservation;
  setEditedReservation: React.Dispatch<React.SetStateAction<Reservation>>;
}

export const useEditReservation: () => useEditReservationState = () => {
  const [openEditReservationModal, setOpenEditReservationModal] =
    useState(false);
  const [editReservationForm] = useForm<EditReservationForm>();
  const [editedReservation, setEditedReservation] = useState<Reservation>(
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

  useEffect(() => {
    if (Object.keys(editedReservation).length > 0) {
      editReservationForm.setFieldsValue({
        username: editedReservation.username,
        bookTitle: editedReservation.bookTitle,
        reservationDate: dayjs(editedReservation.reservationDate),
        expirationDate: dayjs(editedReservation.expirationDate),
      });
    }
  }, [editReservationForm, editedReservation, openEditReservationModal]);

  const handleEditReservation = () => {
    setOpenEditReservationModal(true);
  };

  const handleEditReservationOk = () => {
    editReservationForm.submit();
  };

  const handleEditReservationCancel = () => {
    setOpenEditReservationModal(false);
    editReservationForm.resetFields();
  };

  const onEditReservationFinish = (values: any) => {
    const mappedValues = {
      ...values,
      id: editedReservation.id,
    };

    doEditReservation(
      mappedValues,
      onEditReservationSuccess,
      onEditReservationError
    );
  };

  const onEditReservationFinishFailed = (errorInfo: any) => {
    message.info(
      <span style={{ fontSize: "30px" }}>Please complete all fields!</span>
    );
  };

  const onEditReservationSuccess = () => {
    reservationRefetch();
    setOpenEditReservationModal(false);
    editReservationForm.resetFields();
    message.info(
      <span style={{ fontSize: "30px" }}>
        Reservation updated successfully!
      </span>
    );
  };

  const onEditReservationError = (error: any) => {
    {
      message.info(
        <span style={{ fontSize: "30px" }}>Internal Error: {error}</span>
      );
    }
  };
  return {
    openEditReservationModal,
    editReservationForm,
    handleEditReservation,
    handleEditReservationOk,
    handleEditReservationCancel,
    onEditReservationFinish,
    onEditReservationFinishFailed,
    setOpenEditReservationModal,
    editedReservation,
    setEditedReservation,
  };
};
