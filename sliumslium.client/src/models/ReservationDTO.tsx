import { PaymentDTO } from "./PaymentDTO";
import { ReservationBookDTO } from "./ReservationBooksDTO";
import { UserDTO } from "./UserDTO";

export interface ReservationDTO {
  id: number;
  status?: String;
  reservedAt: Date;
  paymentId: number;
  payment: PaymentDTO;
  reservationBooks: ReservationBookDTO[];
  userId?: number;
  user?: UserDTO;
}
