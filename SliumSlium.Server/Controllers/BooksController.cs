using LibraryReservationApp.Data;
using LibraryReservationApp.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LibraryReservationApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BooksController : ControllerBase
    {
        private readonly LibraryContext _context;

        public BooksController(LibraryContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Book>>> GetBooks([FromQuery] string? name, [FromQuery] int? year, [FromQuery] string? type)
        {
            var query = _context.Books.AsQueryable();

            if (!string.IsNullOrEmpty(name))
            {
                query = query.Where(b => b.Name.ToLower().Contains(name.ToLower()));
            }

            if (year.HasValue)
            {
                query = query.Where(b => b.Year == year.Value);
            }

            if (!string.IsNullOrEmpty(type))
            {
                query = query.Where(b => b.Type.ToLower().Equals(type.ToLower(), StringComparison.OrdinalIgnoreCase));
            }

            if (query.Count() == 0 && !string.IsNullOrEmpty(name))
            {
                if (int.TryParse(name, out int parsedYear))
                {
                    query = _context.Books.Where(b => b.Year == parsedYear);
                }
                else
                {
                    query = _context.Books.Where(b => b.Type.Equals(name, StringComparison.OrdinalIgnoreCase));
                }
            }

            return await query.ToListAsync();
        }

        [HttpGet("All")]
        public async Task<ActionResult<IEnumerable<BookDTO>>> GetBooks()
        {
            var books = await _context.Books
                .Select(b => new BookDTO
                {
                    Id = b.Id,
                    Name = b.Name,
                    Year = b.Year,
                    Type = b.Type,
                    PictureUrl = b.PictureUrl
                })
                .ToListAsync();
            return books;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Book>> GetBook(int id)
        {
            var book = await _context.Books
                .Include(b => b.ReservationBooks)
                .ThenInclude(rb => rb.Reservation)
                .FirstOrDefaultAsync(b => b.Id == id);

            if (book == null)
            {
                return NotFound();
            }

            return book;
        }

        [HttpPost]
        public async Task<ActionResult<Book>> PostBook(Book book)
        {
            _context.Books.Add(book);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetBook), new { id = book.Id }, book);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutBook(int id, Book book)
        {
            if (id != book.Id)
            {
                return BadRequest();
            }

            _context.Entry(book).State = EntityState.Modified;

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
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/Books/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBook(int id)
        {
            var book = await _context.Books
                .Include(b => b.ReservationBooks)
                .FirstOrDefaultAsync(b => b.Id == id);

            if (book == null)
            {
                return NotFound();
            }

            _context.ReservationBooks.RemoveRange(book.ReservationBooks);
            _context.Books.Remove(book);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
