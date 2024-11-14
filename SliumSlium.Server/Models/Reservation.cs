using System.ComponentModel.DataAnnotations;

namespace LibraryReservationApp.Models
{
    public class Reservation : IValidatableObject
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "Status is required.")]
        [StringLength(50, ErrorMessage = "Status cannot exceed 50 characters.")]
        public string Status { get; set; } = "Ongoing";

        [Required(ErrorMessage = "Reservation date is required.")]
        public required DateTime ReservedAt { get; set; } = DateTime.UtcNow;

        [Required(ErrorMessage = "Payment ID is required.")]
        public int PaymentId { get; set; }

        public Payment? Payment { get; set; }

        [Required(ErrorMessage = "At least one reservation book is required.")]
        public ICollection<ReservationBook> ReservationBooks { get; set; } = new List<ReservationBook>();

        [Required(ErrorMessage = "User ID is required.")]
        public required int UserId { get; set; }

        public User? User { get; set; }

        public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
        {
            var validStatuses = new[] { "Ongoing", "In progress", "Ready for pick up" };
            if (!validStatuses.Contains(Status))
            {
                yield return new ValidationResult($"Status must be one of the following values: {string.Join(", ", validStatuses)}", new[] { nameof(Status) });
            }
        }
    }
}
