using LibraryReservationApp.Models;

namespace LibraryReservationApp.Utils
{
    public class ReservationBookUtil
    {
        public static double CalculateReservationBookPrice(Book book, int days, bool quickPickUp)
        {
            double pricePerDay = book.Type.Equals("Audiobook", StringComparison.OrdinalIgnoreCase) ? 3 : 2;
            double reservationSum = pricePerDay * days;

            if (days > 10)
            {
                reservationSum *= 0.80;
            }
            else if (days > 3)
            {
                reservationSum *= 0.90;
            }

            if (quickPickUp)
            {
                reservationSum += 5;
            }

            return reservationSum;
        }

        public static double CalculateTotalAmount(List<ReservationBook> reservationBooks)
        {
            double total = reservationBooks.Sum(rb => rb.Price); 
            total += 3; 
            return total;
        }
    }
}
