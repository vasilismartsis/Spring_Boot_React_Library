import { ReservationContext } from "./ReservationContext";
import ReservationList from "./ReservationList";
import { useReservations } from "./useReservations";

export interface ReservationProps {}

const Reservation: React.FC<ReservationProps> = (props) => {
  const {
    totalReservations,
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
  } = useReservations();

  return (
    <>
      <h1 className="table-label">Reservations</h1>
      <ReservationContext.Provider
        value={{
          totalReservations,
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
        }}
      >
        <ReservationList />
      </ReservationContext.Provider>
    </>
  );
};

export default Reservation;
