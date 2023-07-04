import ReservationList from "./ReservationList";

export interface ReservationProps {}

const Reservation: React.FC<ReservationProps> = (props) => {
  return (
    <>
      <h1 className="table-label">Reservations</h1>
      <ReservationList />
    </>
  );
};

export default Reservation;
