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
                .HasAnnotation("ProductVersion", "9.0.0")
                .HasAnnotation("Relational:MaxIdentifierLength", 63);

            NpgsqlModelBuilderExtensions.UseIdentityByDefaultColumns(modelBuilder);

            modelBuilder.Entity("JobDetails", b =>
                {
                    b.Property<int>("JobDetailsId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("JobDetailsId"));

                    b.Property<string>("AdditionalInfo")
                        .HasColumnType("text");

                    b.Property<string>("ClientEmail")
                        .HasColumnType("text");

                    b.Property<string>("ClientName")
                        .HasColumnType("text");

                    b.Property<int?>("JobAddressId")
                        .HasColumnType("integer");

                    b.Property<string>("Mobile")
                        .HasColumnType("text");

                    b.Property<string>("SiteAccessInfo")
                        .HasColumnType("text");

                    b.Property<string>("YourReference")
                        .HasColumnType("text");

                    b.HasKey("JobDetailsId");

                    b.HasIndex("JobAddressId")
                        .IsUnique();

                    b.ToTable("JobDetails");
                });

            modelBuilder.Entity("qelec.Models.CostBreakdown", b =>
                {
                    b.Property<int>("CostBreakdownId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("CostBreakdownId"));

                    b.Property<decimal>("CommutingCost")
                        .HasColumnType("numeric");

                    b.Property<decimal>("LaborCost")
                        .HasColumnType("numeric");

                    b.Property<decimal>("ParkingCost")
                        .HasColumnType("numeric");

                    b.Property<decimal>("TotalCongestionCharge")
                        .HasColumnType("numeric");

                    b.HasKey("CostBreakdownId");

                    b.ToTable("CostBreakdown");
                });

            modelBuilder.Entity("qelec.Models.EstimateDetails", b =>
                {
                    b.Property<int>("EstimateDetailsId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("EstimateDetailsId"));

                    b.Property<decimal>("CalculatedCost")
                        .HasColumnType("numeric");

                    b.Property<bool>("CongestionCharge")
                        .HasColumnType("boolean");

                    b.Property<int?>("CostBreakdownId")
                        .HasColumnType("integer");

                    b.Property<decimal>("GeneratedTime")
                        .HasColumnType("numeric");

                    b.Property<string>("JobDescription")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<int?>("MultiplierDetailsId")
                        .HasColumnType("integer");

                    b.Property<bool>("PaidOnStreet")
                        .HasColumnType("boolean");

                    b.Property<string>("Postcode")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<decimal>("PostcodeTierCost")
                        .HasColumnType("numeric");

                    b.HasKey("EstimateDetailsId");

                    b.HasIndex("CostBreakdownId");

                    b.HasIndex("MultiplierDetailsId");

                    b.ToTable("EstimateDetails");
                });

            modelBuilder.Entity("qelec.Models.InvoiceDetails", b =>
                {
                    b.Property<int>("InvoiceDetailsId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("InvoiceDetailsId"));

                    b.Property<string>("CompanyName")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<DateTime>("InvoiceDate")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("PaymentStatus")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("RecipientAddress")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("RecipientCity")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("RecipientEmail")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("RecipientName")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("RecipientPhone")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("RecipientPostcode")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<decimal>("TotalAmount")
                        .HasColumnType("numeric");

                    b.HasKey("InvoiceDetailsId");

                    b.ToTable("InvoiceDetails");
                });

            modelBuilder.Entity("qelec.Models.JobAddress", b =>
                {
                    b.Property<int>("JobAddressId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("JobAddressId"));

                    b.Property<string>("City")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<bool>("CongestionCharge")
                        .HasColumnType("boolean");

                    b.Property<bool>("PaidOnStreet")
                        .HasColumnType("boolean");

                    b.Property<string>("Postcode")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Street")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<bool>("VisitorPermit")
                        .HasColumnType("boolean");

                    b.HasKey("JobAddressId");

                    b.ToTable("JobAddress");
                });

            modelBuilder.Entity("qelec.Models.MultiplierDetails", b =>
                {
                    b.Property<int>("MultiplierDetailsId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("MultiplierDetailsId"));

                    b.Property<string>("End")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<decimal>("Multiplier")
                        .HasColumnType("numeric");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Start")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("MultiplierDetailsId");

                    b.ToTable("MultiplierDetails");
                });

            modelBuilder.Entity("qelec.Models.Order", b =>
                {
                    b.Property<int>("OrderId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("OrderId"));

                    b.Property<DateTime>("CreatedDate")
                        .HasColumnType("timestamp with time zone");

                    b.Property<int?>("EstimateDetailsId")
                        .HasColumnType("integer");

                    b.Property<int?>("InvoiceDetailsId")
                        .HasColumnType("integer");

                    b.Property<int?>("JobAddressId")
                        .HasColumnType("integer");

                    b.Property<int?>("JobDetailsId")
                        .HasColumnType("integer");

                    b.Property<string>("Status")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<int?>("TimeSlotId")
                        .HasColumnType("integer");

                    b.Property<DateTime?>("UpdatedDate")
                        .HasColumnType("timestamp with time zone");

                    b.Property<int?>("UserId")
                        .HasColumnType("integer");

                    b.HasKey("OrderId");

                    b.HasIndex("EstimateDetailsId");

                    b.HasIndex("InvoiceDetailsId")
                        .IsUnique();

                    b.HasIndex("JobAddressId");

                    b.HasIndex("JobDetailsId")
                        .IsUnique();

                    b.HasIndex("TimeSlotId");

                    b.HasIndex("UserId");

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

                    b.Property<string>("ResetToken")
                        .HasColumnType("text");

                    b.Property<DateTime?>("ResetTokenExpiry")
                        .HasColumnType("timestamp with time zone");

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
                            PasswordHash = "$2a$12$6Ck2f2SZA77ETUZ.buJG2.Ql8lo1p65fiF.JEtGZPVxDkJPhimrTm",
                            Role = "Admin",
                            Username = "Boss"
                        });
                });

            modelBuilder.Entity("JobDetails", b =>
                {
                    b.HasOne("qelec.Models.JobAddress", "JobAddress")
                        .WithOne()
                        .HasForeignKey("JobDetails", "JobAddressId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.Navigation("JobAddress");
                });

            modelBuilder.Entity("qelec.Models.EstimateDetails", b =>
                {
                    b.HasOne("qelec.Models.CostBreakdown", "CostBreakdown")
                        .WithMany()
                        .HasForeignKey("CostBreakdownId");

                    b.HasOne("qelec.Models.MultiplierDetails", "MultiplierDetails")
                        .WithMany()
                        .HasForeignKey("MultiplierDetailsId");

                    b.Navigation("CostBreakdown");

                    b.Navigation("MultiplierDetails");
                });

            modelBuilder.Entity("qelec.Models.Order", b =>
                {
                    b.HasOne("qelec.Models.EstimateDetails", "EstimateDetails")
                        .WithMany()
                        .HasForeignKey("EstimateDetailsId");

                    b.HasOne("qelec.Models.InvoiceDetails", "InvoiceDetails")
                        .WithOne()
                        .HasForeignKey("qelec.Models.Order", "InvoiceDetailsId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("qelec.Models.JobAddress", "JobAddress")
                        .WithMany()
                        .HasForeignKey("JobAddressId");

                    b.HasOne("JobDetails", "JobDetails")
                        .WithOne()
                        .HasForeignKey("qelec.Models.Order", "JobDetailsId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("qelec.Models.TimeSlot", "TimeSlot")
                        .WithMany("Orders")
                        .HasForeignKey("TimeSlotId");

                    b.HasOne("qelec.Models.User", "User")
                        .WithMany("Orders")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.Navigation("EstimateDetails");

                    b.Navigation("InvoiceDetails");

                    b.Navigation("JobAddress");

                    b.Navigation("JobDetails");

                    b.Navigation("TimeSlot");

                    b.Navigation("User");
                });

            modelBuilder.Entity("qelec.Models.TimeSlot", b =>
                {
                    b.Navigation("Orders");
                });

            modelBuilder.Entity("qelec.Models.User", b =>
                {
                    b.Navigation("Orders");
                });
#pragma warning restore 612, 618
        }
    }
}
