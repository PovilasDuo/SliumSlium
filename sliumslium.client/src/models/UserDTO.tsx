import { ReservationDTO } from "./ReservationDTO";

export interface UserDTO {
  id: number;
  type: number;
  username: string;
  email: string;
  passwordHash: string;
  reservations: ReservationDTO[];
}
