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

export const postReservation = async (
  reservation: ReservationDTO
): Promise<any> => {
  try {
    const response = await axios.post(BASE_URL, reservation, {
      headers: { "Content-Type": "application/json" },
    });

    if (response.status === 201) {
      console.log("Reservation created successfully");
      return response.data;
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 400) {
      const errorMessage =
        error.response.data?.message || "Invalid reservation data.";
      console.error("Validation error:", errorMessage);
      throw new Error(errorMessage);
    } else {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      console.error("Error creating reservation:", errorMessage);
      throw new Error(`Failed to create reservation: ${errorMessage}`);
    }
  }
};
