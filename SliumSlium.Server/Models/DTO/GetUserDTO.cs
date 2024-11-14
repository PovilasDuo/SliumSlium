using System.ComponentModel.DataAnnotations;

namespace LibraryReservationApp.DataTransferObjects
{
    public class GetUserDTO
    {
        public string Name { get; set; }
        public string Email { get; set; }
    }
}
