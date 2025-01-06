using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using qelec.Models;
using qelec.Models.DTOs;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using BCrypt.Net;
using qelec.Services;
using Microsoft.AspNetCore.Authorization;

namespace qelec.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;
        private readonly ILogger<UserController> _logger;
        private readonly EmailService _emailService; // Add EmailService

        public UserController(AppDbContext context, IConfiguration configuration, ILogger<UserController> logger, EmailService emailService)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
            _configuration = configuration ?? throw new ArgumentNullException(nameof(configuration));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _emailService = emailService ?? throw new ArgumentNullException(nameof(emailService));
        }


        // POST: api/user/login
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] UserLoginDto loginDto)
        {
            var secretKey = _configuration["Jwt:SecretKey"];
            if (string.IsNullOrEmpty(secretKey))
            {
                _logger.LogError("JWT SecretKey is not configured.");
                return StatusCode(500, "JWT SecretKey is not configured.");
            }

            _logger.LogInformation("Using JWT SecretKey for login."); // Debug log

            // Find user by email
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == loginDto.Email);

            if (user == null || !VerifyPassword(loginDto.Password, user.PasswordHash))
            {
                return Unauthorized("Invalid credentials.");
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

        // POST: api/user/register
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] UserRegisterDto registerDto)
        {
            if (registerDto == null)
            {
                return BadRequest("Invalid registration data.");
            }

            // Check if the email is already in use
            var existingUser = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == registerDto.Email);

            if (existingUser != null)
            {
                return BadRequest("A user with this email already exists.");
            }

            // Hash the password and create a new user
            var hashedPassword = BCrypt.Net.BCrypt.HashPassword(registerDto.Password);
            var newUser = new User
            {
                Email = registerDto.Email,
                Username = registerDto.Username,
                PasswordHash = hashedPassword,
                FullName = registerDto.FullName,
                Role = "Customer" // Default role assignment
            };

            try
            {
                _context.Users.Add(newUser);
                await _context.SaveChangesAsync();

                _logger.LogInformation($"User {newUser.Username} registered successfully with default role 'Customer'.");
                return Ok(new { Message = "User registration successful." });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error registering a new user.");
                return StatusCode(500, "Internal server error during registration.");
            }
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto resetPasswordDto)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.ResetToken == resetPasswordDto.Token && u.ResetTokenExpiry > DateTime.UtcNow);
            if (user == null)
            {
                return BadRequest(new { message = "Invalid or expired token." });
            }

            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(resetPasswordDto.NewPassword);
            user.ResetToken = null;
            user.ResetTokenExpiry = null;
            await _context.SaveChangesAsync();

            return Ok(new { message = "Password reset successful." });
        }

        [HttpPost("request-password-reset")]
        public async Task<IActionResult> RequestPasswordReset([FromBody] ForgotPasswordDto forgotPasswordDto)
        {
            // Find the user by email
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == forgotPasswordDto.Email);
            if (user == null)
            {
                return BadRequest(new { message = "User not found." });
            }

            // Generate a password reset token
            user.ResetToken = Guid.NewGuid().ToString();
            user.ResetTokenExpiry = DateTime.UtcNow.AddHours(1);

            await _context.SaveChangesAsync();

            // Construct the email body
            string resetLink = $"http://localhost:3000/reset-password?token={user.ResetToken}";
            string emailBody = $@"
        Hi {user.FullName ?? "User"},
        <br/><br/>
        You requested a password reset. Please click the link below to reset your password:
        <br/>
        <a href='{resetLink}'>Reset Password</a>
        <br/><br/>
        If you did not request this, please ignore this email.";

            // Send the password reset email
            try
            {
                var success = await _emailService.SendEmailAsync(
                    user.Email,               // ToEmail
                    "Password Reset Request", // Subject
                    emailBody                 // Body
                );

                if (success)
                {
                    return Ok(new { message = "Password reset email sent." });
                }
                else
                {
                    return StatusCode(500, new { message = "Failed to send email." });
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in RequestPasswordReset: {ex.Message}");
                return StatusCode(500, new { message = "An error occurred while sending the password reset email." });
            }
        }

        [HttpGet]
        [Route("")]
        [Authorize(Roles = "Admin")] // Only admins can access this
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _context.Users
                .Select(u => new
                {
                    u.UserId,
                    u.Username,
                    u.Email,
                    u.FullName,
                    u.Role
                })
                .ToListAsync();

            return Ok(users);
        }

        [HttpPost]
        [Route("")]
        [Authorize(Roles = "Admin")] // Only admins can add new users
        public async Task<IActionResult> AddUser([FromBody] UserRegisterDto registerDto)
        {
            if (registerDto == null)
            {
                return BadRequest("Invalid user data.");
            }

            var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == registerDto.Email);
            if (existingUser != null)
            {
                return BadRequest("A user with this email already exists.");
            }

            var hashedPassword = BCrypt.Net.BCrypt.HashPassword(registerDto.Password);
            var newUser = new User
            {
                Email = registerDto.Email,
                Username = registerDto.Username,
                PasswordHash = hashedPassword,
                FullName = registerDto.FullName,
            //    Role = registerDto.Role // Allow role assignment
            };

            _context.Users.Add(newUser);
            await _context.SaveChangesAsync();

            return Ok(new { message = "User added successfully.", user = newUser });
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")] // Only admins can update users
        public async Task<IActionResult> EditUser(int id, [FromBody] UserEditDto editDto)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound("User not found.");
            }

            user.Username = editDto.Username ?? user.Username;
            user.FullName = editDto.FullName ?? user.FullName;
            user.Email = editDto.Email ?? user.Email;
            user.Role = editDto.Role ?? user.Role;

            await _context.SaveChangesAsync();

            return Ok(new { message = "User updated successfully.", user });
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")] // Only admins can delete users
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound("User not found.");
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return Ok(new { message = "User deleted successfully." });
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
            if (string.IsNullOrEmpty(secretKey))
            {
                throw new ArgumentNullException("Jwt:SecretKey", "Secret key for JWT cannot be null or empty.");
            }

            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.UserId.ToString()),
                new Claim(JwtRegisteredClaimNames.Email, user.Email),
                new Claim("role", user.Role),
                new Claim("userName", user.Username),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddMinutes(30),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
