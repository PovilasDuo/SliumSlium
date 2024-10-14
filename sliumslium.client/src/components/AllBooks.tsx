import React, { useEffect, useState } from "react";
import { fetchBooks } from "../services/BookService";
import { Book } from "../models/Book";
import GenericList from "./GenericList";

export default function AllBooks() {
  const [books, setBooks] = useState<Book[]>([]);

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

  return <GenericList books={books} header="All books in the library"/>;
}
