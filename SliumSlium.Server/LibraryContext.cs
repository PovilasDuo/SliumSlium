using LibraryReservationApp.Models;
using Microsoft.EntityFrameworkCore;

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
                .HasOne<Book>()
                .WithMany()
                .HasForeignKey(rb => rb.BookId);

            modelBuilder.Entity<ReservationBook>()
                .HasOne<Reservation>()
                .WithMany()
                .HasForeignKey(rb => rb.ReservationId);
        }
    }
}
