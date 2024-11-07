using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace qelec.Models
{
    public class Order
    {
        [Key]
        public int OrderId { get; set; }  // ID zamówienia

        public int TimeSlotId { get; set; }  // ID przypisany do wybranego terminu

        [Required]
        public string Status { get; set; }  // Status of the order (Scheduled, Rescheduled, Unpaid, Completed)

        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;  // Date the order was created
        public DateTime? UpdatedDate { get; set; }  // Date the order was last updated

        [NotMapped]
        public List<string> StatusChangeHistory { get; set; } = new List<string>();  // Track status changes (can be mapped to a separate table if needed)

        // Navigation properties for related entities
        [ForeignKey("JobDetailsId")]
        public int JobDetailsId { get; set; }
        public JobDetails JobDetails { get; set; }  // Matches `jobDetails` in OrderDto

        [ForeignKey("InvoiceDetailsId")]
        public int InvoiceDetailsId { get; set; }
        public InvoiceDetails InvoiceDetails { get; set; }  // Matches `invoiceDetails` in OrderDto
    }
}
