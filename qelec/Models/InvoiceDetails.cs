using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace qelec.Models
{
    public class InvoiceDetails
    {
        public int InvoiceDetailsId { get; set; }
        public string RecipientName { get; set; }
        public string CompanyName { get; set; }
        public string RecipientAddress { get; set; }
        public string RecipientPostcode { get; set; }
        public string RecipientCity { get; set; }
        public string RecipientEmail { get; set; }
        public string RecipientPhone { get; set; }
        public DateTime InvoiceDate { get; set; }     // New field
        public string PaymentStatus { get; set; }     // New field
        public decimal TotalAmount { get; set; }      // New field
    }
}