using LibraryReservationApp.Data;
using LibraryReservationApp.Models;
using LibraryReservationApp.Utils;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AutoMapper;

namespace LibraryReservationApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReservationsController : ControllerBase
    {
        private readonly LibraryContext _context;
        private readonly IMapper _mapper;

        public ReservationsController(LibraryContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Reservation>>> GetReservations()
        {
            var reservations = await _context.Reservations
                .Include(r => r.Payment)
                .Include(r => r.ReservationBooks)
                .ThenInclude(rb => rb.Book)
                .Include(u => u.User)
                .ToListAsync();

            return Ok(reservations);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<IEnumerable<Reservation>>> GetUserReservations(int id)
        {
            var reservation = await _context.Reservations
                .Include(r => r.Payment)
                .Include(r => r.ReservationBooks)
                .ThenInclude(rb => rb.Book)
                .Include(r => r.User)
                .Where(r => r.User.Id == id)
                .ToListAsync();

            if (reservation == null)
            {
                return NotFound();
            }

            return Ok(reservation);
        }

        private async Task<ActionResult<Reservation>> GetReservation(int id)
        {
            var reservation = await _context.Reservations
                .Include(r => r.Payment)
                .Include(r => r.ReservationBooks)
                .ThenInclude(rb => rb.Book)
                .Include(u => u.User)
                .FirstOrDefaultAsync(r => r.Id == id);

            if (reservation == null)
            {
                return NotFound();
            }

            return Ok(reservation);
        }


        //[HttpPost]
        //public async Task<ActionResult<Reservation>> PostReservation([FromBody] Reservation_PostDTO reservationDto)
        //{
        //    if (!ModelState.IsValid)
        //    {
        //        return BadRequest(ModelState);
        //    }

        //    if (reservationDto.ReservationBooks == null || !reservationDto.ReservationBooks.Any())
        //    {
        //        return BadRequest("At least one book must be provided.");
        //    }

        //    var bookIds = reservationDto.ReservationBooks.Select(rb => rb.BookId).ToList();
        //    var books = await _context.Books.Where(b => bookIds.Contains(b.Id)).ToListAsync();

        //    if (books.Count != bookIds.Count)
        //    {
        //        return BadRequest("One or more BookIds are invalid.");
        //    }

        //    var newReservation = _mapper.Map<Reservation>(reservationDto);

        //    _context.Reservations.Add(newReservation);
        //    await _context.SaveChangesAsync();

        //    foreach (var reservationBookDto in reservationDto.ReservationBooks)
        //    {
        //        var book = books.FirstOrDefault(b => b.Id == reservationBookDto.BookId);
        //        if (book == null) return BadRequest("Invalid BookId.");

        //        var newReservationBook = _mapper.Map<ReservationBook>(reservationBookDto);
        //        newReservationBook.ReservationId = newReservation.Id;
        //        newReservationBook.Price = ReservationBookUtil.CalculateReservationBookPrice(
        //            book,
        //            reservationBookDto.Days,
        //            reservationBookDto.QuickPickUp
        //        );
        //        _context.ReservationBooks.Add(newReservationBook);
        //    }

        //    var payment = new Payment_PostDTO
        //    {
        //        Amount = ReservationBookUtil.CalculateTotalAmount(await _context.ReservationBooks
        //            .Where(rb => rb.ReservationId == newReservation.Id)
        //            .ToListAsync()),
        //        PaymentDate = DateTime.UtcNow,
        //        ReservationId = newReservation.Id,
        //    };
        //    var newPayment = _mapper.Map<Payment>(payment);
        //    _context.Payments.Add(newPayment);
        //    await _context.SaveChangesAsync();

        //    newReservation.PaymentId = newPayment.Id;
        //    await _context.SaveChangesAsync();

        //    return CreatedAtAction(nameof(GetReservation), new { id = newReservation.Id }, newReservation);
        //}

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

            var newReservation = new Reservation
            {
                ReservedAt = DateTime.UtcNow,
                Status = "Ongoing",
                UserId = 1
            };

            _context.Reservations.Add(newReservation);
            await _context.SaveChangesAsync();

            foreach (var reservationBook in reservation.ReservationBooks)
            {
                var book = books.FirstOrDefault(b => b.Id == reservationBook.Book.Id);
                if (book == null) return BadRequest("Invalid BookId.");

                var maxId = await _context.ReservationBooks.MaxAsync(rb => (int?)rb.Id) ?? 0;
                var newId = maxId + 1;

                var newReservationBook = new ReservationBook
                {
                    Id = newId,
                    BookId = book.Id,
                    Book = book,
                    ReservationId = newReservation.Id,
                    Days = reservationBook.Days,
                    QuickPickUp = reservationBook.QuickPickUp,
                    Price = ReservationBookUtil.CalculateReservationBookPrice(
                        book,
                        reservationBook.Days,
                        reservationBook.QuickPickUp)
                };
                _context.ReservationBooks.Add(newReservationBook);
                await _context.SaveChangesAsync();
            }

            var newPayment = new Payment
            {
                Amount = ReservationBookUtil.CalculateTotalAmount((List<ReservationBook>)newReservation.ReservationBooks),
                PaymentDate = DateTime.UtcNow,
                ReservationId = newReservation.Id,
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

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateReservationStatus(int id, [FromQuery] string? status)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (string.IsNullOrWhiteSpace(status))
            {
                return BadRequest(new { message = "Status is required." });
            }

            var reservation = await _context.Reservations
                .Include(r => r.Payment)
                .Include(r => r.ReservationBooks)
                .ThenInclude(rb => rb.Book)
                .FirstOrDefaultAsync(r => r.Id == id);

            if (reservation == null)
            {
                return NotFound();
            }

            if (status != "Ready" && status != "In-progress" && status != "Ongoing")
            {
                return BadRequest(new { message = "Invalid status value." });
            }

            reservation.Status = status;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Reservations.Any(e => e.Id == id))
                {
                    return NotFound();
                }
                else
                {
                    throw new Exception("Error occurred updating the reservation");
                }
            }

            return NoContent();
        }
    }
}
