using LibraryReservationApp.Data;
using LibraryReservationApp.Models;
using LibraryReservationApp.Utils;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LibraryReservationApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReservationsController : ControllerBase
    {
        private readonly LibraryContext _context;

        public ReservationsController(LibraryContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Reservation>>> GetReservations()
        {
            var reservations = await _context.Reservations
                .Include(r => r.Payment)
                .Include(r => r.ReservationBooks)
                .ThenInclude(rb => rb.Book)
                .Select(r => new Reservation
                {
                    Id = r.Id,
                    ReservedAt = r.ReservedAt,
                    Payment = r.Payment,
                    ReservationBooks = r.ReservationBooks.Select(rb => new ReservationBook
                    {
                        Book = rb.Book,
                        Days = rb.Days,
                        QuickPickUp = rb.QuickPickUp,
                        Price = rb.Price
                    }).ToList()
                })
                .ToListAsync();

            return Ok(reservations);
        }


        [HttpGet("{id}")]
        public async Task<ActionResult<Reservation>> GetReservation(int id)
        {
            var reservation = await _context.Reservations
                .Include(r => r.Payment)
                .Include(r => r.ReservationBooks)
                .ThenInclude(rb => rb.Book)
                .Select(r => new Reservation
                {
                    Id = r.Id,
                    ReservedAt = r.ReservedAt,
                    Payment = r.Payment,
                    ReservationBooks = r.ReservationBooks.Select(rb => new ReservationBook
                    {
                        Book = rb.Book,
                        Days = rb.Days,
                        QuickPickUp = rb.QuickPickUp,
                        Price = rb.Price
                    }).ToList()
                })
                .FirstOrDefaultAsync(r => r.Id == id);

            if (reservation == null)
            {
                return NotFound();
            }

            return Ok(reservation);
        }

        [HttpPost]
        public async Task<ActionResult<Reservation>> PostReservation([FromBody] Reservation reservation)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (reservation.ReservationBooks == null || !reservation.ReservationBooks.Any())
            {
                return BadRequest("At least one book must be provided.");
            }

            var bookIds = reservation.ReservationBooks.Select(rb => rb.Book.Id).ToList();
            var books = await _context.Books.Where(b => bookIds.Contains(b.Id)).ToListAsync();

            if (books.Count != bookIds.Count)
            {
                return BadRequest("One or more BookIds are invalid.");
            }

            foreach (var reservationBook in reservation.ReservationBooks)
            {
                var book = books.FirstOrDefault(b => b.Id == reservationBook.Book.Id);
                if (book == null) return BadRequest("Invalid BookId.");
            }

            var newReservation = new Reservation
            {
                ReservedAt = DateTime.UtcNow,
                ReservationBooks = new List<ReservationBook>()
            };

            _context.Reservations.Add(newReservation);
            await _context.SaveChangesAsync();

            foreach (var reservationBook in reservation.ReservationBooks)
            {
                newReservation.ReservationBooks.Add(new ReservationBook
                {
                    Book = await _context.Books.FindAsync(reservationBook.Book.Id),
                    Days = reservationBook.Days,
                    Reservation = newReservation,
                    QuickPickUp = reservationBook.QuickPickUp,
                    Price = ReservationBookUtil.CalculateReservationBookPrice(
                    reservationBook.Book,
                    reservationBook.Days,
                    reservationBook.QuickPickUp)
                });
            }

            await _context.SaveChangesAsync();

            var newPayment = new Payment
            {
                Amount = ReservationBookUtil.CalculateTotalAmount((List<ReservationBook>)reservation.ReservationBooks),
                PaymentDate = DateTime.UtcNow,
                Reservation = newReservation
            };

            _context.Payments.Add(newPayment);
            await _context.SaveChangesAsync();

            newReservation.PaymentId = newPayment.Id;
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetReservation), new { id = newReservation.Id }, newReservation);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteReservation(int id)
        {
            var reservation = await _context.Reservations
                .Include(r => r.ReservationBooks)
                .FirstOrDefaultAsync(r => r.Id == id);

            if (reservation == null)
            {
                return NotFound();
            }

            _context.ReservationBooks.RemoveRange(reservation.ReservationBooks);
            _context.Reservations.Remove(reservation);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
