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

        [ForeignKey("TimeSlotId")]
        public int TimeSlotId { get; set; }  // ID przypisany do wybranego terminu
        public virtual TimeSlot? TimeSlot { get; set; }  // Powiązanie z TimeSlot

        [Required]
        public string Status { get; set; }  // Status of the order (Scheduled, Rescheduled, Unpaid, Completed)

        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;  // Date the order was created
        public DateTime? UpdatedDate { get; set; }  // Date the order was last updated

        [NotMapped]
        public List<string> StatusChangeHistory { get; set; } = new List<string>();  // Track status changes

        [ForeignKey("JobDetailsId")]
        public int JobDetailsId { get; set; }
        public JobDetails JobDetails { get; set; }  // Matches `jobDetails` in OrderDto

        [ForeignKey("InvoiceDetailsId")]
        public int InvoiceDetailsId { get; set; }
        public InvoiceDetails InvoiceDetails { get; set; }  // Matches `invoiceDetails` in OrderDto

        [ForeignKey("UserId")]
        public int? UserId { get; set; }  // Nullable UserId to allow guest orders
        public virtual User? User { get; set; }  // Optional navigation property
    }
}
