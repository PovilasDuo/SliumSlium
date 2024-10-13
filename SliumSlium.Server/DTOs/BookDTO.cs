using System.ComponentModel.DataAnnotations;

public class BookDTO
{
    public int Id { get; set; }
    [StringLength(100, ErrorMessage = "Name cannot be longer than 100 characters.")]
    public string Name { get; set; }
    [Range(0, 2024, ErrorMessage = "Year must be between 0 and 2024.")]
    public int Year { get; set; }
    public string Type { get; set; }
    public string PictureUrl { get; set; }
}
