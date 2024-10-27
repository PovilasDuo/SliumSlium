using System.Text.Json.Serialization;

namespace LibraryReservationApp.Models
{
    public class ReservationBook
    {
        public int Id { get; set; }
        public int ReservationId { get; set; }
        [JsonIgnore]
        public Reservation? Reservation { get; set; }
        public int BookId { get; set; }
        public Book? Book { get; set; }
        public int Days { get; set; }
        public bool QuickPickUp { get; set; }
        public double price { get; set; }
    }
}
