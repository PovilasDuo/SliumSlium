import { PaymentDTO } from "./PaymentDTO";
import { ReservationBookDTO } from "./ReservationBooksDTO";

export interface ReservationDTO {
  id?: number;
  reservedAt: Date;
  paymentId : number;
  payment : PaymentDTO;
  reservationBooks: ReservationBookDTO[];
}
