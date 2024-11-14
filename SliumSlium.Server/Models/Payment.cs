using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace LibraryReservationApp.Models
{
    public class Payment
    {
        public int Id { get; set; }
        [Required(ErrorMessage = "Amount is required.")]
        [Range(0.01, double.MaxValue, ErrorMessage = "Amount must be greater than zero.")]
        public required double Amount { get; set; }
        [Required(ErrorMessage = "Payment date is required.")]
        public required DateTime PaymentDate { get; set; } = DateTime.UtcNow;
        [Required(ErrorMessage = "Reservation ID is required.")]
        public required int ReservationId { get; set; }
        [JsonIgnore]
        public Reservation? Reservation { get; set; }
    }
}
