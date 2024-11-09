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

        // Navigation property for related Orders
        public ICollection<Order> Orders { get; set; }  // Ensure this collection exists for the one-to-many relationship
    }
}
