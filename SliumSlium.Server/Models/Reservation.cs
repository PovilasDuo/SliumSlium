namespace LibraryReservationApp.Models
{
    public class Reservation
    {
        public int Id { get; set; }
        public required string Status { get; set; }
        public DateTime ReservedAt { get; set; } = DateTime.UtcNow;
        public int? PaymentId { get; set; }
        public Payment? Payment { get; set; }
        public ICollection<ReservationBook> ReservationBooks { get; set; } = new List<ReservationBook>();
        public required int UserId { get; set; }
        public User? User { get; set; }
    }
}
