using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace LibraryReservationApp.Models
{
    public class ReservationBook
    {
        public required int Id { get; set; }
        [Required(ErrorMessage = "Reservation ID is required.")]
        public required int ReservationId { get; set; }
        [JsonIgnore]
        public Reservation? Reservation { get; set; }
        [Required(ErrorMessage = "Book ID is required.")]
        public required int BookId { get; set; }
        public Book? Book { get; set; }
        [Required(ErrorMessage = "Days must be a positive value.")]
        [Range(1, int.MaxValue, ErrorMessage = "Days must be at least 1.")]
        public required int Days { get; set; }
        [Required(ErrorMessage = "QuickPickUp is required.")]
        public required bool QuickPickUp { get; set; }
        [Required(ErrorMessage = "Price is required.")]
        [Range(0.01, double.MaxValue, ErrorMessage = "Price must be a positive value.")]
        public required double Price { get; set; }
    }
}