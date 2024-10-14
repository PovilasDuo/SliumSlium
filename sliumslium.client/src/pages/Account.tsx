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
    return <p>Loading reservations...</p>;
  }

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
                          <p>Quick Pickup: {reservedBook.quickPickUp ? "Yes" : "No"}</p>
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
