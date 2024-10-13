import { BookDTO } from "./BookDTO";

export interface ReservationDTO {
    ReservationType: string;
    QuickPickUp: boolean;
    Days: number;
    TotalAmount: number;
    ReservedAt: Date;
    Books: BookDTO
}