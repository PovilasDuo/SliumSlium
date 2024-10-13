import React, { useEffect, useState } from "react";
import { BookDTO } from "../models/BookDTO";
import { ReservationDTO } from "../models/ReservationDTO";

interface CartItem {
  book: BookDTO;
  days: number;
  quickPickUp: boolean;
}

const CartPage: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [totalAmount, setTotalAmount] = useState<number>(0);

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      const parsedCart = JSON.parse(savedCart);
      setCartItems(parsedCart);
      calculateTotal(parsedCart);
    }
  }, []);

  const calculateTotal = (items: CartItem[]) => {
    let total = 0;

    items.forEach((item) => {
      const dailyRate = item.book.type === "Audiobook" ? 3 : 2;
      total += dailyRate * item.days;
    });

    if (items.some((item) => item.quickPickUp)) {
      total += 5;
    }

    setTotalAmount(total);
  };

  const handleRemoveItem = (bookId: number) => {
    const updatedCart = cartItems.filter((item) => item.book.id !== bookId);
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    calculateTotal(updatedCart);
  };

  const handleCheckout = () => {
    const reservation: ReservationDTO = {
      ReservationType: "Online",
      QuickPickUp: cartItems.some((item) => item.quickPickUp),
      Days: cartItems.reduce((acc, item) => acc + item.days, 0),
      TotalAmount: totalAmount,
      ReservedAt: new Date(),
      Books: cartItems.map((item) => ({
        id: item.book.id,
        name: item.book.name,
        year: item.book.year,
        type: item.book.type,
        pictureUrl: item.book.pictureUrl,
      })),
    };

    console.log(reservation);
    fetch("https://localhost:7091/api/Reservations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reservation),
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
          html: `Reservation completed! Total Amount: €${data.totalAmount}`,
        });
        localStorage.removeItem("cart");
        setCartItems([]);
        setTotalAmount(0);
      })
      .catch((error) => {
        console.error("Error creating reservation:", error);
        M.toast({
          html: `Failed to complete the reservation: ${error.message}`,
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
    <div className="cart-container center-align">
      <h2>Your Cart</h2>
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
            <p className="book-price">
              Price: €
              {item.book.type === "Audiobook" ? item.days * 3 : item.days * 2}
            </p>
            {item.quickPickUp && <p>Quick Pick-Up: €5</p>}
            <button
              onClick={() => handleRemoveItem(item.book.id)}
              className="btn-modal-trigger red"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
      <div className="cart-container center-align"> </div>
      <h3>Total Amount: €{totalAmount}</h3>
      <button onClick={handleCheckout} className="btn green">
        Checkout
      </button>
    </div>
  );
};

export default CartPage;
