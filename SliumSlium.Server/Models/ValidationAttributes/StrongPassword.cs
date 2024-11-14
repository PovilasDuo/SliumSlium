using System.ComponentModel.DataAnnotations;
using System.Text.RegularExpressions;

namespace LibraryReservationApp.Models.ValidationAttributes
{
    public class StrongPasswordAttribute : ValidationAttribute
    {
        public StrongPasswordAttribute() : base("Password validation failed.")
        {
        }

        public override bool IsValid(object value)
        {
            if (value is string password)
            {
                if (password.Length < 8)
                {
                    ErrorMessage = "Password must be at least 8 characters long.";
                    return false;
                }

                if (!Regex.IsMatch(password, @"\d"))
                {
                    ErrorMessage = "Password must contain at least one number.";
                    return false;
                }

                return true;
            }

            return false;
        }
    }

}
