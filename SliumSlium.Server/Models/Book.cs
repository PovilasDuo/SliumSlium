using System.Text.Json.Serialization;

namespace LibraryReservationApp.Models
{
    public class Book
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int Year { get; set; }
        public string Type { get; set; } //"Book" or "Audiobook"
        public string PictureUrl { get; set; }
        [JsonIgnore]
        public ICollection<ReservationBook> ReservationBooks { get; set; } = new List<ReservationBook>();
    }
}
