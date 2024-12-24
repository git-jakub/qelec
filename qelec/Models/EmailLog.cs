using System.ComponentModel.DataAnnotations;

namespace qelec.Models
{
    public class EmailLog
    {
        [Key]
        public int EmailLogId { get; set; }
        public string RecipientEmail { get; set; }
        public string Subject { get; set; }
        public string Status { get; set; } // Wysłano, Niepowodzenie
        public DateTime SentDate { get; set; }
        public string ErrorMessage { get; set; } // Szczegóły błędu (opcjonalnie)
    }

}
