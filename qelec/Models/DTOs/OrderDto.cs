using System;
using System.Collections.Generic;
using qelec.Models;

public class OrderDto
{
    public int OrderId { get; set; }
    public int TimeSlotId { get; set; }
    public string Status { get; set; }
    public DateTime CreatedDate { get; set; }
    public DateTime? UpdatedDate { get; set; }
    public List<string> StatusChangeHistory { get; set; } = new List<string>();

    public int? UserId { get; set; }  // Foreign key linking to the User table

    // Include only relevant details if necessary
    public JobDetails JobDetails { get; set; }
    public InvoiceDetails InvoiceDetails { get; set; }
}
