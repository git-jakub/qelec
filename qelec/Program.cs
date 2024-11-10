using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using qelec;
using qelec.Services;

var builder = WebApplication.CreateBuilder(args);

// Dodanie kontrolerów do kontenera usług
builder.Services.AddControllers();

// Konfiguracja uwierzytelniania JWT
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

// Konfiguracja polityki CORS, aby umożliwić dostęp z określonych źródeł frontendowych
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:3000", "http://qelectric.net", "https://qelectric.net", "http://www.qelectric.net", "https://www.qelectric.net")
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// Konfiguracja kontekstu bazy danych PostgreSQL
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(connectionString));

// Rejestracja serwisu InvoiceService do Dependency Injection
builder.Services.AddScoped<InvoiceService>();
//Rejestracja API
builder.Services.AddScoped<OpenAIService>();

// Włączenie Swaggera dla dokumentacji i testowania API
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Włączenie Swagger UI do testowania API
app.UseSwagger();
app.UseSwaggerUI();

// Wymuszenie przekierowania na HTTPS dla dodatkowego zabezpieczenia
app.UseHttpsRedirection();

// Zastosowanie polityki CORS przed uwierzytelnianiem i autoryzacją
app.UseCors("AllowFrontend");

// Włączenie middleware do obsługi uwierzytelniania i autoryzacji
app.UseAuthentication();
app.UseAuthorization();

// Mapowanie kontrolerów do endpointów API
app.MapControllers();

// Uruchomienie aplikacji
app.Run();
