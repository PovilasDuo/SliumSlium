import { useEffect, useState } from "react";
import { fetchBooks } from "../services/BookService";
import { BookDTO } from "../models/BookDTO";
import GenericList from "./GenericList";

export default function AllBooks() {
  const [books, setBooks] = useState<BookDTO[]>([]);

  useEffect(() => {
    const getBooks = async () => {
      try {
        const fetchedBooks = await fetchBooks();
        setBooks(fetchedBooks);
      } catch (err) {
        console.log(err);
      }
    };

    getBooks();
  }, []);

  return <GenericList books={books} header="All books in the library" />;
}
