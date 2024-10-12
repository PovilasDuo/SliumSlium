import axios from "axios";
import { BookDTO } from "../models/BookDTO";

export const fetchBooks = async (
  url: string = "https://localhost:7091/api/Books"
): Promise<BookDTO[]> => {
  try {
    const response = await axios.get<BookDTO[]>(`${url}`);
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
