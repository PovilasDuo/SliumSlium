using System.Text.Json.Serialization;

namespace LibraryReservationApp.Models
{
    public class User
    {
        public int Id { get; set; }
        public int Type { get; set; }
        public required string Username { get; set; }
        public required string Email { get; set; }
        public required string PasswordHash { get; set; }
        [JsonIgnore]
        public ICollection<Reservation>? Reservations { get; set; } = new List<Reservation>();
    }
}
