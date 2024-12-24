using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace qelec.Migrations
{
    /// <inheritdoc />
    public partial class initialcreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "CostBreakdown",
                columns: table => new
                {
                    CostBreakdownId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    LaborCost = table.Column<decimal>(type: "numeric", nullable: false),
                    ParkingCost = table.Column<decimal>(type: "numeric", nullable: false),
                    TotalCongestionCharge = table.Column<decimal>(type: "numeric", nullable: false),
                    CommutingCost = table.Column<decimal>(type: "numeric", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CostBreakdown", x => x.CostBreakdownId);
                });

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
                name: "JobAddress",
                columns: table => new
                {
                    JobAddressId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Postcode = table.Column<string>(type: "text", nullable: false),
                    Street = table.Column<string>(type: "text", nullable: false),
                    City = table.Column<string>(type: "text", nullable: false),
                    PaidOnStreet = table.Column<bool>(type: "boolean", nullable: false),
                    VisitorPermit = table.Column<bool>(type: "boolean", nullable: false),
                    CongestionCharge = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_JobAddress", x => x.JobAddressId);
                });

            migrationBuilder.CreateTable(
                name: "MultiplierDetails",
                columns: table => new
                {
                    MultiplierDetailsId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Start = table.Column<string>(type: "text", nullable: false),
                    End = table.Column<string>(type: "text", nullable: false),
                    Multiplier = table.Column<decimal>(type: "numeric", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MultiplierDetails", x => x.MultiplierDetailsId);
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
                name: "JobDetails",
                columns: table => new
                {
                    JobDetailsId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    ClientName = table.Column<string>(type: "text", nullable: true),
                    SiteAccessInfo = table.Column<string>(type: "text", nullable: true),
                    Mobile = table.Column<string>(type: "text", nullable: true),
                    ClientEmail = table.Column<string>(type: "text", nullable: true),
                    YourReference = table.Column<string>(type: "text", nullable: true),
                    AdditionalInfo = table.Column<string>(type: "text", nullable: true),
                    JobAddressId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_JobDetails", x => x.JobDetailsId);
                    table.ForeignKey(
                        name: "FK_JobDetails_JobAddress_JobAddressId",
                        column: x => x.JobAddressId,
                        principalTable: "JobAddress",
                        principalColumn: "JobAddressId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "EstimateDetails",
                columns: table => new
                {
                    EstimateDetailsId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    JobDescription = table.Column<string>(type: "text", nullable: false),
                    GeneratedTime = table.Column<decimal>(type: "numeric", nullable: false),
                    CalculatedCost = table.Column<decimal>(type: "numeric", nullable: false),
                    PaidOnStreet = table.Column<bool>(type: "boolean", nullable: false),
                    CongestionCharge = table.Column<bool>(type: "boolean", nullable: false),
                    Postcode = table.Column<string>(type: "text", nullable: false),
                    PostcodeTierCost = table.Column<decimal>(type: "numeric", nullable: false),
                    MultiplierDetailsId = table.Column<int>(type: "integer", nullable: true),
                    CostBreakdownId = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EstimateDetails", x => x.EstimateDetailsId);
                    table.ForeignKey(
                        name: "FK_EstimateDetails_CostBreakdown_CostBreakdownId",
                        column: x => x.CostBreakdownId,
                        principalTable: "CostBreakdown",
                        principalColumn: "CostBreakdownId");
                    table.ForeignKey(
                        name: "FK_EstimateDetails_MultiplierDetails_MultiplierDetailsId",
                        column: x => x.MultiplierDetailsId,
                        principalTable: "MultiplierDetails",
                        principalColumn: "MultiplierDetailsId");
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
                    JobAddressId = table.Column<int>(type: "integer", nullable: false),
                    EstimateDetailsId = table.Column<int>(type: "integer", nullable: false),
                    UserId = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Orders", x => x.OrderId);
                    table.ForeignKey(
                        name: "FK_Orders_EstimateDetails_EstimateDetailsId",
                        column: x => x.EstimateDetailsId,
                        principalTable: "EstimateDetails",
                        principalColumn: "EstimateDetailsId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Orders_InvoiceDetails_InvoiceDetailsId",
                        column: x => x.InvoiceDetailsId,
                        principalTable: "InvoiceDetails",
                        principalColumn: "InvoiceDetailsId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Orders_JobAddress_JobAddressId",
                        column: x => x.JobAddressId,
                        principalTable: "JobAddress",
                        principalColumn: "JobAddressId",
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
                name: "IX_EstimateDetails_CostBreakdownId",
                table: "EstimateDetails",
                column: "CostBreakdownId");

            migrationBuilder.CreateIndex(
                name: "IX_EstimateDetails_MultiplierDetailsId",
                table: "EstimateDetails",
                column: "MultiplierDetailsId");

            migrationBuilder.CreateIndex(
                name: "IX_JobDetails_JobAddressId",
                table: "JobDetails",
                column: "JobAddressId");

            migrationBuilder.CreateIndex(
                name: "IX_Orders_EstimateDetailsId",
                table: "Orders",
                column: "EstimateDetailsId");

            migrationBuilder.CreateIndex(
                name: "IX_Orders_InvoiceDetailsId",
                table: "Orders",
                column: "InvoiceDetailsId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Orders_JobAddressId",
                table: "Orders",
                column: "JobAddressId");

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
                name: "EstimateDetails");

            migrationBuilder.DropTable(
                name: "InvoiceDetails");

            migrationBuilder.DropTable(
                name: "JobDetails");

            migrationBuilder.DropTable(
                name: "TimeSlot");

            migrationBuilder.DropTable(
                name: "Users");

            migrationBuilder.DropTable(
                name: "CostBreakdown");

            migrationBuilder.DropTable(
                name: "MultiplierDetails");

            migrationBuilder.DropTable(
                name: "JobAddress");
        }
    }
}
