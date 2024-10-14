import axios from "axios";
import { Book } from "../models/Book";

export const fetchBooks = async (
  url: string = "https://localhost:7091/api/Books"
): Promise<Book[]> => {
  try {
    const response = await axios.get<Book[]>(`${url}`);
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
