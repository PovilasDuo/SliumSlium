namespace LibraryReservationApp.Models
{
    public class Reservation
    {
        public int Id { get; set; }

        public string ReservationType { get; set; }

        public bool QuickPickUp { get; set; }

        public int Days { get; set; }

        public decimal TotalAmount { get; set; }

        public DateTime ReservedAt { get; set; } = DateTime.UtcNow;

        public ICollection<ReservationBook> ReservationBooks { get; set; }
    }
}
