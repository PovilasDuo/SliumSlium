using Microsoft.EntityFrameworkCore;
using SliumSlium.Server.Models;

public class DatabaseContext : DbContext
{
    public DatabaseContext(DbContextOptions<DatabaseContext> options) : base(options)
    {
    }

    public DbSet<User> User { get; set; }
    public DbSet<JobOffer> JobOffer { get; set; }
    public DbSet<Part> Part { get; set; }
    public object JobOffers { get; internal set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>()
            .HasKey(u => u.Id_User);

        modelBuilder.Entity<JobOffer>()
            .HasKey(j => j.Id_JobOffer);

        modelBuilder.Entity<Part>()
            .HasKey(p => p.Id_Part);

        modelBuilder.Entity<JobOffer>()
            .HasOne(j => j.User)
            .WithMany(u => u.JobOffers)
            .HasForeignKey(j => j.Fk_UserId_User);

        modelBuilder.Entity<Part>()
            .HasOne(p => p.JobOffers)
            .WithMany(j => j.Parts)
            .HasForeignKey(p => p.Fk_JobOfferId_JobOffer);
    }
}