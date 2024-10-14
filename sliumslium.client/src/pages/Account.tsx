import React, { useState, useEffect } from "react";
import axios from "axios";
import { BookDTO } from "../models/BookDTO";
import { ReservationDTO } from "../models/ReservationDTO";

const Account: React.FC = () => {
  const [reservations, setReservations] = useState<ReservationDTO[]>([]);
  const [books, setBooks] = useState<BookDTO[]>([]);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await axios.get<ReservationDTO[]>("/api/Reservations");
        setReservations(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching reservations:", error);
      }
    };

    const fetchBooks = async () => {
      try {
        const response = await axios.get<BookDTO[]>("/api/Books");
        setBooks(response.data);
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };

    fetchReservations();
    fetchBooks();
  }, []);

  const findBook = (bookId: number): BookDTO | undefined => {
    return books.find((book) => book.id === bookId);
  };

  return (
    <div>
      <h1>My Book Reservations</h1>
      {reservations.length === 0 ? (
        <p>No reservations found.</p>
      ) : (
        <div>
          {reservations.map((reservation) => (
            <div key={reservation.id} className="reservation-card">
              <h2>Reservation ID: {reservation.id}</h2>
              <p>Quick Pickup: {reservation.quickPickUp ? "Yes" : "No"}</p>
              <p>Total Amount: ${reservation.totalAmount.toFixed(2)}</p>
              <p>
                Reserved At:{" "}
                {new Date(reservation.reservedAt).toLocaleDateString()}
              </p>

              <h3>Books Reserved:</h3>
              <ul>
                {reservation.reservationBooks.map((reservedBook) => {
                  const book = findBook(reservedBook.bookId);
                  return (
                    <li key={reservedBook.bookId}>
                      {book ? (
                        <div className="book-card">
                          <img
                            src={book.pictureUrl}
                            alt={book.name}
                            width="50"
                          />
                          <p>
                            <strong>{book.name}</strong> ({book.year}) -{" "}
                            {book.type}
                          </p>
                          <p>Days Reserved: {reservedBook.days}</p>
                        </div>
                      ) : (
                        <p>Book ID: {reservedBook.bookId}</p>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Account;
