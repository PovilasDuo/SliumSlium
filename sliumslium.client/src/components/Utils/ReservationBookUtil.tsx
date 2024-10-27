import { ReservationBookDTO } from "../../models/ReservationBooksDTO";

export const calculateItemPrice = (item: ReservationBookDTO) => {
    let price = (item.book.type === "Audiobook" ? 3 : 2) * item.days;
    if (item.days > 10) {
      price *= 0.8;
    } else if (item.days > 3) {
      price *= 0.9;
    }
    price += item.quickPickUp ? 5 : 0;
    return price;
  };