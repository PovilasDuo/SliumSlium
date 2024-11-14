using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace LibraryReservationApp.Models
{
    public class Book_PostDTO
    {
        public string Name { get; set; }
        public int Year { get; set; }
        public string Type { get; set; }
        public string PictureUrl { get; set; }
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
