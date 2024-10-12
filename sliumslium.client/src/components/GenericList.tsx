import React, { useEffect, useState } from "react";
import { BookDTO } from "../models/BookDTO";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";

const ITEMS_PER_PAGE = 10;

interface BookListProps {
  books: BookDTO[];
  header: string;
}

const BookList: React.FC<BookListProps> = ({ books, header }) => {
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (books.length === 0) {
      setError("No books found");
    } else {
      setError(null);
    }
  }, [books]);

  const indexOfLastBook = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstBook = indexOfLastBook - ITEMS_PER_PAGE;
  const currentBooks = books.slice(indexOfFirstBook, indexOfLastBook);
  const totalPages = Math.ceil(books.length / ITEMS_PER_PAGE);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  if (error)
    return (
      <div className="container center-align">
        <h3>{error}</h3>
      </div>
    );

  return (
    <div className="book-list-container">
      <div className="book-list-content">
        <div className="container center-align">
          <h3>{header}</h3>
        </div>
        {currentBooks.length === 0 ? (
          <div className="container center-align">
            <h3>No books found</h3>
          </div>
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
      </div>

      <div className="pagination-container">
        <ul className="pagination">
          <li className={currentPage === 1 ? "disabled" : ""}>
            <a href="#!" onClick={() => handlePageChange(currentPage - 1)}>
              <FontAwesomeIcon icon={faArrowLeft} />
            </a>
          </li>

          {[...Array(totalPages)].map((_, index) => (
            <li
              key={index + 1}
              className={currentPage === index + 1 ? "active" : ""}
            >
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
