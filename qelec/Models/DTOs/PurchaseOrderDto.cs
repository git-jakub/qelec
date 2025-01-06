using System;
using System.Collections.Generic;

namespace qelec.Models.DTOs
{
    public class PurchaseOrderDto
    {
        public int OrderId { get; set; } // Unique ID for the purchase order
        public string RecipientName { get; set; } // Name of the client receiving the order
        public string RecipientAddress { get; set; } // Full address of the client
        public string RecipientEmail { get; set; } // Email for communication
        public string RecipientPhone { get; set; } // Contact phone number
        public string JobDescription { get; set; } // Summary of the services or products
        public DateTime IssueDate { get; set; } // Date the purchase order is issued
        public DateTime? CompletionDate { get; set; } // Optional completion date
        public decimal TotalCost { get; set; } // Total cost of the order
        public string Status { get; set; } // Status of the purchase order (e.g., "Pending", "Completed")

        // Relationships
        public JobAddressDto JobAddress { get; set; } // Address where the service is provided
        public JobDetailsDto JobDetails { get; set; } // Additional job-specific information
        public EstimateDetailsDto EstimateDetails { get; set; } // Cost and time estimates
        public InvoiceDetailsDto InvoiceDetails { get; set; } // Invoice details, if applicable

        // Additional Fields
        public List<string> Notes { get; set; } = new List<string>(); // Optional notes or instructions
    }
}
