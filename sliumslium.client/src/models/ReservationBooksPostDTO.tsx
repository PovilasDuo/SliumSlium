import { BookDTO } from "./BookDTO";
import { ReservationDTO } from "./ReservationDTO";

export interface ReservationBooksPostDTO {
  reservation?: ReservationDTO,
  book: BookDTO,
  days: number,
  quickPickUp: boolean,
  price: number
}
