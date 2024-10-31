import axios from "axios";
import { ReservationDTO } from "../models/ReservationDTO";

const BASE_URL = "https://localhost:7091/api/Reservations";

export const fetchReservations = async (): Promise<ReservationDTO[]> => {
  try {
    const response = await axios.get<ReservationDTO[]>(BASE_URL);
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

export const deleteReservationById = async (id: number): Promise<number> => {
  try {
    const response = await axios.delete(`${BASE_URL}/${id}`);
    if (response.status === 204) {
      M.toast({ html: "The reservation was deleted successfully", classes: "green" });
      return response.status;
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      console.error("Error: reservation not found", error);
      M.toast({
        html: "reservation not found",
        classes: "red",
      });
      return error.response?.status;
    } else if (axios.isAxiosError(error) && error.response?.status === 400) {
      console.error("Axios error:", error.message);
      M.toast({
        html: `Failed to delete reservation: ${error.response.data}`,
        classes: "red",
      });
      return error.response?.status;
    } else {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      console.error("Error deleting reservation:", errorMessage);
      M.toast({
        html: `Failed to delete reservation: ${errorMessage}`,
        classes: "red",
      });
      return 400;
    }
  }
  return -1;
};

export const changeReservationStatusById = async (id: number, status: string): Promise<number> => {
  try {
    const response = await axios.put(`${BASE_URL}/${id}?Status=${status}`);
    if (response.status === 204) {
      M.toast({ html: "The reservation was updated successfully", classes: "green" });
      return response.status;
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      console.error("Error: reservation not found", error);
      M.toast({
        html: "reservation not found",
        classes: "red",
      });
      return error.response?.status;
    } else if (axios.isAxiosError(error) && error.response?.status === 400) {
      console.error("Axios error:", error.message);
      M.toast({
        html: `Failed to update reservation: ${error.message}`,
        classes: "red",
      });
      return error.response?.status;
    } else {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      console.error("Error updating reservation:", errorMessage);
      M.toast({
        html: `Failed to update reservation: ${errorMessage}`,
        classes: "red",
      });
      return 400;
    }
  }
  return -1;
};

