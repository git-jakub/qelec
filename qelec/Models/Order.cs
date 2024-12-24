using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace qelec.Models
{
    public class Order
    {
        [Key]
        public int OrderId { get; set; }

        [ForeignKey("TimeSlot")]
        public int? TimeSlotId { get; set; } // Nullable, jeśli czas nie zawsze jest wymagany
        public virtual TimeSlot? TimeSlot { get; set; }

        [Required]
        public string Status { get; set; }

        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedDate { get; set; }

        [ForeignKey("JobDetails")]
        public int? JobDetailsId { get; set; } // Nullable, jeśli szczegóły pracy mogą być opcjonalne
        public JobDetails? JobDetails { get; set; }

        [ForeignKey("InvoiceDetails")]
        public int? InvoiceDetailsId { get; set; }
        public InvoiceDetails? InvoiceDetails { get; set; }

        [ForeignKey("JobAddress")]
        public int? JobAddressId { get; set; }
        public JobAddress? JobAddress { get; set; }

        [ForeignKey("EstimateDetails")]
        public int? EstimateDetailsId { get; set; }
        public EstimateDetails? EstimateDetails { get; set; }

        [ForeignKey("User")]
        public int? UserId { get; set; }
        public virtual User? User { get; set; }
    }
}
