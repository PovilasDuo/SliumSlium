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
      M.toast({ html: "Failed to fetch books", classes: "red" });
    } else {
      console.error("Unexpected error:", error);
      M.toast({ html: "An unexpected error occurred", classes: "red" });
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
    if (axios.isAxiosError(error) && error.response?.status === 409) {
      console.error("Validation error:", error);
      M.toast({
        html: "Such book already exists",
        classes: "red",
      });
    } else if (axios.isAxiosError(error) && error.response?.status === 400) {
      const errorMessage = error.response.data?.message || "Invalid book data";
      console.error("Validation error:", errorMessage);
      M.toast({
        html: `Failed to create book: ${errorMessage}`,
        classes: "red",
      });
    } else {
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

export const deleteBook = async (id: number): Promise<number> => {
  const url = `https://localhost:7091/api/Books/${id}`;

  try {
    const response = await axios.delete(url);
    if (response.status === 204) {
      M.toast({ html: "Book was deleted successfully", classes: "green" });
      return response.status;
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      console.error("Error: Book not found", error);
      M.toast({
        html: "Book not found",
        classes: "red",
      });
      return error.response?.status;
    } else if (axios.isAxiosError(error) && error.response?.status === 400) {
      console.error("Axios error:", error.message);
      M.toast({
        html: `Failed to delete book: ${error.response.data}`,
        classes: "red",
      });
      return error.response?.status;
    } else {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      console.error("Error deleting book:", errorMessage);
      M.toast({
        html: `Failed to delete book: ${errorMessage}`,
        classes: "red",
      });
      return 400;
    }
  }
  return -1;
};

export const getBookById = async (id: number): Promise<BookDTO> => {
  const url = `https://localhost:7091/api/Books/${id}`;
  try {
    const response = await axios.get<BookDTO>(url);
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

export const updateBook = async (book: BookDTO): Promise<void> => {
  const url = `https://localhost:7091/api/Books/${book.id}`;

  try {
    const response = await axios.put(url, book);
    if (response.status === 200) {
      M.toast({ html: "Book was updated successfully", classes: "green" });
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 400) {
      const errorMessage = error.response.data?.message || "Invalid book data";
      console.error("Validation error:", errorMessage);
      M.toast({
        html: `Failed to update book: ${errorMessage}`,
        classes: "red",
      });
    } else {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      console.error("Error updating book:", errorMessage);
      M.toast({
        html: `Failed to update book: ${errorMessage}`,
        classes: "red",
      });
    }
  }
};
