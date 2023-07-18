import React from "react";
import MyReservationsList from "./MyReservationsList";

export default function MyReservations() {
  return (
    <>
      {" "}
      <h1 className="table-label">My Reservations</h1>
      <MyReservationsList />
    </>
  );
}
