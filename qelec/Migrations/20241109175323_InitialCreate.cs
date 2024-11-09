using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace qelec.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "InvoiceDetails",
                columns: table => new
                {
                    InvoiceDetailsId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    RecipientName = table.Column<string>(type: "text", nullable: false),
                    CompanyName = table.Column<string>(type: "text", nullable: false),
                    RecipientAddress = table.Column<string>(type: "text", nullable: false),
                    RecipientPostcode = table.Column<string>(type: "text", nullable: false),
                    RecipientCity = table.Column<string>(type: "text", nullable: false),
                    RecipientEmail = table.Column<string>(type: "text", nullable: false),
                    RecipientPhone = table.Column<string>(type: "text", nullable: false),
                    InvoiceDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    PaymentStatus = table.Column<string>(type: "text", nullable: false),
                    TotalAmount = table.Column<decimal>(type: "numeric", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_InvoiceDetails", x => x.InvoiceDetailsId);
                });

            migrationBuilder.CreateTable(
                name: "JobDetails",
                columns: table => new
                {
                    JobDetailsId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Postcode = table.Column<string>(type: "text", nullable: false),
                    City = table.Column<string>(type: "text", nullable: false),
                    Address = table.Column<string>(type: "text", nullable: false),
                    ClientName = table.Column<string>(type: "text", nullable: false),
                    SiteAccessInfo = table.Column<string>(type: "text", nullable: false),
                    Mobile = table.Column<string>(type: "text", nullable: false),
                    ClientEmail = table.Column<string>(type: "text", nullable: false),
                    ServiceType = table.Column<string>(type: "text", nullable: false),
                    ServiceDetails = table.Column<string>(type: "text", nullable: false),
                    EstimatedCost = table.Column<decimal>(type: "numeric", nullable: false),
                    EstimatedCompletionTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    ActualCompletionTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    PropertySizeOrSpecification = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_JobDetails", x => x.JobDetailsId);
                });

            migrationBuilder.CreateTable(
                name: "TimeSlot",
                columns: table => new
                {
                    TimeSlotId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    StartDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    EndDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    IsAvailable = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TimeSlot", x => x.TimeSlotId);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    UserId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Username = table.Column<string>(type: "text", nullable: false),
                    Email = table.Column<string>(type: "text", nullable: false),
                    PasswordHash = table.Column<string>(type: "text", nullable: false),
                    FullName = table.Column<string>(type: "text", nullable: false),
                    Role = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.UserId);
                });

            migrationBuilder.CreateTable(
                name: "Orders",
                columns: table => new
                {
                    OrderId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    TimeSlotId = table.Column<int>(type: "integer", nullable: false),
                    Status = table.Column<string>(type: "text", nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    JobDetailsId = table.Column<int>(type: "integer", nullable: false),
                    InvoiceDetailsId = table.Column<int>(type: "integer", nullable: false),
                    UserId = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Orders", x => x.OrderId);
                    table.ForeignKey(
                        name: "FK_Orders_InvoiceDetails_InvoiceDetailsId",
                        column: x => x.InvoiceDetailsId,
                        principalTable: "InvoiceDetails",
                        principalColumn: "InvoiceDetailsId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Orders_JobDetails_JobDetailsId",
                        column: x => x.JobDetailsId,
                        principalTable: "JobDetails",
                        principalColumn: "JobDetailsId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Orders_TimeSlot_TimeSlotId",
                        column: x => x.TimeSlotId,
                        principalTable: "TimeSlot",
                        principalColumn: "TimeSlotId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Orders_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "TimeSlot",
                columns: new[] { "TimeSlotId", "EndDate", "IsAvailable", "StartDate" },
                values: new object[,]
                {
                    { 1, new DateTime(2024, 10, 28, 11, 0, 0, 0, DateTimeKind.Utc), true, new DateTime(2024, 10, 28, 10, 0, 0, 0, DateTimeKind.Utc) },
                    { 2, new DateTime(2024, 10, 28, 12, 0, 0, 0, DateTimeKind.Utc), true, new DateTime(2024, 10, 28, 11, 0, 0, 0, DateTimeKind.Utc) },
                    { 3, new DateTime(2024, 10, 28, 13, 0, 0, 0, DateTimeKind.Utc), false, new DateTime(2024, 10, 28, 12, 0, 0, 0, DateTimeKind.Utc) }
                });

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "UserId", "Email", "FullName", "PasswordHash", "Role", "Username" },
                values: new object[] { 1, "admin@gmail.com", "Adam", "$2a$12$6Ck2f2SZA77ETUZ.buJG2.Ql8lo1p65fiF.JEtGZPVxDkJPhimrTm", "Admin", "Boss" });

            migrationBuilder.CreateIndex(
                name: "IX_Orders_InvoiceDetailsId",
                table: "Orders",
                column: "InvoiceDetailsId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Orders_JobDetailsId",
                table: "Orders",
                column: "JobDetailsId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Orders_TimeSlotId",
                table: "Orders",
                column: "TimeSlotId");

            migrationBuilder.CreateIndex(
                name: "IX_Orders_UserId",
                table: "Orders",
                column: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Orders");

            migrationBuilder.DropTable(
                name: "InvoiceDetails");

            migrationBuilder.DropTable(
                name: "JobDetails");

            migrationBuilder.DropTable(
                name: "TimeSlot");

            migrationBuilder.DropTable(
                name: "Users");
        }
    }
}
