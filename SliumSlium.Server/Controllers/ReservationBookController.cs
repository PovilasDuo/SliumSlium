using LibraryReservationApp.Data;
using LibraryReservationApp.Models;
using LibraryReservationApp.Utils;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LibraryReservationApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReservationBookController : ControllerBase
    {
        const int dayIncrease = 1;

        private readonly LibraryContext _context;

        public ReservationBookController(LibraryContext context)
        {
            _context = context;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ReservationBook>> GetReservationBook(int id)
        {
            var reservationBook = await _context.ReservationBooks
                .Include(r => r.Reservation)
                .Include(r => r.Book)
                .FirstOrDefaultAsync(r => r.Id == id);

            if (reservationBook == null)
            {
                return NotFound();
            }

            return Ok(reservationBook);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> IncreaseReservationDays(int id)
        {
            var reservationBook = await _context.ReservationBooks
                .Include(r => r.Reservation)
                .Include(r => r.Book)
                .FirstOrDefaultAsync(r => r.Id == id);

            if (reservationBook == null)
            {
                return NotFound(new { message = "Reservation book was not found" });
            }
            reservationBook.Days += dayIncrease;
            reservationBook.Price = ReservationBookUtil.CalculateReservationBookPrice(reservationBook.Book, reservationBook.Days, reservationBook.QuickPickUp);

            var reservation = await _context.Reservations
                .Include(r => r.ReservationBooks)
    .           FirstOrDefaultAsync(r => r.Id == reservationBook.Reservation.Id);

            if (reservation != null)
            {
                var payment = await _context.Payments
                    .Where(r => r.ReservationId == reservation.Id)
                    .FirstOrDefaultAsync();

                if (payment != null)
                {
                    payment.Amount = ReservationBookUtil.CalculateTotalAmount(reservation.ReservationBooks.ToList());
                    Console.WriteLine(payment.Amount);
                }
            }

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Books.Any(e => e.Id == id))
                {
                    return NotFound();
                }
                else
                {
                    throw new Exception("Error occured updating the reservation book");
                }
            }

            return Ok(new { message = "Reservation book was updated successfully", reservationBook });
        }
    }
}
