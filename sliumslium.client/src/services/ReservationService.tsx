import axios from "axios";
import { ReservationDTO } from "../models/ReservationDTO";

const BASE_URL = "https://localhost:7091/api/Reservations";

export const fetchReservations = async (
  url: string = BASE_URL
): Promise<ReservationDTO[]> => {
  try {
    const response = await axios.get<ReservationDTO[]>(url);
    M.toast({ html: "Reservations fetched successfully", classes: "green" });
    return response.data;
  } catch (error) {
    let errorMessage: string;

    if (axios.isAxiosError(error)) {
      errorMessage =
        error.response?.data?.message || "Failed to fetch reservations.";
      console.error("Axios error:", error.message);
      M.toast({
        html: `Failed to fetch reservations: ${errorMessage}`,
        classes: "red",
      });
    } else {
      errorMessage = "An unexpected error occurred.";
      console.error("Unexpected error:", error);
      M.toast({
        html: `Failed to fetch reservations: ${errorMessage}`,
        classes: "red",
      });
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

    if (response.status === 201) return response.data;
  } catch (error) {
    let errorMessage: string;

    if (axios.isAxiosError(error) && error.response?.status === 400) {
      errorMessage =
        error.response.data?.message || "Invalid reservation data.";
      console.error("Validation error:", errorMessage);
      M.toast({
        html: `Failed to create reservation: ${errorMessage}`,
        classes: "red",
      });
      throw new Error(errorMessage);
    } else {
      errorMessage = error instanceof Error ? error.message : "Unknown error";
      console.error("Error creating reservation:", errorMessage);
      M.toast({
        html: `Failed to create reservation: ${errorMessage}`,
        classes: "red",
      });
      throw new Error(`Failed to create reservation: ${errorMessage}`);
    }
  }
};
