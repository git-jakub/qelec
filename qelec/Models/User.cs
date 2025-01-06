using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace qelec.Models
{
    public class User
    {
        [Key]
        public int UserId { get; set; }

        [Required]
        public string Username { get; set; }

        [Required]
        public string Email { get; set; }

        [Required]
        public string PasswordHash { get; set; }

        public string FullName { get; set; }

        public string Role { get; set; }

        public ICollection<Order> Orders { get; set; }

        // Update ResetToken to be nullable
        public string? ResetToken { get; set; }
        public DateTime? ResetTokenExpiry { get; set; }
    }

}
