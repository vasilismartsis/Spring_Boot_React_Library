import { ColumnType } from "antd/es/table";

export type ReservationResource = {
    totalReservations: number;
    singleReservationResponse: Reservation[];
}

export type Reservation = {
    id: number;
    username: string;
    bookTitle: string;
    reservationDate: Date;
    expirationDate: Date;
    createdBy: string;
    lastModifiedBy: string;
    creationDate: Date;
    lastModifiedDate: Date;
}

export interface ReservationColumn extends ColumnType<Reservation> {
  searchable?: boolean;
  sortable?: boolean;
}

export type EditReservationForm = {
  username: string;
  bookTitle: string;
  reservationDate: Date;
  expirationDate: Date;
}