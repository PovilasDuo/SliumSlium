using LibraryReservationApp.Models;
using System.Text.Json.Serialization;

public class Payment
{
    public int Id { get; set; }
    public decimal Amount { get; set; }
    public DateTime PaymentDate { get; set; } = DateTime.Now;
    public int ReservationId { get; set; }
    [JsonIgnore]
    public Reservation? Reservation { get; set; }
}
