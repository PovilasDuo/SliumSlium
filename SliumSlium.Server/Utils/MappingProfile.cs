using AutoMapper;
using LibraryReservationApp.Models;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<Reservation, Reservation_PostDTO>();
        CreateMap<Reservation_PostDTO, Reservation>();
        CreateMap<ReservationBook_PostDTO, ReservationBook>();
        CreateMap<ReservationBook, ReservationBook_PostDTO>();
        CreateMap<Payment, Payment_PostDTO>();
        CreateMap<Payment_PostDTO, Payment>();
        CreateMap<Book, Book_PostDTO>();
        CreateMap<Book_PostDTO, Book>();
    }
}
