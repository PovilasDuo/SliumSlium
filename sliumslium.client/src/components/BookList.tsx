import React, { useEffect, useState } from "react";
import { BookDTO } from "../models/BookDTO";
import { fetchBooks } from "../services/BookService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";

const itemsPerPage = 10; // Set the number of items you want to display per page

const BookList: React.FC = () => {
  const [books, setBooks] = useState<BookDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const getBooks = async () => {
      try {
        const fetchedBooks = await fetchBooks();
        setBooks(fetchedBooks);
      } catch (err) {
        console.log(err);
        setError("Failed to fetch books");
      } finally {
        setLoading(false);
      }
    };

    getBooks();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  // Calculate the current books to display
  const indexOfLastBook = currentPage * itemsPerPage;
  const indexOfFirstBook = indexOfLastBook - itemsPerPage;
  const currentBooks = books.slice(indexOfFirstBook, indexOfLastBook);

  // Calculate total pages
  const totalPages = Math.ceil(books.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="book-list-container">
      {currentBooks.length === 0 ? (
        <p>No books available.</p>
      ) : (
        <ul className="book-list">
          {currentBooks.map((book) => (
            <li key={book.id} className="book-item">
              <img
                src={`https://localhost:7091/${book.pictureUrl}`}
                alt={book.name}
              />
              <h3 className="book-title">{book.name}</h3>
              <p className="book-year">Year: {book.year}</p>
              <p className="book-type">Type: {book.type}</p>
              <p className="BookOrder">Click to order</p>
            </li>
          ))}
        </ul>
      )}

      <div className="pagination-container">
        <ul className="pagination">
          <li className={currentPage === 1 ? "disabled" : ""}>
            <a href="#!" onClick={() => handlePageChange(currentPage - 1)}>
              <FontAwesomeIcon icon={faArrowLeft} />
            </a>
          </li>

          {[...Array(totalPages)].map((_, index) => (
            <li key={index + 1} className={currentPage === index + 1 ? "active" : ""}>
              <a href="#!" onClick={() => handlePageChange(index + 1)}>
                {index + 1}
              </a>
            </li>
          ))}

          <li className={currentPage === totalPages ? "disabled" : ""}>
            <a href="#!" onClick={() => handlePageChange(currentPage + 1)}>
              <FontAwesomeIcon icon={faArrowRight} />
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default BookList;
