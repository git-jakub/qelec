using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;
using qelec;
using qelec.Services;
using qelec.Models;
using System.IdentityModel.Tokens.Jwt;
using qelec.Controllers;
using FluentEmail.Core;
using FluentEmail.Smtp;
using System.Net.Mail;
using System.Net;
using Twilio;
using Twilio.Clients;
using Twilio.Rest.Api.V2010.Account;

var builder = WebApplication.CreateBuilder(args);

// Add controllers to the service container
builder.Services.AddControllers();

// Register HttpClient for PostcodeController
builder.Services.AddHttpClient<PostcodeController>();

// Configure JWT authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
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

        options.Events = new JwtBearerEvents
        {
            OnTokenValidated = context =>
            {
                var claims = context.Principal?.Claims;
                foreach (var claim in claims)
                {
                    Console.WriteLine($"Claim {claim.Type}: {claim.Value}");
                }
                return Task.CompletedTask;
            }
        };
    });

// Configure CORS policy to allow access from specific frontend sources
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(
                "http://localhost:3000",
                "https://localhost:3000",
                "http://qelectric.net",
                "https://qelectric.net",
                "http://www.qelectric.net",
                "https://www.qelectric.net")
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// Configure PostgreSQL database context
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(connectionString));

// Register services for Dependency Injection
builder.Services.AddScoped<InvoiceService>();
builder.Services.AddScoped<OpenAIService>();
builder.Services.AddScoped<EmailService>();
builder.Services.AddSingleton<WhatsAppService>();

// Configure Twilio WhatsApp Service
builder.Services.AddSingleton<WhatsAppService>(provider =>
{
    var configuration = provider.GetRequiredService<IConfiguration>();
    var accountSid = configuration["Twilio:AccountSID"];
    var authToken = configuration["Twilio:AuthToken"];
    var fromNumber = configuration["Twilio:WhatsAppNumber"];
    Console.WriteLine($"[DEBUG] Account SID: {accountSid}");
    Console.WriteLine($"[DEBUG] Auth Token: {authToken?.Substring(0, 4)}... (masked)");
    Console.WriteLine($"[DEBUG] Twilio Phone Number: {fromNumber}");

    // Initialize Twilio Client
    TwilioClient.Init(accountSid, authToken);

    return new WhatsAppService(accountSid, authToken, fromNumber);
});

// Configure FluentEmail for SMTP
//builder.Services.AddFluentEmail("qelectriclimited@gmail.com")
//    .AddRazorRenderer() // Optional: For rendering email templates
//    .AddSmtpSender(new SmtpClient("smtp.gmail.com")
//    {
//        Port = 587,
//        Credentials = new NetworkCredential("qelectriclimited@gmail.com", "your-email-password"), // Replace with your credentials
//        EnableSsl = true
//    });

// Enable Swagger for API documentation and testing
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "qelec", Version = "v1" });

    // Add security definition for Bearer token
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        In = ParameterLocation.Header,
        Description = "Please enter JWT with Bearer into field",
        Name = "Authorization",
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    // Set security requirement for all endpoints
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

var app = builder.Build();

// Enable Swagger UI for API testing
app.UseSwagger();
app.UseSwaggerUI();

// Enforce HTTPS redirection for additional security
app.UseHttpsRedirection();

// Apply CORS policy before authentication and authorization
app.UseCors("AllowFrontend");

// Middleware to log authenticated user claims
app.Use(async (context, next) =>
{
    if (context.User.Identity?.IsAuthenticated ?? false)
    {
        Console.WriteLine("Authenticated user. Claims:");
        foreach (var claim in context.User.Claims)
        {
            Console.WriteLine($"{claim.Type}: {claim.Value}");
        }
    }
    else
    {
        Console.WriteLine("User is not authenticated.");
    }

    await next();
});

// Enable middleware for authentication and authorization
app.UseAuthentication();
app.UseAuthorization();

// Map controllers to API endpoints
app.MapControllers();

// Run the application
app.Run();
