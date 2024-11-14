namespace LibraryReservationApp.Models
{
    public class Reservation_PostDTO
    {
        public DateTime ReservedAt { get; set; } = DateTime.UtcNow;
        public int PaymentId { get; set; }
        public Payment? Payment { get; set; }
        public ICollection<ReservationBook_PostDTO> ReservationBooks { get; set; } = new List<ReservationBook_PostDTO>();
        public required int UserId { get; set; }
        public User? User { get; set; }
    }
}
