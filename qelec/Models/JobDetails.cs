using System;
using System.ComponentModel.DataAnnotations;

namespace qelec.Models
{
    public class JobDetails
    {
        [Key]
        public int JobDetailsId { get; set; }

        public string Postcode { get; set; }
        public string City { get; set; }
        public string Address { get; set; }
        public string ClientName { get; set; }
        public string SiteAccessInfo { get; set; }
        public string Mobile { get; set; }
        public string ClientEmail { get; set; }
        public string ServiceType { get; set; }
        public string ServiceDetails { get; set; }
        public decimal EstimatedCost { get; set; }
        public DateTime? EstimatedCompletionTime { get; set; }
        public DateTime? ActualCompletionTime { get; set; }  // Field for analytics
        public string PropertySizeOrSpecification { get; set; }
    }
}
