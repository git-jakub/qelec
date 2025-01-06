// Models/DTOs/UserRegisterDto.cs
namespace qelec.Models.DTOs
{
    public class UserRegisterDto
    {
        public string Email { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public string FullName { get; set; } // e.g., "Customer", "Admin", etc.
    }
}
