export interface ReservationResult {
  reservations: Reservation[];
}

export interface Reservation {
  reservationStart: Date;
  reservationEnd: Date;
}
