import axios from "axios";
import { ReservationBookDTO } from "../models/ReservationBooksDTO";

export const getReservationBookById = async (
  id: number
): Promise<ReservationBookDTO> => {
  const url = `https://localhost:7091/api/ReservationBook/${id}`;
  try {
    const response = await axios.get<ReservationBookDTO>(url);
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

export const extendReservationDayByOne = async (id: number): Promise<void> => {
  const url = `https://localhost:7091/api/ReservationBook/${id}`;
  try {
    const response = await axios.put(url, id);
    if (response.status === 200) {
      M.toast({
        html: "Reservation's book was updated successfully",
        classes: "green",
      });
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 400) {
      const errorMessage = error.response.data?.message || "Invalid book data";
      console.error("Validation error:", errorMessage);
      M.toast({
        html: `Failed to update the reservation's book: ${errorMessage}`,
        classes: "red",
      });
    } else {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      console.error("Error updating reservation's book:", errorMessage);
      M.toast({
        html: `Failed to update reservation's book: ${errorMessage}`,
        classes: "red",
      });
    }
  }
};
