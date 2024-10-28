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

export const postBook = async (book: BookDTO, file: File): Promise<void> => {
  const url = "https://localhost:7091/api/Books";

  const formData = new FormData();
  formData.append("book", JSON.stringify(book));
  formData.append("file", file);

  try {
    const response = await axios.post(url, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    if (response.status === 201) {
      M.toast({ html: "Book was created successfully", classes: "green" });
    }
  } catch (error) {
    if(axios.isAxiosError(error) && error.response?.status === 409) {
      console.error("Validation error:", error);
      M.toast({
        html: "Such book already exists",
        classes: "red",
      });
    } 
    else if (axios.isAxiosError(error) && error.response?.status === 400) {
      const errorMessage = error.response.data?.message || "Invalid book data";
      console.error("Validation error:", errorMessage);
      M.toast({
        html: `Failed to create book: ${errorMessage}`,
        classes: "red",
      });
    }
    else {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      console.error("Error creating book:", errorMessage);
      M.toast({
        html: `Failed to create book: ${errorMessage}`,
        classes: "red",
      });
    }
  }
};
