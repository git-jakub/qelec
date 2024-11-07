namespace qelec.Models.DTOs
{
    public class OrderDto
    {
        public int OrderId { get; set; }
        public int TimeSlotId { get; set; }
        public string Status { get; set; }  // Matches `status` in `OrderSummary`
        public DateTime CreatedDate { get; set; }
        public DateTime? UpdatedDate { get; set; }
        public List<string> StatusChangeHistory { get; set; } = new List<string>();

        public JobDetailsDto JobDetails { get; set; }  // Matches nested `jobDetails` object in `OrderSummary`
        public InvoiceDetailsDto InvoiceDetails { get; set; }  // Matches nested `invoiceDetails` object in `OrderSummary`
    }

}
