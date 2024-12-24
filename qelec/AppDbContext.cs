using Microsoft.EntityFrameworkCore;
using qelec.Models;
using qelec.Models.DTOs;
using System;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<TimeSlot> TimeSlot { get; set; }
    public DbSet<Order> Orders { get; set; }
    public DbSet<User> Users { get; set; }
    public DbSet<JobDetails> JobDetails { get; set; }
    public DbSet<JobAddress> JobAddress { get; set; } // Dodano brakujący DbSet
    public DbSet<InvoiceDetails> InvoiceDetails { get; set; }
    public DbSet<EstimateDetails> EstimateDetails { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configure the relationship between Order and User
        modelBuilder.Entity<Order>()
            .HasOne(o => o.User)
            .WithMany(u => u.Orders) // Assuming a user has many orders
            .HasForeignKey(o => o.UserId)
            .OnDelete(DeleteBehavior.Cascade); // Adjust delete behavior as needed

        // Configure relationships for JobDetails, InvoiceDetails, and JobAddress
        modelBuilder.Entity<Order>()
            .HasOne(o => o.JobDetails)
            .WithOne()
            .HasForeignKey<Order>(o => o.JobDetailsId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Order>()
            .HasOne(o => o.InvoiceDetails)
            .WithOne()
            .HasForeignKey<Order>(o => o.InvoiceDetailsId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<JobDetails>()
            .HasOne(jd => jd.JobAddress) // Ustaw relację z JobAddress
            .WithOne()
            .HasForeignKey<JobDetails>(jd => jd.JobAddressId)
            .OnDelete(DeleteBehavior.Cascade);

        // Seed TimeSlot data
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
        );

        // Seed User data
        modelBuilder.Entity<User>().HasData(
            new User
            {
                UserId = 1,
                Email = "admin@gmail.com",
                PasswordHash = "$2a$12$6Ck2f2SZA77ETUZ.buJG2.Ql8lo1p65fiF.JEtGZPVxDkJPhimrTm",
                FullName = "Adam",
                Username = "Boss",
                Role = "Admin"
            }
        );
    }
}
