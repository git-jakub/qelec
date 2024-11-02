using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Npgsql.EntityFrameworkCore.PostgreSQL;
using qelec;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddControllers();

// Add JWT Authentication
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:SecretKey"]))
    };
});

// Add a CORS policy to allow requests from the frontend application
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://qelectric.net", "https://qelectric.net", "https://www.qelectric.net", "http://localhost:3000", "https://localhost:3000")
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

// Enable Swagger for API documentation (development & production)
app.UseSwagger();
app.UseSwaggerUI();

// Redirect HTTP to HTTPS for added security
app.UseHttpsRedirection();

// Enable CORS policy before routing or authorization to allow cross-origin requests
app.UseCors("AllowFrontend");

// Enable authentication and authorization
app.UseAuthentication();
app.UseAuthorization();

// Map controllers to endpoint routing
app.MapControllers();

// Run the application
app.Run();
