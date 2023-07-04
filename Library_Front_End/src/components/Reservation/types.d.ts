export type ReservationResource = {
    totalReservationNumber: number;
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