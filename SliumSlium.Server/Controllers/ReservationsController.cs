using LibraryReservationApp.Data;
using LibraryReservationApp.Models;
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
                .Include(static r => r.ReservationBooks)
                .Select(r => new Reservation
                {
                    Id = r.Id,
                    TotalAmount = r.TotalAmount,
                    ReservedAt = r.ReservedAt,
                    ReservationBooks = r.ReservationBooks.Select(rb => new ReservationBook
                    {
                        ReservationId = r.Id,
                        BookId = rb.BookId,
                        Days = rb.Days,
                        QuickPickUp = rb.QuickPickUp,
                    }).ToList()
                })
                .ToListAsync();
            return Ok(reservations);
        }


        [HttpGet("{id}")]
        public async Task<ActionResult<Reservation>> GetReservation(int id)
        {
            var reservation = await _context.Reservations
                .Include(r => r.ReservationBooks)
                .Select(r => new Reservation
                {
                    Id = r.Id,
                    TotalAmount = r.TotalAmount,
                    ReservedAt = r.ReservedAt,
                    ReservationBooks = r.ReservationBooks.Select(rb => new ReservationBook
                    {
                        ReservationId = r.Id,
                        BookId = rb.BookId,
                        Days = rb.Days,
                        QuickPickUp = rb.QuickPickUp,
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

            var bookIds = reservation.ReservationBooks.Select(b => b.BookId).ToList();
            var books = await _context.Books.Where(b => bookIds.Contains(b.Id)).ToListAsync();

            if (books.Count != bookIds.Count)
            {
                return BadRequest("One or more BookIds are invalid.");
            }

            decimal total = 0;

            foreach (var reservationBook in reservation.ReservationBooks)
            {
                var book = books.FirstOrDefault(b => b.Id == reservationBook.BookId);
                if (book == null)
                {
                    return BadRequest("Invalid BookId.");
                }

                decimal pricePerDay = book.Type.Equals("Audiobook", StringComparison.OrdinalIgnoreCase) ? 3 : 2;
                decimal reservationSum = pricePerDay * reservationBook.Days;

                if (reservationBook.Days > 10)
                {
                    reservationSum *= 0.80m;
                }
                else if (reservationBook.Days > 3)
                {
                    reservationSum *= 0.90m;
                }
                if (reservationBook.QuickPickUp)
                {
                    total += 5;
                }
                total += reservationSum;
            }

            total += 3;

            var newReservation = new Reservation
            {
                TotalAmount = total,
                ReservedAt = DateTime.UtcNow,
                ReservationBooks = new List<ReservationBook>()
            };

            _context.Reservations.Add(newReservation);
            await _context.SaveChangesAsync();

            foreach (var reservationBook in reservation.ReservationBooks)
            {
                newReservation.ReservationBooks.Add(new ReservationBook
                {
                    BookId = reservationBook.BookId,
                    Days = reservationBook.Days,
                    ReservationId = newReservation.Id,
                    QuickPickUp = reservationBook.QuickPickUp
                });
            }

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
