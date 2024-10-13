using System.ComponentModel.DataAnnotations;

public class ReservationDTO
{
    public int Id { get; set; }
    public string ReservationType { get; set; }

    public bool QuickPickUp { get; set; }

    [Range(1, 100, ErrorMessage = "Days must be between 1 and 100.")]
    public int Days { get; set; }

    [Range(0, double.MaxValue, ErrorMessage = "Total amount must be a positive value.")]
    public decimal TotalAmount { get; set; }
    public DateTime ReservedAt { get; set; }

    public List<BookDTO> Books { get; set; } = new List<BookDTO>();
}
