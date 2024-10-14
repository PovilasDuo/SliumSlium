import React, { useState, useEffect } from "react";
import { ReservationDTO } from "../models/ReservationDTO";
import { BookDTO } from "../models/BookDTO";
import { fetchBooks } from "../services/BookService";
import { fetchReservations } from "../services/ReservationService";

const Account: React.FC = () => {
  const [reservations, setReservations] = useState<ReservationDTO[]>([]);
  const [books, setBooks] = useState<BookDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [bookData, reservationData] = await Promise.all([
          fetchBooks(),
          fetchReservations(),
        ]);
        setBooks(bookData);
        setReservations(reservationData);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const findBook = (bookId: number): BookDTO | undefined => {
    return books.find((book) => book.id === bookId);
  };

  if (loading) {
    return (
      <div className="container center-align">
        <h3>Loading reservations...</h3>
      </div>
    );
  }

  return (
    <div className="container center-align">
      <h1>My book reservations</h1>
      {reservations.length === 0 ? (
        <div className="container center-align">
          <h5>No reservations found :(</h5>
        </div>
      ) : (
        <div>
          <ul>
            {reservations.map((reservation) => (
              <li key={reservation.id} className="reservation-item">
                <h5>Reservation number: {reservation.id}</h5>
                <p>
                  <i>
                    {" "}
                    Reserved at:{" "}
                    {new Date(reservation.reservedAt).toLocaleDateString()}
                  </i>
                </p>
                <h4>
                  <p>
                    Total amount: <b>€{reservation.totalAmount.toFixed(2)}</b>
                  </p>
                </h4>

                <ul className="book-list-row">
                  {reservation.reservationBooks.map((reservedBook) => {
                    const book = findBook(reservedBook.bookId);
                    return (
                      <li key={reservedBook.bookId} className="book-item">
                        {book ? (
                          <div className="book-card">
                            <img
                              src={`https://localhost:7091/${book.pictureUrl}`}
                              alt={book.name}
                              className="book-item-image"
                            />
                            <div className="book-details">
                              <h3 className="book-title">{book.name}</h3>
                              <p className="book-year">Year: {book.year}</p>
                              <p className="book-type">Type: {book.type}</p>
                              <p className="book-days">
                                Days Reserved: {reservedBook.days}
                              </p>
                              <p className="book-pickup">
                                Quick Pickup:{" "}
                                {reservedBook.quickPickUp ? "Yes" : "No"}
                              </p>
                            </div>
                          </div>
                        ) : (
                          <p>Book ID: {reservedBook.bookId}</p>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Account;
