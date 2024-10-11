using System.ComponentModel.DataAnnotations;

public class BookDTO
{
    [Required]
    public int Id { get; set; }

    [Required(ErrorMessage = "Name is required.")]
    [StringLength(100, ErrorMessage = "Name cannot be longer than 100 characters.")]
    public string Name { get; set; }

    [Required(ErrorMessage = "Year is required.")]
    [Range(1500, 2100, ErrorMessage = "Year must be between 1500 and 2100.")]
    public int Year { get; set; }

    [Required(ErrorMessage = "Type is required.")]
    [StringLength(50, ErrorMessage = "Type cannot be longer than 50 characters.")]
    public string Type { get; set; }

    [Url(ErrorMessage = "Invalid Picture URL format.")]
    public string PictureUrl { get; set; }
}
