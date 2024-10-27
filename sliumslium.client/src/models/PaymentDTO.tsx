import { ReservationBookDTO } from "./ReservationBooksDTO";

export interface PaymentDTO {
    id?: number;
    amount: number;
    paymentDate: Date;
    reservationId?: number;
    reservationBook?: ReservationBookDTO | null;
  }
  