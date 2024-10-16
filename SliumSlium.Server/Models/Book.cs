namespace LibraryReservationApp.Models
{
    public class Book
    {
        public int Id { get; set; }

        public required string Name { get; set; }

        public int Year { get; set; }

        public required string Type { get; set; } //"Book" or "Audiobook"

        public required string PictureUrl { get; set; }

        public ICollection<ReservationBook> ReservationBooks { get; set; } = new List<ReservationBook>();
    }
}
