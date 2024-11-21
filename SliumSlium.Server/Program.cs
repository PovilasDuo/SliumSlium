using LibraryReservationApp.Data;
using LibraryReservationApp.Models;
using LibraryReservationApp.Utils;
using Microsoft.EntityFrameworkCore;
using ShopAPI.SMTP;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<LibraryContext>(options =>
    options.UseInMemoryDatabase("LibraryDb"));
builder.Services.Configure<SmtpSettings>(builder.Configuration.GetSection("SmtpSettings"));
builder.Services.AddScoped<EmailService>();
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigin", builder =>
    {
        builder.WithOrigins("https://localhost:5173")
                .AllowAnyOrigin()
                .AllowAnyMethod()
                .AllowAnyHeader();
    });
});

builder.Services.AddControllers();
builder.Services.AddAutoMapper(typeof(MappingProfile));
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

    context.Users.Add(new User
    {
        Name = "Povilas",
        Email = "ogiuxd31@gmail.com",
        Password = "Povilas!23",
        Role = 1
    });

    var reservations = new List<Reservation>
    {
        new Reservation
        {
            Id = 1,
            Status = "Ready to pick up",
            ReservedAt = DateTime.UtcNow.AddDays(-1),
            ReservationBooks = new List<ReservationBook>
            {
                new ReservationBook
                {
                    Id = 1,
                    ReservationId = 1,
                    Book = context.Books.Find(1),
                    BookId = 1,
                    Days = 5,
                    QuickPickUp = true,
                    Price = ReservationBookUtil.CalculateReservationBookPrice(context.Books.Find(1)!, 5, true)
                },
                new ReservationBook
                {
                    Id = 2,
                    ReservationId = 1,
                    Book = context.Books.Find(2),
                    BookId = 2,
                    Days = 3,
                    QuickPickUp = false,
                    Price = ReservationBookUtil.CalculateReservationBookPrice(context.Books.Find(2)!, 3, false)
                }
            },
            Payment = new Payment
            {
                Id = 1,
                Amount = ReservationBookUtil.CalculateTotalAmount(new List<ReservationBook>
                {
                    new ReservationBook
                    {
                        Id = 1,
                        ReservationId = 1,
                        Book = context.Books.Find(1),
                        BookId = 1,
                        Days = 5,
                        QuickPickUp = true,
                        Price = ReservationBookUtil.CalculateReservationBookPrice(context.Books.Find(1)!, 5, true)
                    },
                    new ReservationBook
                    {
                        Id = 2,
                        ReservationId = 1,
                        Book = context.Books.Find(2),
                        BookId = 2,
                        Days = 3,
                        QuickPickUp = false,
                        Price = ReservationBookUtil.CalculateReservationBookPrice(context.Books.Find(2)!, 3, false)
                    }
                }),
                PaymentDate = DateTime.UtcNow.AddDays(-1),
                ReservationId = 1
            },
            PaymentId = 1,
            UserId = context.Users.Find(1)!.Id,
            User = context.Users.Find(1)
        },
        new Reservation
        {
            Id = 2,
            Status = "In progress",
            ReservedAt = DateTime.UtcNow.AddDays(-2),
            ReservationBooks = new List<ReservationBook>
            {
                new ReservationBook
                {
                    Id = 3,
                    ReservationId = 2,
                    Book = context.Books.Find(3),
                    BookId = 3,
                    Days = 7,
                    QuickPickUp = true,
                    Price = ReservationBookUtil.CalculateReservationBookPrice(context.Books.Find(3)!, 7, true)
                },
                new ReservationBook
                {
                    Id = 4,
                    ReservationId = 2,
                    Book = context.Books.Find(4),
                    BookId = 4,
                    Days = 2,
                    QuickPickUp = false,
                    Price = ReservationBookUtil.CalculateReservationBookPrice(context.Books.Find(4)!, 2, false)
                }
            },
            Payment = new Payment
            {
                Id = 2,
                Amount = ReservationBookUtil.CalculateTotalAmount(new List<ReservationBook>
                {
                    new ReservationBook
                    {
                        Id = 3,
                        ReservationId = 2,
                        Book = context.Books.Find(3),
                        BookId = 3,
                        Days = 7,
                        QuickPickUp = true,
                        Price = ReservationBookUtil.CalculateReservationBookPrice(context.Books.Find(3)!, 7, true)
                    },
                    new ReservationBook
                    {
                        Id = 4,
                        ReservationId = 2,
                        Book = context.Books.Find(4),
                        BookId = 4,
                        Days = 2,
                        QuickPickUp = false,
                        Price = ReservationBookUtil.CalculateReservationBookPrice(context.Books.Find(4)!, 2, false)
                    }
                }),
                PaymentDate = DateTime.UtcNow.AddDays(-2),
                ReservationId = 2
            },
            PaymentId = 2,
            UserId = context.Users.Find(1)!.Id,
            User = context.Users.Find(1)
        },
        new Reservation
        {
            Id = 3,
            Status = "In progress",
            ReservedAt = DateTime.UtcNow.AddDays(-3),
            ReservationBooks = new List<ReservationBook>
            {
                new ReservationBook
                {
                    Id = 5,
                    ReservationId = 3,
                    Book = context.Books.Find(5),
                    BookId = 5,
                    Days = 10,
                    QuickPickUp = false,
                    Price = ReservationBookUtil.CalculateReservationBookPrice(context.Books.Find(5)!, 10, false)
                },
                new ReservationBook
                {
                    Id = 6,
                    ReservationId = 3,
                    Book = context.Books.Find(6),
                    BookId = 6,
                    Days = 4,
                    QuickPickUp = true,
                    Price = ReservationBookUtil.CalculateReservationBookPrice(context.Books.Find(6)!, 4, true)
                }
            },
            Payment = new Payment
            {
                Id = 3,
                Amount = ReservationBookUtil.CalculateTotalAmount(new List<ReservationBook>
                {
                    new ReservationBook
                    {
                        Id = 5,
                        ReservationId = 3,
                        Book = context.Books.Find(5),
                        BookId = 5,
                        Days = 10,
                        QuickPickUp = false,
                        Price = ReservationBookUtil.CalculateReservationBookPrice(context.Books.Find(5)!, 10, false)
                    },
                    new ReservationBook
                    {
                        Id = 6,
                        ReservationId = 3,
                        Book = context.Books.Find(6),
                        BookId = 6,
                        Days = 4,
                        QuickPickUp = true,
                        Price = ReservationBookUtil.CalculateReservationBookPrice(context.Books.Find(6)!, 4, true)
                    }
                }),
                PaymentDate = DateTime.UtcNow.AddDays(-3),
                ReservationId = 3
            },
            PaymentId = 3,
            UserId = context.Users.Find(1)!.Id,
            User = context.Users.Find(1)
        }
    };

    await context.SaveChangesAsync();
    context.Reservations.AddRange(reservations);
    await context.SaveChangesAsync();
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
