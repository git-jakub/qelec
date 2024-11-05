using System.ComponentModel.DataAnnotations;

namespace qelec.Models
{
    public class User
    {
        [Key]
        public int UserId { get; set; }

        [Required]
        public string Username { get; set; } // Unique username for login

        [Required]
        [EmailAddress]
        public string Email { get; set; } // Email for notifications

        [Required]
        public string PasswordHash { get; set; } // Hashed password for security

        public string FullName { get; set; } // Optional full name

        public string Role { get; set; } // 
    }
}