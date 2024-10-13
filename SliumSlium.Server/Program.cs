using LibraryReservationApp.Data;
using LibraryReservationApp.Models;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<LibraryContext>(options =>
    options.UseInMemoryDatabase("LibraryDb"));

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigin", builder =>
    {
        builder.WithOrigins("https://localhost:5173")
               .AllowAnyMethod()
               .AllowAnyHeader();
    });
});

builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<LibraryContext>();
    context.Database.EnsureCreated();

    context.Books.AddRange(
        new Book { Id = 1, Name = "1984", Year = 1949, Type = "Book", PictureUrl = "images/1984.jpg" },
        new Book { Id = 2, Name = "The Hobbit", Year = 1938, Type = "Audiobook", PictureUrl = "images/thehobbit.jpg" },
        new Book { Id = 3, Name = "The Hobbit", Year = 1937, Type = "Book", PictureUrl = "images/thehobbit2.jpg" },
        new Book { Id = 4, Name = "Brave New World", Year = 1932, Type = "Book", PictureUrl = "images/bravenewworld.jpg" },
        new Book { Id = 5, Name = "To Kill a Mockingbird", Year = 1960, Type = "Book", PictureUrl = "images/tokillamockingbird.jpg" },
        new Book { Id = 6, Name = "The Catcher in the Rye", Year = 1951, Type = "Book", PictureUrl = "images/catcherintherye.jpg" },
        new Book { Id = 7, Name = "The Great Gatsby", Year = 1925, Type = "Book", PictureUrl = "images/greatgatsby.jpg" },
        new Book { Id = 8, Name = "Pride and Prejudice", Year = 1813, Type = "Book", PictureUrl = "images/prideandprejudice.jpg" },
        new Book { Id = 9, Name = "Moby Dick", Year = 1851, Type = "Book", PictureUrl = "images/mobydick.jpg" },
        new Book { Id = 10, Name = "War and Peace", Year = 1869, Type = "Book", PictureUrl = "images/warandpeace.jpg" },
        new Book { Id = 11, Name = "The Picture of Dorian Gray", Year = 1890, Type = "Book", PictureUrl = "images/pictureofdoriangray.jpg" },
        new Book { Id = 12, Name = "Jane Eyre", Year = 1847, Type = "Book", PictureUrl = "images/janeeyre.jpg" },
        new Book { Id = 13, Name = "Wuthering Heights", Year = 1847, Type = "Book", PictureUrl = "images/wutheringheights.jpg" },
        new Book { Id = 14, Name = "The Odyssey", Year = 2016, Type = "Book", PictureUrl = "images/odyssey.jpg" },
        new Book { Id = 15, Name = "Crime and Punishment", Year = 1866, Type = "Book", PictureUrl = "images/crimeandpunishment.jpg" },
        new Book { Id = 16, Name = "The Brothers Karamazov", Year = 1880, Type = "Book", PictureUrl = "images/brotherskaramazov.jpg" },
        new Book { Id = 17, Name = "The Grapes of Wrath", Year = 1939, Type = "Book", PictureUrl = "images/grapesofwrath.jpg" },
        new Book { Id = 18, Name = "The Road", Year = 2006, Type = "Book", PictureUrl = "images/road.jpg" },
        new Book { Id = 19, Name = "The Alchemist", Year = 1988, Type = "Book", PictureUrl = "images/alchemist.jpg" },
        new Book { Id = 20, Name = "The Kite Runner", Year = 2003, Type = "Book", PictureUrl = "images/kiterunner.jpg" },
        new Book { Id = 21, Name = "Fahrenheit 451", Year = 1953, Type = "Book", PictureUrl = "images/fahrenheit451.jpg" }
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

app.UseCors("AllowSpecificOrigin");

app.UseStaticFiles();

app.UseAuthorization();

app.MapControllers();

app.Run();
