using Microsoft.AspNetCore.Mvc;
using LibraryReservationApp.Data;
using LibraryReservationApp.Models;
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
        public async Task<ActionResult<IEnumerable<ReservationDTO>>> GetReservations()
        {
            var reservations = await _context.Reservations
                .Include(r => r.ReservationBooks)
                .ThenInclude(rb => rb.Book)
                .Select(r => new ReservationDTO
                {
                    Id = r.Id,
                    ReservationType = r.ReservationType,
                    QuickPickUp = r.QuickPickUp,
                    Days = r.Days,
                    TotalAmount = r.TotalAmount,
                    ReservedAt = r.ReservedAt,
                    Books = r.ReservationBooks.Select(rb => new BookDTO
                    {
                        Id = rb.Book.Id,
                        Name = rb.Book.Name,
                        Year = rb.Book.Year,
                        Type = rb.Book.Type,
                        PictureUrl = rb.Book.PictureUrl
                    }).ToList()
                })
                .ToListAsync();

            return Ok(reservations);
        }

        // GET: api/Reservations/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ReservationDTO>> GetReservation(int id)
        {
            var reservation = await _context.Reservations
                .Include(r => r.ReservationBooks)
                .ThenInclude(rb => rb.Book)
                .Select(r => new ReservationDTO
                {
                    Id = r.Id,
                    ReservationType = r.ReservationType,
                    QuickPickUp = r.QuickPickUp,
                    Days = r.Days,
                    TotalAmount = r.TotalAmount,
                    ReservedAt = r.ReservedAt,
                    Books = r.ReservationBooks.Select(rb => new BookDTO
                    {
                        Id = rb.Book.Id,
                        Name = rb.Book.Name,
                        Year = rb.Book.Year,
                        Type = rb.Book.Type,
                        PictureUrl = rb.Book.PictureUrl
                    }).ToList()
                })
                .FirstOrDefaultAsync(r => r.Id == id);

            if (reservation == null)
            {
                return NotFound();
            }

            return Ok(reservation);
        }

        // POST: api/Reservations
        [HttpPost]
        public async Task<ActionResult<ReservationDTO>> PostReservation([FromBody] ReservationDTO reservationDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (reservationDto.Books == null || !reservationDto.Books.Any())
            {
                return BadRequest("At least one Book must be provided.");
            }

            var bookIds = reservationDto.Books.Select(b => b.Id).ToList();
            var books = await _context.Books.Where(b => bookIds.Contains(b.Id)).ToListAsync();

            if (books.Count != bookIds.Count)
            {
                return BadRequest("One or more BookIds are invalid.");
            }

            decimal total = 0;

            foreach (var book in books)
            {
                decimal reservationSum = book.Type.Equals("Audiobook", StringComparison.OrdinalIgnoreCase) ? 3 : 2;
                total += reservationSum * reservationDto.Days;
            }

            if (reservationDto.Days > 10)
            {
                total *= 0.80m;
            }
            else if (reservationDto.Days > 3)
            {
                total *= 0.90m; 
            }

            total += 3;

            if (reservationDto.QuickPickUp)
            {
                total += 5;
            }

            var reservation = new Reservation
            {
                ReservationType = reservationDto.ReservationType,
                QuickPickUp = reservationDto.QuickPickUp,
                Days = reservationDto.Days,
                TotalAmount = total,
                ReservedAt = DateTime.UtcNow,
                ReservationBooks = reservationDto.Books.Select(book => new ReservationBook
                {
                    BookId = book.Id
                }).ToList()
            };

            _context.Reservations.Add(reservation);
            await _context.SaveChangesAsync();

            await _context.Entry(reservation)
                .Collection(r => r.ReservationBooks)
                .Query()
                .Include(rb => rb.Book)
                .LoadAsync();

            var createdReservationDto = new ReservationDTO
            {
                Id = reservation.Id,
                ReservationType = reservation.ReservationType,
                QuickPickUp = reservation.QuickPickUp,
                Days = reservation.Days,
                TotalAmount = reservation.TotalAmount,
                ReservedAt = reservation.ReservedAt,
                Books = reservation.ReservationBooks.Select(rb => new BookDTO
                {
                    Id = rb.Book.Id,
                    Name = rb.Book.Name,
                    Year = rb.Book.Year,
                    Type = rb.Book.Type,
                    PictureUrl = rb.Book.PictureUrl
                }).ToList()
            };

            return CreatedAtAction(nameof(GetReservation), new { id = createdReservationDto.Id }, createdReservationDto);
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
