using LibraryReservationApp.Models.ValidationAttributes;
using System.ComponentModel.DataAnnotations;

namespace LibraryReservationApp.Models.Auth
{
    public class SignUpModel
    {
        [Required]
        public string Name { get; set; } = null!;

        [Required]
        public string Email { get; set; } = null!;

        [Required]
        [StrongPassword]
        public string Password { get; set; } = null!;

        [Required]
        public int Role { get; set; } = 0;
    }
}
