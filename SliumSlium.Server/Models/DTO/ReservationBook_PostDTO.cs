using System.Text.Json.Serialization;

namespace LibraryReservationApp.Models
{
    public class ReservationBook_PostDTO
    {
        public int ReservationId { get; set; }
        [JsonIgnore]
        public Reservation? Reservation { get; set; }
        public int BookId { get; set; }
        public Book? Book { get; set; }
        public int Days { get; set; }
        public bool QuickPickUp { get; set; }
        public double Price { get; set; }
    }
}
