import { ReservationBookDTO } from "./ReservationBooksDTO";

export interface ReservationDTO {
  id?: number;
  totalAmount: number;
  reservedAt: Date;
  reservationBooks: ReservationBookDTO[];
}
