using Microsoft.AspNetCore.Mvc;
using qelec.Models; 
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace qelec.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UserController(AppDbContext context)
        {
            _context = context;
        }

        // POST: api/user/login
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] UserLoginDto loginDto)
        {
            // Find user by email (or username, if applicable)
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == loginDto.Email);

            if (user == null || !VerifyPassword(loginDto.Password, user.PasswordHash))
            {
                return Unauthorized("Invalid credentials");
            }

            // (Optional) Generate a token for authenticated sessions
            var token = GenerateJwtToken(user); // Placeholder function

            return Ok(new { token, userId = user.UserId });
        }

        // Utility method to verify passwords
        private bool VerifyPassword(string enteredPassword, string storedPasswordHash)
        {
            // Add password verification logic here (e.g., hashing comparison)
            return enteredPassword == storedPasswordHash; // Placeholder for simplicity
        }

        // Utility method to generate JWT tokens (optional for session handling)
        private string GenerateJwtToken(User user)
        {
            // Implement token generation (JWT)
            return "sample_token"; // Placeholder
        }
    }
}
