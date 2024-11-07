namespace qelec.Models.DTOs
{
    public class JobDetailsDto
    {
        public string Postcode { get; set; }  // Matches `postcode` in `OrderSummary`
        public string City { get; set; }
        public string Address { get; set; }  // Matches `address`
        public string ClientName { get; set; }  // Maps to `name` in `OrderSummary`
        public string SiteAccessInfo { get; set; }
        public string Mobile { get; set; }
        public string ClientEmail { get; set; }  // Maps to `email`
        public string ServiceType { get; set; }
        public string ServiceDetails { get; set; }
        public string PropertySizeOrSpecification { get; set; }
        public decimal EstimatedCost { get; set; }
        public string EstimatedTime { get; set; }
        public DateTime? EstimatedCompletionTime { get; set; }
        public DateTime? ActualCompletionTime { get; set; }
    }

}
