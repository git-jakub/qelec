using qelec;
using Microsoft.EntityFrameworkCore;
using Npgsql.EntityFrameworkCore.PostgreSQL;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddControllers();

// Add a CORS policy to allow requests from the frontend application
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://qelectric.net", "https://qelectric.net", "https://www.qelectric.net")
             .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// Add the database context configuration for PostgreSQL
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(connectionString)); // Use UseNpgsql for PostgreSQL

// Enable Swagger for API documentation and testing
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Enable Swagger for both development and production
app.UseSwagger();
app.UseSwaggerUI();

// Redirect HTTP to HTTPS for added security
app.UseHttpsRedirection();

// Enable the CORS policy before routing or authorization to allow cross-origin requests
app.UseCors("AllowFrontend");

// Enable routing and authorization for secure access to endpoints
app.UseAuthorization();

// Map controllers to endpoint routing
app.MapControllers();

// Run the application
app.Run();
