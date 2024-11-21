using System.ComponentModel.DataAnnotations;
using System.Text.RegularExpressions;

namespace LibraryReservationApp.Models.ValidationAttributes
{
    public class StrongPasswordAttribute : ValidationAttribute
    {
        private const int MinimumLength = 8;

        public StrongPasswordAttribute() : base("Password validation failed.")
        {
        }

        public override bool IsValid(object value)
        {
            if (value is not string password)
            {
                ErrorMessage = "Invalid password format.";
                return false;
            }

            if (password.Length < MinimumLength)
            {
                ErrorMessage = $"Password must be at least {MinimumLength} characters long.";
                return false;
            }

            if (!Regex.IsMatch(password, @"\d"))
            {
                ErrorMessage = "Password must contain at least one number.";
                return false;
            }

            if (!Regex.IsMatch(password, @"[A-Z]"))
            {
                ErrorMessage = "Password must contain at least one uppercase letter.";
                return false;
            }

            if (!Regex.IsMatch(password, @"[a-z]"))
            {
                ErrorMessage = "Password must contain at least one lowercase letter.";
                return false;
            }
            return true;
        }
    }

}
