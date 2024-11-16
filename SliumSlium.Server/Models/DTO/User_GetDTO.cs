using System.ComponentModel.DataAnnotations;

namespace LibraryReservationApp.DataTransferObjects
{
    public class User_GetDTO
    {
        public string Name { get; set; }
        public string Email { get; set; }
    }
}
