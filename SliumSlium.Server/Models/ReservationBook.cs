using System.ComponentModel.DataAnnotations;

namespace LibraryReservationApp.Models
{
    public class ReservationBook
    {
        public int ReservationId { get; set; }
        public Reservation? Reservation { get; set; }
        public int BookId { get; set; }
        public Book? Book { get; set; }
    }
}
