using Microsoft.EntityFrameworkCore;
using LibraryReservationApp.Models;

namespace LibraryReservationApp.Data
{
    public class LibraryContext : DbContext
    {
        public LibraryContext(DbContextOptions<LibraryContext> options)
            : base(options)
        {
        }

        public DbSet<Book> Books { get; set; }

        public DbSet<Reservation> Reservations { get; set; }

        public DbSet<ReservationBook> ReservationBooks { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<ReservationBook>()
                .HasKey(rb => new { rb.ReservationId, rb.BookId });

            modelBuilder.Entity<ReservationBook>()
                .HasOne(rb => rb.Reservation)
                .WithMany(r => r.ReservationBooks)
                .HasForeignKey(rb => rb.ReservationId);

            modelBuilder.Entity<ReservationBook>()
                .HasOne(rb => rb.Book)
                .WithMany(b => b.ReservationBooks)
                .HasForeignKey(rb => rb.BookId);
        }
    }
}
