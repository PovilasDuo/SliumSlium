import React, { useState, useEffect } from "react";
import { ReservationDTO } from "../models/ReservationDTO";
import { fetchReservations } from "../services/ReservationService";
import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  extendReservationDayByOne,
  returnBookBack,
} from "../services/BookReservationService";

const Account: React.FC = () => {
  const [reservations, setReservations] = useState<ReservationDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const reservationData = await fetchReservations();
      setReservations(reservationData);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const extendReservation = async (bookId: number) => {
    await extendReservationDayByOne(bookId);
    loadData();
  };

  if (loading) {
    return (
      <div className="container center-align">
        <h3>Loading reservations...</h3>
      </div>
    );
  }

  async function returnBook(bookId: number): Promise<void> {
    await returnBookBack(bookId);
    loadData();
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
                    Reserved at:{" "}
                    {new Date(reservation.reservedAt).toLocaleDateString()}
                  </i>
                </p>
                <h4>
                  <p>
                    Total amount:{" "}
                    <b>€{reservation.payment.amount.toFixed(2)}</b>
                  </p>
                </h4>

                <ul className="book-list-row">
                  {reservation.reservationBooks.map((reservedBook) => (
                    <li key={reservedBook.book.id} className="book-item">
                      <div className="book-card">
                        <img
                          src={`https://localhost:7091/${reservedBook.book.pictureUrl}`}
                          alt={reservedBook.book.name}
                          className="book-item-image"
                        />
                        <div className="book-details">
                          <h3 className="book-title">
                            {reservedBook.book.name}
                          </h3>
                          <p className="book-year">
                            Year: {reservedBook.book.year}
                          </p>
                          <p className="book-type">
                            Type: {reservedBook.book.type}
                          </p>
                          <p className="book-days">
                            Days Reserved: {reservedBook.days}
                          </p>
                          <p className="book-pickup">
                            Quick Pickup:{" "}
                            {reservedBook.quickPickUp ? "Yes" : "No"}
                          </p>
                          <p className="book-days">
                            Price: {reservedBook.price.toFixed(2)}
                          </p>
                          <p>
                            {" "}
                            <button
                              className="btn-large waves-effect waves-light"
                              onClick={() =>
                                extendReservation(reservedBook.book.id)
                              }
                            >
                              Extend: <FontAwesomeIcon icon={faPlus} />
                            </button>
                          </p>
                          <p>
                            <button
                              className="btn-large waves-effect waves-light"
                              onClick={() => returnBook(reservedBook.book.id)}
                            >
                              return: <FontAwesomeIcon icon={faMinus} />
                            </button>
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
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
