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
                name: "Orders",
                columns: table => new
                {
                    OrderId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    TimeSlotId = table.Column<int>(type: "integer", nullable: false),
                    JobDetails = table.Column<string>(type: "text", nullable: false),
                    InvoiceDetails = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Orders", x => x.OrderId);
                });

            migrationBuilder.CreateTable(
                name: "TimeSlot",
                columns: table => new
                {
                    TimeSlotId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Date = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Time = table.Column<string>(type: "text", nullable: false),
                    IsAvailable = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TimeSlot", x => x.TimeSlotId);
                });

            migrationBuilder.InsertData(
                table: "TimeSlot",
                columns: new[] { "TimeSlotId", "Date", "IsAvailable", "Time" },
                values: new object[,]
                {
                    { 1, new DateTime(2024, 10, 28, 0, 0, 0, 0, DateTimeKind.Utc), true, "10:00" },
                    { 2, new DateTime(2024, 10, 28, 0, 0, 0, 0, DateTimeKind.Utc), true, "11:00" },
                    { 3, new DateTime(2024, 10, 28, 0, 0, 0, 0, DateTimeKind.Utc), false, "12:00" },
                    { 4, new DateTime(2024, 10, 29, 0, 0, 0, 0, DateTimeKind.Utc), true, "13:00" },
                    { 5, new DateTime(2024, 10, 29, 0, 0, 0, 0, DateTimeKind.Utc), false, "14:00" },
                    { 6, new DateTime(2024, 11, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, "10:00" },
                    { 7, new DateTime(2024, 11, 1, 0, 0, 0, 0, DateTimeKind.Utc), true, "11:00" },
                    { 8, new DateTime(2024, 11, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, "12:00" },
                    { 9, new DateTime(2024, 11, 1, 0, 0, 0, 0, DateTimeKind.Utc), true, "13:00" },
                    { 10, new DateTime(2024, 11, 1, 0, 0, 0, 0, DateTimeKind.Utc), false, "14:00" },
                    { 11, new DateTime(2024, 11, 2, 0, 0, 0, 0, DateTimeKind.Utc), true, "10:00" },
                    { 12, new DateTime(2024, 11, 2, 0, 0, 0, 0, DateTimeKind.Utc), false, "11:00" },
                    { 13, new DateTime(2024, 11, 2, 0, 0, 0, 0, DateTimeKind.Utc), true, "12:00" },
                    { 14, new DateTime(2024, 11, 2, 0, 0, 0, 0, DateTimeKind.Utc), false, "13:00" },
                    { 15, new DateTime(2024, 11, 2, 0, 0, 0, 0, DateTimeKind.Utc), true, "14:00" },
                    { 16, new DateTime(2024, 11, 3, 0, 0, 0, 0, DateTimeKind.Utc), false, "10:00" },
                    { 17, new DateTime(2024, 11, 3, 0, 0, 0, 0, DateTimeKind.Utc), true, "11:00" },
                    { 18, new DateTime(2024, 11, 3, 0, 0, 0, 0, DateTimeKind.Utc), false, "12:00" },
                    { 19, new DateTime(2024, 11, 3, 0, 0, 0, 0, DateTimeKind.Utc), true, "13:00" },
                    { 20, new DateTime(2024, 11, 3, 0, 0, 0, 0, DateTimeKind.Utc), false, "14:00" },
                    { 21, new DateTime(2024, 11, 4, 0, 0, 0, 0, DateTimeKind.Utc), true, "10:00" },
                    { 22, new DateTime(2024, 11, 4, 0, 0, 0, 0, DateTimeKind.Utc), false, "11:00" },
                    { 23, new DateTime(2024, 11, 4, 0, 0, 0, 0, DateTimeKind.Utc), true, "12:00" },
                    { 24, new DateTime(2024, 11, 4, 0, 0, 0, 0, DateTimeKind.Utc), false, "13:00" },
                    { 25, new DateTime(2024, 11, 4, 0, 0, 0, 0, DateTimeKind.Utc), true, "14:00" },
                    { 26, new DateTime(2024, 11, 5, 0, 0, 0, 0, DateTimeKind.Utc), false, "10:00" },
                    { 27, new DateTime(2024, 11, 5, 0, 0, 0, 0, DateTimeKind.Utc), true, "11:00" },
                    { 28, new DateTime(2024, 11, 5, 0, 0, 0, 0, DateTimeKind.Utc), false, "12:00" },
                    { 29, new DateTime(2024, 11, 5, 0, 0, 0, 0, DateTimeKind.Utc), true, "13:00" },
                    { 30, new DateTime(2024, 11, 5, 0, 0, 0, 0, DateTimeKind.Utc), false, "14:00" },
                    { 31, new DateTime(2024, 11, 6, 0, 0, 0, 0, DateTimeKind.Utc), true, "10:00" },
                    { 32, new DateTime(2024, 11, 6, 0, 0, 0, 0, DateTimeKind.Utc), false, "11:00" },
                    { 33, new DateTime(2024, 11, 6, 0, 0, 0, 0, DateTimeKind.Utc), true, "12:00" },
                    { 34, new DateTime(2024, 11, 6, 0, 0, 0, 0, DateTimeKind.Utc), false, "13:00" },
                    { 35, new DateTime(2024, 11, 6, 0, 0, 0, 0, DateTimeKind.Utc), true, "14:00" },
                    { 36, new DateTime(2024, 11, 7, 0, 0, 0, 0, DateTimeKind.Utc), false, "10:00" },
                    { 37, new DateTime(2024, 11, 7, 0, 0, 0, 0, DateTimeKind.Utc), true, "11:00" },
                    { 38, new DateTime(2024, 11, 7, 0, 0, 0, 0, DateTimeKind.Utc), false, "12:00" },
                    { 39, new DateTime(2024, 11, 7, 0, 0, 0, 0, DateTimeKind.Utc), true, "13:00" },
                    { 40, new DateTime(2024, 11, 7, 0, 0, 0, 0, DateTimeKind.Utc), false, "14:00" },
                    { 41, new DateTime(2024, 11, 8, 0, 0, 0, 0, DateTimeKind.Utc), true, "10:00" },
                    { 42, new DateTime(2024, 11, 8, 0, 0, 0, 0, DateTimeKind.Utc), false, "11:00" },
                    { 43, new DateTime(2024, 11, 8, 0, 0, 0, 0, DateTimeKind.Utc), true, "12:00" },
                    { 44, new DateTime(2024, 11, 8, 0, 0, 0, 0, DateTimeKind.Utc), false, "13:00" },
                    { 45, new DateTime(2024, 11, 8, 0, 0, 0, 0, DateTimeKind.Utc), true, "14:00" },
                    { 46, new DateTime(2024, 11, 9, 0, 0, 0, 0, DateTimeKind.Utc), false, "10:00" },
                    { 47, new DateTime(2024, 11, 9, 0, 0, 0, 0, DateTimeKind.Utc), true, "11:00" },
                    { 48, new DateTime(2024, 11, 9, 0, 0, 0, 0, DateTimeKind.Utc), false, "12:00" },
                    { 49, new DateTime(2024, 11, 9, 0, 0, 0, 0, DateTimeKind.Utc), true, "13:00" },
                    { 50, new DateTime(2024, 11, 9, 0, 0, 0, 0, DateTimeKind.Utc), false, "14:00" },
                    { 51, new DateTime(2024, 11, 10, 0, 0, 0, 0, DateTimeKind.Utc), true, "10:00" },
                    { 52, new DateTime(2024, 11, 10, 0, 0, 0, 0, DateTimeKind.Utc), false, "11:00" },
                    { 53, new DateTime(2024, 11, 10, 0, 0, 0, 0, DateTimeKind.Utc), true, "12:00" },
                    { 54, new DateTime(2024, 11, 10, 0, 0, 0, 0, DateTimeKind.Utc), false, "13:00" },
                    { 55, new DateTime(2024, 11, 10, 0, 0, 0, 0, DateTimeKind.Utc), true, "14:00" },
                    { 56, new DateTime(2024, 11, 11, 0, 0, 0, 0, DateTimeKind.Utc), false, "10:00" },
                    { 57, new DateTime(2024, 11, 11, 0, 0, 0, 0, DateTimeKind.Utc), true, "11:00" },
                    { 58, new DateTime(2024, 11, 11, 0, 0, 0, 0, DateTimeKind.Utc), false, "12:00" },
                    { 59, new DateTime(2024, 11, 11, 0, 0, 0, 0, DateTimeKind.Utc), true, "13:00" },
                    { 60, new DateTime(2024, 11, 11, 0, 0, 0, 0, DateTimeKind.Utc), false, "14:00" },
                    { 61, new DateTime(2024, 11, 12, 0, 0, 0, 0, DateTimeKind.Utc), true, "10:00" },
                    { 62, new DateTime(2024, 11, 12, 0, 0, 0, 0, DateTimeKind.Utc), false, "11:00" },
                    { 63, new DateTime(2024, 11, 12, 0, 0, 0, 0, DateTimeKind.Utc), true, "12:00" },
                    { 64, new DateTime(2024, 11, 12, 0, 0, 0, 0, DateTimeKind.Utc), false, "13:00" },
                    { 65, new DateTime(2024, 11, 12, 0, 0, 0, 0, DateTimeKind.Utc), true, "14:00" },
                    { 66, new DateTime(2024, 11, 13, 0, 0, 0, 0, DateTimeKind.Utc), false, "10:00" },
                    { 67, new DateTime(2024, 11, 13, 0, 0, 0, 0, DateTimeKind.Utc), true, "11:00" },
                    { 68, new DateTime(2024, 11, 13, 0, 0, 0, 0, DateTimeKind.Utc), false, "12:00" },
                    { 69, new DateTime(2024, 11, 13, 0, 0, 0, 0, DateTimeKind.Utc), true, "13:00" },
                    { 70, new DateTime(2024, 11, 13, 0, 0, 0, 0, DateTimeKind.Utc), false, "14:00" },
                    { 71, new DateTime(2024, 11, 14, 0, 0, 0, 0, DateTimeKind.Utc), true, "10:00" },
                    { 72, new DateTime(2024, 11, 14, 0, 0, 0, 0, DateTimeKind.Utc), false, "11:00" },
                    { 73, new DateTime(2024, 11, 14, 0, 0, 0, 0, DateTimeKind.Utc), true, "12:00" },
                    { 74, new DateTime(2024, 11, 14, 0, 0, 0, 0, DateTimeKind.Utc), false, "13:00" },
                    { 75, new DateTime(2024, 11, 14, 0, 0, 0, 0, DateTimeKind.Utc), true, "14:00" },
                    { 76, new DateTime(2024, 11, 15, 0, 0, 0, 0, DateTimeKind.Utc), false, "10:00" },
                    { 77, new DateTime(2024, 11, 15, 0, 0, 0, 0, DateTimeKind.Utc), true, "11:00" },
                    { 78, new DateTime(2024, 11, 15, 0, 0, 0, 0, DateTimeKind.Utc), false, "12:00" },
                    { 79, new DateTime(2024, 11, 15, 0, 0, 0, 0, DateTimeKind.Utc), true, "13:00" },
                    { 80, new DateTime(2024, 11, 15, 0, 0, 0, 0, DateTimeKind.Utc), false, "14:00" },
                    { 81, new DateTime(2024, 11, 16, 0, 0, 0, 0, DateTimeKind.Utc), true, "10:00" },
                    { 82, new DateTime(2024, 11, 16, 0, 0, 0, 0, DateTimeKind.Utc), false, "11:00" },
                    { 83, new DateTime(2024, 11, 16, 0, 0, 0, 0, DateTimeKind.Utc), true, "12:00" },
                    { 84, new DateTime(2024, 11, 16, 0, 0, 0, 0, DateTimeKind.Utc), false, "13:00" },
                    { 85, new DateTime(2024, 11, 16, 0, 0, 0, 0, DateTimeKind.Utc), true, "14:00" },
                    { 86, new DateTime(2024, 11, 17, 0, 0, 0, 0, DateTimeKind.Utc), false, "10:00" },
                    { 87, new DateTime(2024, 11, 17, 0, 0, 0, 0, DateTimeKind.Utc), true, "11:00" },
                    { 88, new DateTime(2024, 11, 17, 0, 0, 0, 0, DateTimeKind.Utc), false, "12:00" },
                    { 89, new DateTime(2024, 11, 17, 0, 0, 0, 0, DateTimeKind.Utc), true, "13:00" },
                    { 90, new DateTime(2024, 11, 17, 0, 0, 0, 0, DateTimeKind.Utc), false, "14:00" },
                    { 91, new DateTime(2024, 11, 18, 0, 0, 0, 0, DateTimeKind.Utc), true, "10:00" },
                    { 92, new DateTime(2024, 11, 18, 0, 0, 0, 0, DateTimeKind.Utc), false, "11:00" },
                    { 93, new DateTime(2024, 11, 18, 0, 0, 0, 0, DateTimeKind.Utc), true, "12:00" },
                    { 94, new DateTime(2024, 11, 18, 0, 0, 0, 0, DateTimeKind.Utc), false, "13:00" },
                    { 95, new DateTime(2024, 11, 18, 0, 0, 0, 0, DateTimeKind.Utc), true, "14:00" },
                    { 96, new DateTime(2024, 11, 19, 0, 0, 0, 0, DateTimeKind.Utc), false, "10:00" },
                    { 97, new DateTime(2024, 11, 19, 0, 0, 0, 0, DateTimeKind.Utc), true, "11:00" },
                    { 98, new DateTime(2024, 11, 19, 0, 0, 0, 0, DateTimeKind.Utc), false, "12:00" },
                    { 99, new DateTime(2024, 11, 19, 0, 0, 0, 0, DateTimeKind.Utc), true, "13:00" },
                    { 100, new DateTime(2024, 11, 19, 0, 0, 0, 0, DateTimeKind.Utc), false, "14:00" },
                    { 101, new DateTime(2024, 11, 20, 0, 0, 0, 0, DateTimeKind.Utc), true, "10:00" },
                    { 102, new DateTime(2024, 11, 20, 0, 0, 0, 0, DateTimeKind.Utc), false, "11:00" },
                    { 103, new DateTime(2024, 11, 20, 0, 0, 0, 0, DateTimeKind.Utc), true, "12:00" },
                    { 104, new DateTime(2024, 11, 20, 0, 0, 0, 0, DateTimeKind.Utc), false, "13:00" },
                    { 105, new DateTime(2024, 11, 20, 0, 0, 0, 0, DateTimeKind.Utc), true, "14:00" },
                    { 106, new DateTime(2024, 11, 21, 0, 0, 0, 0, DateTimeKind.Utc), false, "10:00" },
                    { 107, new DateTime(2024, 11, 21, 0, 0, 0, 0, DateTimeKind.Utc), true, "11:00" },
                    { 108, new DateTime(2024, 11, 21, 0, 0, 0, 0, DateTimeKind.Utc), false, "12:00" },
                    { 109, new DateTime(2024, 11, 21, 0, 0, 0, 0, DateTimeKind.Utc), true, "13:00" },
                    { 110, new DateTime(2024, 11, 21, 0, 0, 0, 0, DateTimeKind.Utc), false, "14:00" },
                    { 111, new DateTime(2024, 11, 22, 0, 0, 0, 0, DateTimeKind.Utc), true, "10:00" },
                    { 112, new DateTime(2024, 11, 22, 0, 0, 0, 0, DateTimeKind.Utc), false, "11:00" },
                    { 113, new DateTime(2024, 11, 22, 0, 0, 0, 0, DateTimeKind.Utc), true, "12:00" },
                    { 114, new DateTime(2024, 11, 22, 0, 0, 0, 0, DateTimeKind.Utc), false, "13:00" },
                    { 115, new DateTime(2024, 11, 22, 0, 0, 0, 0, DateTimeKind.Utc), true, "14:00" },
                    { 116, new DateTime(2024, 11, 23, 0, 0, 0, 0, DateTimeKind.Utc), false, "10:00" },
                    { 117, new DateTime(2024, 11, 23, 0, 0, 0, 0, DateTimeKind.Utc), true, "11:00" },
                    { 118, new DateTime(2024, 11, 23, 0, 0, 0, 0, DateTimeKind.Utc), false, "12:00" },
                    { 119, new DateTime(2024, 11, 23, 0, 0, 0, 0, DateTimeKind.Utc), true, "13:00" },
                    { 120, new DateTime(2024, 11, 23, 0, 0, 0, 0, DateTimeKind.Utc), false, "14:00" },
                    { 121, new DateTime(2024, 11, 24, 0, 0, 0, 0, DateTimeKind.Utc), true, "10:00" },
                    { 122, new DateTime(2024, 11, 24, 0, 0, 0, 0, DateTimeKind.Utc), false, "11:00" },
                    { 123, new DateTime(2024, 11, 24, 0, 0, 0, 0, DateTimeKind.Utc), true, "12:00" },
                    { 124, new DateTime(2024, 11, 24, 0, 0, 0, 0, DateTimeKind.Utc), false, "13:00" },
                    { 125, new DateTime(2024, 11, 24, 0, 0, 0, 0, DateTimeKind.Utc), true, "14:00" },
                    { 126, new DateTime(2024, 11, 25, 0, 0, 0, 0, DateTimeKind.Utc), false, "10:00" },
                    { 127, new DateTime(2024, 11, 25, 0, 0, 0, 0, DateTimeKind.Utc), true, "11:00" },
                    { 128, new DateTime(2024, 11, 25, 0, 0, 0, 0, DateTimeKind.Utc), false, "12:00" },
                    { 129, new DateTime(2024, 11, 25, 0, 0, 0, 0, DateTimeKind.Utc), true, "13:00" },
                    { 130, new DateTime(2024, 11, 25, 0, 0, 0, 0, DateTimeKind.Utc), false, "14:00" },
                    { 131, new DateTime(2024, 11, 26, 0, 0, 0, 0, DateTimeKind.Utc), true, "10:00" },
                    { 132, new DateTime(2024, 11, 26, 0, 0, 0, 0, DateTimeKind.Utc), false, "11:00" },
                    { 133, new DateTime(2024, 11, 26, 0, 0, 0, 0, DateTimeKind.Utc), true, "12:00" },
                    { 134, new DateTime(2024, 11, 26, 0, 0, 0, 0, DateTimeKind.Utc), false, "13:00" },
                    { 135, new DateTime(2024, 11, 26, 0, 0, 0, 0, DateTimeKind.Utc), true, "14:00" },
                    { 136, new DateTime(2024, 11, 27, 0, 0, 0, 0, DateTimeKind.Utc), false, "10:00" },
                    { 137, new DateTime(2024, 11, 27, 0, 0, 0, 0, DateTimeKind.Utc), true, "11:00" },
                    { 138, new DateTime(2024, 11, 27, 0, 0, 0, 0, DateTimeKind.Utc), false, "12:00" },
                    { 139, new DateTime(2024, 11, 27, 0, 0, 0, 0, DateTimeKind.Utc), true, "13:00" },
                    { 140, new DateTime(2024, 11, 27, 0, 0, 0, 0, DateTimeKind.Utc), false, "14:00" },
                    { 141, new DateTime(2024, 11, 28, 0, 0, 0, 0, DateTimeKind.Utc), true, "10:00" },
                    { 142, new DateTime(2024, 11, 28, 0, 0, 0, 0, DateTimeKind.Utc), false, "11:00" },
                    { 143, new DateTime(2024, 11, 28, 0, 0, 0, 0, DateTimeKind.Utc), true, "12:00" },
                    { 144, new DateTime(2024, 11, 28, 0, 0, 0, 0, DateTimeKind.Utc), false, "13:00" },
                    { 145, new DateTime(2024, 11, 28, 0, 0, 0, 0, DateTimeKind.Utc), true, "14:00" },
                    { 146, new DateTime(2024, 11, 29, 0, 0, 0, 0, DateTimeKind.Utc), false, "10:00" },
                    { 147, new DateTime(2024, 11, 29, 0, 0, 0, 0, DateTimeKind.Utc), true, "11:00" },
                    { 148, new DateTime(2024, 11, 29, 0, 0, 0, 0, DateTimeKind.Utc), false, "12:00" },
                    { 149, new DateTime(2024, 11, 29, 0, 0, 0, 0, DateTimeKind.Utc), true, "13:00" },
                    { 150, new DateTime(2024, 11, 29, 0, 0, 0, 0, DateTimeKind.Utc), false, "14:00" },
                    { 151, new DateTime(2024, 11, 30, 0, 0, 0, 0, DateTimeKind.Utc), true, "10:00" },
                    { 152, new DateTime(2024, 11, 30, 0, 0, 0, 0, DateTimeKind.Utc), false, "11:00" },
                    { 153, new DateTime(2024, 11, 30, 0, 0, 0, 0, DateTimeKind.Utc), true, "12:00" },
                    { 154, new DateTime(2024, 11, 30, 0, 0, 0, 0, DateTimeKind.Utc), false, "13:00" },
                    { 155, new DateTime(2024, 11, 30, 0, 0, 0, 0, DateTimeKind.Utc), true, "14:00" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Orders");

            migrationBuilder.DropTable(
                name: "TimeSlot");
        }
    }
}
