using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace LibraryReservationApp.Models
{
    public class Book
    {
        public required int Id { get; set; }
        [Required(ErrorMessage = "Book name is required.")]
        [StringLength(200, ErrorMessage = "Book name cannot exceed 200 characters.")]
        public required string Name { get; set; }
        [Required(ErrorMessage = "Publication year is required.")]
        [Range(0, int.MaxValue, ErrorMessage = "Year must be a valid year after 0.")]
        public required int Year { get; set; }
        [Required(ErrorMessage = "Type is required.")]
        public required string Type { get; set; }
        [Required(ErrorMessage = "Picture URL is required.")]
        public required string PictureUrl { get; set; }
        [JsonIgnore]
        public ICollection<ReservationBook> ReservationBooks { get; set; } = new List<ReservationBook>();

        public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
        {
            var validStatuses = new[] { "Book", "Audiobook" };
            if (!validStatuses.Contains(Type))
            {
                yield return new ValidationResult($"Type must be one of the following values: {string.Join(", ", validStatuses)}", new[] { nameof(Type) });
            }
        }
    }
}
