using System.ComponentModel.DataAnnotations;

namespace qelec.Models.DTOs
{
    public class ForgotPasswordDto
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }
    }


}
