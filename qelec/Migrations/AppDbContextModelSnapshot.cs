﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace qelec.Migrations
{
    [DbContext(typeof(AppDbContext))]
    partial class AppDbContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.10")
                .HasAnnotation("Relational:MaxIdentifierLength", 63);

            NpgsqlModelBuilderExtensions.UseIdentityByDefaultColumns(modelBuilder);

            modelBuilder.Entity("qelec.Models.Order", b =>
                {
                    b.Property<int>("OrderId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("OrderId"));

                    b.Property<string>("InvoiceDetails")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("JobDetails")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<int>("TimeSlotId")
                        .HasColumnType("integer");

                    b.HasKey("OrderId");

                    b.ToTable("Orders");
                });

            modelBuilder.Entity("qelec.Models.TimeSlot", b =>
                {
                    b.Property<int>("TimeSlotId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("TimeSlotId"));

                    b.Property<DateTime>("EndDate")
                        .HasColumnType("timestamp with time zone");

                    b.Property<bool>("IsAvailable")
                        .HasColumnType("boolean");

                    b.Property<DateTime>("StartDate")
                        .HasColumnType("timestamp with time zone");

                    b.HasKey("TimeSlotId");

                    b.ToTable("TimeSlot");

                    b.HasData(
                        new
                        {
                            TimeSlotId = 1,
                            EndDate = new DateTime(2024, 10, 28, 11, 0, 0, 0, DateTimeKind.Utc),
                            IsAvailable = true,
                            StartDate = new DateTime(2024, 10, 28, 10, 0, 0, 0, DateTimeKind.Utc)
                        },
                        new
                        {
                            TimeSlotId = 2,
                            EndDate = new DateTime(2024, 10, 28, 12, 0, 0, 0, DateTimeKind.Utc),
                            IsAvailable = true,
                            StartDate = new DateTime(2024, 10, 28, 11, 0, 0, 0, DateTimeKind.Utc)
                        },
                        new
                        {
                            TimeSlotId = 3,
                            EndDate = new DateTime(2024, 10, 28, 13, 0, 0, 0, DateTimeKind.Utc),
                            IsAvailable = false,
                            StartDate = new DateTime(2024, 10, 28, 12, 0, 0, 0, DateTimeKind.Utc)
                        });
                });

            modelBuilder.Entity("qelec.Models.User", b =>
                {
                    b.Property<int>("UserId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("UserId"));

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("FullName")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("PasswordHash")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Role")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Username")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("UserId");

                    b.ToTable("Users");

                    b.HasData(
                        new
                        {
                            UserId = 1,
                            Email = "admin@gmail.com",
                            FullName = "Adam",
                            PasswordHash = "admin",
                            Role = "Admin",
                            Username = "Boss"
                        });
                });
#pragma warning restore 612, 618
        }
    }
}
