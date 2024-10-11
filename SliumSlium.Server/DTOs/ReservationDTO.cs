using System.ComponentModel.DataAnnotations;

public class ReservationDTO
{
    [Required]
    public int Id { get; set; }

    [Required(ErrorMessage = "Reservation type is required.")]
    [StringLength(50, ErrorMessage = "Reservation type cannot be longer than 50 characters.")]
    public string ReservationType { get; set; }

    [Required(ErrorMessage = "Quick pickup option is required.")]
    public bool QuickPickUp { get; set; }

    [Required(ErrorMessage = "Days is required.")]
    [Range(1, 30, ErrorMessage = "Days must be between 1 and 30.")]
    public int Days { get; set; }

    [Required(ErrorMessage = "Total amount is required.")]
    [Range(0, double.MaxValue, ErrorMessage = "Total amount must be a positive value.")]
    public decimal TotalAmount { get; set; }

    [Required(ErrorMessage = "Reservation date is required.")]
    public DateTime ReservedAt { get; set; }

    [Required]
    public List<BookDTO> Books { get; set; } = new List<BookDTO>();
}
