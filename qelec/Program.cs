using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;
using qelec;
using qelec.Services;
using System.IdentityModel.Tokens.Jwt;
using qelec.Controllers;

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
        policy.WithOrigins("http://localhost:3000", "https://localhost:3000", "http://qelectric.net", "https://qelectric.net", "http://www.qelectric.net", "https://www.qelectric.net")
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
