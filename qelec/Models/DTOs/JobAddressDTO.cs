namespace qelec.Models.DTOs
{
    public class JobAddressDto
    {
        public string Postcode { get; set; }  // Postcode input
        public string Street { get; set; }  // Street input
        public string City { get; set; }  // City input
        public bool PaidOnStreet { get; set; }  // Checkbox for "Paid On Street"
        public bool VisitorPermit { get; set; }  // Checkbox for "Visitor Permit"
        public bool CongestionCharge { get; set; }  // Checkbox for "Congestion Charge"
    }
}
