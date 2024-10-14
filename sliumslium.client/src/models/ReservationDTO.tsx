import { ReservationBookDTO } from "./ReservationBooksDTO";

export interface ReservationDTO {
    id? : number,
    quickPickUp: boolean;
    totalAmount: number;
    reservedAt: Date;
    reservationBooks: ReservationBookDTO[]
}