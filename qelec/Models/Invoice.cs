using System.ComponentModel.DataAnnotations;

public class Invoice
{
    [Key]
    public int InvoiceId { get; set; }
    public string RecipientEmail { get; set; }
    public DateTime SentDate { get; set; }
    public string FilePath { get; set; } // Ścieżka do pliku PDF
    public string Status { get; set; } // Wysłano, Niepowodzenie, etc.
}
