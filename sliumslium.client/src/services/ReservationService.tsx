import axios from "axios";
import { ReservationDTO } from "../models/ReservationDTO";

const BASE_URL = "https://localhost:7091/api/Reservations";

export const fetchReservations = async (
  url: string = BASE_URL
): Promise<ReservationDTO[]> => {
  try {
    const response = await axios.get<ReservationDTO[]>(url);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error:", error.message);
      console.error("Response data:", error.response?.data);
    } else {
      console.error("Unexpected error:", error);
    }
    throw error;
  }
};
