import React, { useEffect, useState } from "react";
import { ReservationDTO } from "../models/ReservationDTO";
import { ReservationBookDTO } from "../models/ReservationBooksDTO";
import { PaymentDTO } from "../models/PaymentDTO";
import { calculateItemPrice } from "../components/Utils/ReservationBookUtil";

const CartPage: React.FC = () => {
  const [cartItems, setCartItems] = useState<ReservationBookDTO[]>([]);
  const [totalAmount, setTotalAmount] = useState<number>(0);

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      const parsedCart = JSON.parse(savedCart);
      setCartItems(parsedCart);
      calculateTotal(parsedCart);
    }
  }, []);

  const calculateTotal = (items: ReservationBookDTO[]) => {
    let total = 0;

    items.forEach((item) => {
      const itemPrice = calculateItemPrice(item);
      total += itemPrice;
    });

    total += 3; 
    setTotalAmount(parseFloat(total.toFixed(2)));
  };

  const handleRemoveItem = (bookId: number) => {
    const updatedCart = cartItems.filter((item) => item.book.id !== bookId);
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    calculateTotal(updatedCart);
  };

  const handleCheckout = () => {
    const payment: PaymentDTO = {
      id: 0, // Ensure this is set to the correct initial value
      amount: totalAmount,
      paymentDate: new Date(),
      reservationId: 0, // Set to 0 if a new reservation
    };
  
    const reservation: ReservationDTO = {
      id: 0, // Ensure this is set to the correct initial value
      reservedAt: new Date(),
      paymentId: 0, // Set to 0 for new reservation
      payment: payment,
      reservationBooks: cartItems.map((item) => ({
        id: 0, // Set to 0 for new reservation books
        reservationId: 0, // Set to 0 for new reservation books
        bookId: item.book.id,
        book: {
          id: item.book.id,
          name: item.book.name,
          year: item.book.year,
          type: item.book.type,
          pictureUrl: item.book.pictureUrl,
        },
        days: item.days,
        quickPickUp: item.quickPickUp,
        price: item.price, // Ensure this is a number
      })),
    };
  
    // Log the reservation object for debugging
    console.log("Payload being sent:", JSON.stringify(reservation, null, 2)); 
  
    fetch("https://localhost:7091/api/Reservations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reservation), // Send as a single object
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((errorData) => {
            if (response.status === 400) {
              const errorMessage =
                errorData.message || "Invalid reservation data.";
              throw new Error(errorMessage);
            } else {
              throw new Error(
                `Error: ${response.status} ${response.statusText}`
              );
            }
          });
        }
        return response.json();
      })
      .then((data) => {
        M.toast({
          html: `Reservation completed! Total Amount: €${reservation.payment.amount}`,
          classes: "green",
        });
        localStorage.removeItem("cart");
        setCartItems([]);
        setTotalAmount(0);
      })
      .catch((error) => {
        console.error("Error creating reservation:", error);
        M.toast({
          html: `Failed to complete the reservation: ${error.message}`,
          classes: "red",
        });
      });
  };
  
  
  

  if (cartItems.length === 0) {
    return (
      <div className="container center-align">
        <h3>Your cart is empty :(</h3>
      </div>
    );
  }

  return (
    <div className="center-align">
      <h2>Your cart</h2>
      <ul className="book-list">
        {cartItems.map((item) => (
          <li key={item.book.id} className="book-item">
            <img
              src={`https://localhost:7091/${item.book.pictureUrl}`}
              alt={item.book.name}
              className="book-item-image"
            />
            <h3 className="book-title">{item.book.name}</h3>
            <p className="book-year">Year: {item.book.year}</p>
            <p className="book-type">Type: {item.book.type}</p>
            <p className="book-days">Days: {item.days}</p>
            {item.quickPickUp ? (
              <>
                {item.days > 3 ? (
                  <p className="book-days">
                    Regular price: €{" "}
                    {item.days * (item.book.type === "Book" ? 2 : 3)}
                  </p>
                ) : (
                  <p className="book-days">
                    Regular price: € {(item.price - 5).toFixed(2)}
                  </p>
                )}
                <p>Quick Pick-Up: €5</p>{" "}
                {item.days > 3 ? (
                  <p className="book-days">
                    Total discounted price: € {item.price.toFixed(2)}
                  </p>
                ) : (
                  <p>Total price: € {item.price.toFixed(2)}</p>
                )}
              </>
            ) : (
              <>
                {item.days > 3 && (
                  <p className="book-days">
                    Regular price: €{" "}
                    {item.days * (item.book.type === "Book" ? 2 : 3)}
                  </p>
                )}

                {item.days > 3 ? (
                  <p className="book-days">
                    Total discounted price: € {item.price.toFixed(2)}
                  </p>
                ) : (
                  <p>Total price: € {item.price.toFixed(2)}</p>
                )}
              </>
            )}

            <button
              onClick={() => handleRemoveItem(item.book.id)}
              className="btn-modal-trigger red"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
      <div className="center-align"> </div>
      <h3>Total Amount: €{totalAmount.toFixed(2)} </h3>
      <p>Service fee of €3 is included </p>
      <h6>
        <a
          className="waves-effect waves-light btn-large"
          onClick={handleCheckout}
        >
          Checkout
        </a>
      </h6>
    </div>
  );
};

export default CartPage;
