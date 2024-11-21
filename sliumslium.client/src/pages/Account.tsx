import React, { useState, useEffect } from "react";
import M from "materialize-css";
import { ReservationDTO } from "../models/ReservationDTO";
import {
  changeReservationStatusById,
  deleteReservationById,
  fetchReservations,
  getUserReservations,
} from "../services/ReservationService";
import { faPlus, faMinus, faX, faPen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  extendReservationDayByOne,
  returnBookBack,
} from "../services/BookReservationService";
import { useAuth } from "../components/Utils/AuthContext";

const Account: React.FC = () => {
  const [reservations, setReservations] = useState<ReservationDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReservationId, setSelectedReservationId] = useState<
    number | null
  >(null);
  const [newStatus, setNewStatus] = useState<string>("");
  const { user, hasRole } = useAuth();
  const isAdmin = hasRole("admin");

  useEffect(() => {
    loadData();
    const modalElem = document.getElementById("status-modal");
    if (modalElem) {
      M.Modal.init(modalElem);
    }
  }, []);

  useEffect(() => {
    const selectElem = document.querySelectorAll("select");
    M.FormSelect.init(selectElem);
  }, [selectedReservationId]);

  const loadData = async () => {
    try {
      let reservationData = null;
      if (isAdmin) {
        reservationData = await fetchReservations();
      } else reservationData = await getUserReservations(user!.id);
      setReservations(reservationData);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  async function extendReservation(bookId: number): Promise<void> {
    await extendReservationDayByOne(bookId);
    loadData();
  }

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

  async function deleteReservation(reservationId: number): Promise<void> {
    await deleteReservationById(reservationId);
    loadData();
  }

  const openStatusModal = (id: number) => {
    setSelectedReservationId(id);
    const modal = document.getElementById("status-modal");
    if (modal) {
      const instance = M.Modal.getInstance(modal) || M.Modal.init(modal);
      instance.open();
    }
  };

  const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setNewStatus(event.target.value);
  };

  const confirmStatusChange = async () => {
    if (selectedReservationId && newStatus) {
      await changeReservationStatusById(selectedReservationId, newStatus);
      loadData();
    }
    setNewStatus("");
    setSelectedReservationId(null);
  };

  return (
    <div className="container center-align">
      {!isAdmin ? <h1>My book reservations</h1> : <h1>All reservations</h1>}

      {reservations.length === 0 ? (
        <div className="container center-align">
          <h5>No reservations found :(</h5>
        </div>
      ) : !user ? (
        <div>Log in to make a new reservation</div>
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
                <h5>
                  <p>
                    Status: <i>{reservation.status}</i> &nbsp;
                    {isAdmin && (
                      <button
                        className="btn-floating btn-large waves-effect waves-light green"
                        onClick={() => openStatusModal(reservation.id)}
                      >
                        <FontAwesomeIcon icon={faPen} />
                      </button>
                    )}
                  </p>
                </h5>

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
                            <button
                              className="btn-large waves-effect waves-light"
                              onClick={() => extendReservation(reservedBook.id)}
                            >
                              Extend: <FontAwesomeIcon icon={faPlus} />
                            </button>
                          </p>

                          {isAdmin && (
                            <p>
                              <button
                                className="btn-large waves-effect waves-light red"
                                onClick={() => returnBook(reservedBook.id)}
                              >
                                Return: <FontAwesomeIcon icon={faMinus} />
                              </button>
                            </p>
                          )}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
                {isAdmin && (
                  <p>
                    <button
                      className="btn-large waves-effect red"
                      onClick={() => deleteReservation(reservation.id)}
                    >
                      Cancel: <FontAwesomeIcon icon={faX} />
                    </button>
                  </p>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div id="status-modal" className="modal">
        <div className="modal-content">
          <h4>Change Reservation Status</h4>
          <p>Select the new status for your reservation.</p>
          <div className="input-field">
            <select value={newStatus} onChange={handleStatusChange}>
              <option value="" disabled>
                Choose a new status
              </option>
              <option value="In-progress">In-progress</option>
              <option value="Ready">Ready for pick up</option>
              <option value="Ongoing">Ongoing</option>
            </select>
          </div>
        </div>
        <div className="modal-footer">
          <button
            className="modal-close waves-effect waves-green btn-flat"
            onClick={confirmStatusChange}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default Account;
