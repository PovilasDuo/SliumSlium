namespace LibraryReservationApp.Models
{
    public class Reservation
    {
        public int Id { get; set; }
        public decimal TotalAmount { get; set; }
        public DateTime ReservedAt { get; set; } = DateTime.UtcNow;
        public ICollection<ReservationBook> ReservationBooks { get; set; } = new List<ReservationBook>();
    }
}
