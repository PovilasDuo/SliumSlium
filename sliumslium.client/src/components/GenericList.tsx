import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { BookDTO } from "../models/BookDTO";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faArrowRight,
  faPaperPlane,
} from "@fortawesome/free-solid-svg-icons";
import M from "materialize-css";
import { useNavigate } from "react-router-dom";
import { ReservationBooksPostDTO } from "../models/ReservationBooksPostDTO";
import { calculateItemPrice } from "./Utils/ReservationBookUtil";

const ITEMS_PER_PAGE = 10;

interface BookListProps {
  books: BookDTO[];
  header: string;
}

const BookList: React.FC<BookListProps> = ({ books, header }) => {
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [cart, setCart] = useState<ReservationBooksPostDTO[]>(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent, book: BookDTO) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const days = formData.get("days") as unknown as number;
    const quickPickUp = formData.get("quickPickup") === "on";

    if (!days || days <= 0) {
      M.toast({ html: "Please enter a valid number of days greater than 0." });
      return;
    }

    const bookExistsInCart = cart.some(
      (cartItem) => cartItem.book.id === book.id
    );
    if (bookExistsInCart) {
      M.toast({ html: `This book is already in your cart.`, classes: "red" });
      return;
    }

    const newCartItem: ReservationBooksPostDTO = {
      book,
      days,
      quickPickUp,
      price: 0,
    };
    newCartItem.price = calculateItemPrice(newCartItem);

    const updatedCart = [...cart, newCartItem];
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));

    const uniqueToastId = `go-to-cart-${newCartItem.book.id}`;
    const toastHTML = `
        <span>Book added to the cart!</span>
        <button id="${uniqueToastId}" class="btn-flat toast-action">Go to cart</button>
    `;
    M.toast({ html: toastHTML });

    setTimeout(() => {
      const toastButton = document.getElementById(uniqueToastId);
      if (toastButton) {
        toastButton.addEventListener("click", handleToastClick);
      }
    }, 0);

    const modalId = `#modal${book.id}`;
    const modal = document.querySelector(modalId);

    if (modal) {
      const instance = M.Modal.getInstance(modal);
      if (instance) {
        instance.close();
      }
    }
  };

  const handleToastClick = () => {
    navigate("/cart");
    M.Toast.dismissAll();
  };

  useEffect(() => {
    if (books.length === 0) {
      setError("No books found");
    } else {
      setError(null);
    }

    const modals = document.querySelectorAll(".modal");
    M.Modal.init(modals);
  }, [books, currentPage]);

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
                <button
                  className="btn modal-trigger btn-modal-trigger"
                  onClick={() => {
                    const modalId = `#modal${book.id}`;
                    const modal = document.querySelector(modalId);
                    if (modal) {
                      const instance = M.Modal.getInstance(modal);
                      if (instance) {
                        instance.open();
                      } else {
                        const modals = document.querySelectorAll(".modal");
                        M.Modal.init(modals);
                        console.log("Modal could not be found");
                      }
                    }
                  }}
                >
                  Order
                </button>
                {createPortal(
                  <div id={`modal${book.id}`} className="modal box">
                    <div style={{ display: "flex", alignItems: "stretch" }}>
                      <img
                        src={`https://localhost:7091/${book.pictureUrl}`}
                        alt={book.name}
                        style={{
                          width: "30%",
                          height: "auto",
                          objectFit: "cover",
                        }}
                      />

                      <div
                        className="row"
                        style={{ flex: "30%", paddingLeft: "40px" }}
                      >
                        <form
                          className="col s12"
                          onSubmit={(e) => handleSubmit(e, book)}
                        >
                          <h5>
                            <b>Book Information</b>
                          </h5>
                          <h5>Title: {book.name}</h5>
                          <p>
                            <strong>Year:</strong> {book.year}
                          </p>
                          <p>
                            <strong>Type:</strong> {book.type}
                          </p>

                          <h5 style={{ paddingTop: "40px" }}>
                            <b>Order Information</b>
                          </h5>
                          <div className="row">
                            <div className="input-field col s12">
                              <label>
                                <input
                                  type="checkbox"
                                  name="quickPickup"
                                  id="quickPickup"
                                />
                                <span>Quick pick up? €5</span>
                              </label>
                            </div>

                            <div className="input-field col s12">
                              <label>
                                <input
                                  type="number"
                                  min="0"
                                  className="validate"
                                  name="days"
                                  id="days"
                                  required
                                />
                                <span
                                  className="helper-text"
                                  data-error="Not a valid number"
                                  data-success="Number of days (Book (€2/day), Audiobook (€3/day))"
                                >
                                  Number of days (Book (€2/day), Audiobook
                                  (€3/day))
                                </span>
                              </label>
                            </div>

                            <div
                              className="input-field col s12"
                              style={{ marginTop: "80px" }}
                            >
                              <button
                                className="btn waves-effect waves-light"
                                type="submit"
                                name="action"
                              >
                                Add to Cart &nbsp;
                                <FontAwesomeIcon icon={faPaperPlane} />
                              </button>
                            </div>
                            <h5>
                              <p>
                                <i> {"Be sure to use our discount!"}</i>
                              </p>
                            </h5>

                            <p>{" More than 3 days – 10% off"}</p>
                            <h6>
                              <p>{" More than 10 days – 20% off"}</p>
                            </h6>
                          </div>
                        </form>
                      </div>

                      <div style={{ padding: "20px" }}>
                        <a
                          href="#!"
                          className="modal-close btn btn-floating btn-large waves-effect waves-light"
                        >
                          x
                        </a>
                      </div>
                    </div>
                  </div>,
                  document.body
                )}
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
