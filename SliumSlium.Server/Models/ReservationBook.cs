using System.ComponentModel.DataAnnotations;

namespace LibraryReservationApp.Models
{
    public class ReservationBook
    {
        [Required]
        public int ReservationId { get; set; }
        public Reservation? Reservation { get; set; }

        [Required]
        public int BookId { get; set; }
        public Book? Book { get; set; }
    }
}
