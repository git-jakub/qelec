using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using qelec.Models;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using qelec.Models.DTOs;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace qelec.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;
        private readonly ILogger<UserController> _logger;

        public UserController(AppDbContext context, IConfiguration configuration, ILogger<UserController> logger)
        {
            _context = context;
            _configuration = configuration;
            _logger = logger;
        }

        // POST: api/user/login
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] UserLoginDto loginDto)
        {
            if (string.IsNullOrEmpty(_configuration["Jwt:SecretKey"]))
            {
                _logger.LogError("SecretKey for JWT is not configured.");
                return StatusCode(500, "SecretKey for JWT is not configured.");
            }

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == loginDto.Email);
            if (user == null || !VerifyPassword(loginDto.Password, user.PasswordHash))
            {
                return Unauthorized("Invalid credentials");
            }

            try
            {
                var token = GenerateJwtToken(user);
                return Ok(new { token, userId = user.UserId, userRole = user.Role, userName = user.Username });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error generating JWT token.");
                return StatusCode(500, "Internal server error during token generation.");
            }
        }

        // POST: api/user/register - Registers a new user
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] UserRegisterDto registerDto)
        {
            if (await _context.Users.AnyAsync(u => u.Email == registerDto.Email))
            {
                return BadRequest("Email is already registered.");
            }

            var newUser = new User
            {
                Email = registerDto.Email,
                Username = registerDto.Username,
                Role = registerDto.Role,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(registerDto.Password)
            };

            _context.Users.Add(newUser);
            await _context.SaveChangesAsync();

            return Ok("User registered successfully.");
        }

        // GET: api/user/me - Gets details of the currently authenticated user
        [HttpGet("me")]
        [Authorize]
        public async Task<IActionResult> GetCurrentUser()
        {
            var userIdClaim = User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value;
            if (!int.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized("Invalid token.");
            }

            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                return NotFound("User not found.");
            }

            return Ok(new { user.UserId, user.Email, user.Username, user.Role });
        }

        // Utility method to verify passwords using BCrypt
        private bool VerifyPassword(string enteredPassword, string storedPasswordHash)
        {
            return BCrypt.Net.BCrypt.Verify(enteredPassword, storedPasswordHash);
        }

        // Utility method to generate JWT tokens
        private string GenerateJwtToken(User user)
        {
            var secretKey = _configuration["Jwt:SecretKey"];
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.UserId.ToString()),
                new Claim(JwtRegisteredClaimNames.Email, user.Email),
                new Claim("role", user.Role),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(30),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
