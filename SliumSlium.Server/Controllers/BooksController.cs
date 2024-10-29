using LibraryReservationApp.Data;
using LibraryReservationApp.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace LibraryReservationApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BooksController : ControllerBase
    {
        private readonly IWebHostEnvironment _env;
        private readonly LibraryContext _context;

        public BooksController(LibraryContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
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
        public async Task<ActionResult<IEnumerable<Book>>> GetBooks()
        {
            var books = await _context.Books
                .Select(b => new Book
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
                .FirstOrDefaultAsync(b => b.Id == id);

            if (book == null)
            {
                return NotFound();
            }

            return book;
        }

        [HttpPost]
        public async Task<IActionResult> PostBook([FromForm] IFormCollection formData)
        {
            if (!formData.TryGetValue("book", out var bookJson)) return BadRequest("Book data is missing.");

            var options = new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };

            Book? book = JsonSerializer.Deserialize<Book>(bookJson[0], options);

            if (book == null || string.IsNullOrWhiteSpace(book.Name) || string.IsNullOrWhiteSpace(book.Type))
                return BadRequest("Invalid book data. Make sure all required fields are present.");

            var existingBook = await _context.Books.FirstOrDefaultAsync(b => b.Name.Equals(book.Name, StringComparison.OrdinalIgnoreCase) && b.Type.Equals(book.Type, StringComparison.OrdinalIgnoreCase));

            if (existingBook != null) return Conflict("A book with the same name and type already exists.");

            IFormFile? file = formData.Files.FirstOrDefault();
            if (file != null && file.Length > 0)
            {
                var uploads = Path.Combine(_env.WebRootPath, "images");
                var fileName = $"{Guid.NewGuid()}_{file.FileName}";
                var filePath = Path.Combine(uploads, fileName);

                if (!Directory.Exists(uploads))
                {
                    Directory.CreateDirectory(uploads);
                }

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                book.PictureUrl = $"images/{fileName}";
            }
            _context.Books.Add(book);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetBook), new { id = book.Id }, book);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutBook(int id)
        {
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

            if (book.ReservationBooks.Any())
            {
                return BadRequest("Cannot remove a reserved book");
            }

            _context.ReservationBooks.RemoveRange(book.ReservationBooks);
            _context.Books.Remove(book);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
