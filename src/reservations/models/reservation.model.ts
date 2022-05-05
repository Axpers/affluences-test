export interface ReservationResult {
  reservations: Reservation[];
}

export interface Reservation {
  reservationStart: string;
  reservationEnd: string;
}
