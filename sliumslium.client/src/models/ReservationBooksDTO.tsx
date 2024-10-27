import { BookDTO } from "./BookDTO";
import { ReservationDTO } from "./ReservationDTO";

export interface ReservationBookDTO {
  id?: number,
  reservationId?: number,
  reservation?: ReservationDTO,
  bookId?: number,
  book: BookDTO,
  days: number,
  quickPickUp: boolean,
  price: number
}
