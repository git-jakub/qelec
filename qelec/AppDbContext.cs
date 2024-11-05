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
    public DbSet<User> Users { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Seed data for TimeSlot with StartDate and EndDate including time
        modelBuilder.Entity<TimeSlot>().HasData(
            new TimeSlot
            {
                TimeSlotId = 1,
                StartDate = DateTime.SpecifyKind(new DateTime(2024, 10, 28, 10, 0, 0), DateTimeKind.Utc),
                EndDate = DateTime.SpecifyKind(new DateTime(2024, 10, 28, 11, 0, 0), DateTimeKind.Utc),
                IsAvailable = true
            },
            new TimeSlot
            {
                TimeSlotId = 2,
                StartDate = DateTime.SpecifyKind(new DateTime(2024, 10, 28, 11, 0, 0), DateTimeKind.Utc),
                EndDate = DateTime.SpecifyKind(new DateTime(2024, 10, 28, 12, 0, 0), DateTimeKind.Utc),
                IsAvailable = true
            },
            new TimeSlot
            {
                TimeSlotId = 3,
                StartDate = DateTime.SpecifyKind(new DateTime(2024, 10, 28, 12, 0, 0), DateTimeKind.Utc),
                EndDate = DateTime.SpecifyKind(new DateTime(2024, 10, 28, 13, 0, 0), DateTimeKind.Utc),
                IsAvailable = false
            }
            // Add additional slots as needed
        );

         modelBuilder.Entity<User>().HasData(
             new User { UserId = 1, Email = "admin@gmail.com", PasswordHash = "admin", FullName = "Adam", Username = "Boss", Role = "Admin"}
         );
    }
}
