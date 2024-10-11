using LibraryReservationApp.Data;
using LibraryReservationApp.Models;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<LibraryContext>(options =>
    options.UseInMemoryDatabase("LibraryDb"));

builder.Services.AddCors();

builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<LibraryContext>();
    context.Database.EnsureCreated();

    context.Books.AddRange(
        new Book { Id = 1, Name = "1984", Year = 1949, Type = "Book", PictureUrl = "https://example.com/1984.jpg" },
        new Book { Id = 2, Name = "The Hobbit", Year = 1937, Type = "Audiobook", PictureUrl = "https://example.com/thehobbit.jpg" },
        new Book { Id = 3, Name = "The Hobbit", Year = 1937, Type = "Audiobook", PictureUrl = "https://example.com/thehobbit.jpg" }
    );
    context.Reservations.AddRange(
        new Reservation { Id = 1, ReservationType = "Book", QuickPickUp = true, Days = 10, TotalAmount = 0, ReservedAt = DateTime.Now },
        new Reservation { Id = 2, ReservationType = "Book", QuickPickUp = true, Days = 10, TotalAmount = 0, ReservedAt = DateTime.Now }
    );
    context.ReservationBooks.AddRange(
        new ReservationBook { ReservationId = 1, BookId = 1 },
        new ReservationBook { ReservationId = 1, BookId = 2 },
        new ReservationBook { ReservationId = 2, BookId = 2 },
        new ReservationBook { ReservationId = 2, BookId = 1 }
    );

    context.SaveChanges();
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors(x => x
    .AllowAnyMethod()
    .AllowAnyHeader()
    .SetIsOriginAllowed(origin => true)
    .AllowCredentials());

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
