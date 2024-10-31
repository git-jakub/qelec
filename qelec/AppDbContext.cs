using Microsoft.EntityFrameworkCore;
using qelec.Models;
using System;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<TimeSlot> TimeSlot { get; set; }
    public DbSet<Order> Orders { get; set; }
    public DbSet<User> Users { get; set; }  // Add this line for the User model

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Seed data for TimeSlot for October and November...
        modelBuilder.Entity<TimeSlot>().HasData(
            new TimeSlot { TimeSlotId = 1, Date = DateTime.SpecifyKind(new DateTime(2024, 10, 28), DateTimeKind.Utc), Time = "10:00", IsAvailable = true },
            new TimeSlot { TimeSlotId = 2, Date = DateTime.SpecifyKind(new DateTime(2024, 10, 28), DateTimeKind.Utc), Time = "11:00", IsAvailable = true },
            new TimeSlot { TimeSlotId = 3, Date = DateTime.SpecifyKind(new DateTime(2024, 10, 28), DateTimeKind.Utc), Time = "12:00", IsAvailable = false }
            // Continue for November slots as in your original seeding logic...
        );

        // Optional: Seed User data if necessary
        //modelBuilder.Entity<User>().HasData(
        //    new User { Id = 1, Email = "test@example.com", PasswordHash = "hashed_password_example" } // Replace with actual hashed password
        //);
    }
}
