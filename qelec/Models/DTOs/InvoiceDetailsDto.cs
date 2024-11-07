namespace qelec.Models.DTOs
{
    public class InvoiceDetailsDto
    {
        public string RecipientName { get; set; }  // Matches `recipientName` in `OrderSummary`
        public string CompanyName { get; set; }  // Matches `companyName`
        public string RecipientAddress { get; set; }  // Matches `address`
        public string RecipientPostcode { get; set; }  // Matches `postcode`
        public string RecipientCity { get; set; }  // Matches `city`
        public string RecipientEmail { get; set; }  // Matches `email`
        public string RecipientPhone { get; set; }  // Matches `phone`
        public DateTime InvoiceDate { get; set; }
        public string PaymentStatus { get; set; }
        public decimal TotalAmount { get; set; }
    }

}
