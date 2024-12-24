namespace qelec.Models.DTOs
{
    public class JobDetailsDto
    {
        public string ClientName { get; set; }  // Maps to `clientName` in JobDetails.js
        public string SiteAccessInfo { get; set; }  // Maps to `siteAccessInfo` in JobDetails.js
        public string Mobile { get; set; }  // Maps to `mobile` in JobDetails.js
        public string ClientEmail { get; set; }  // Maps to `clientEmail` in JobDetails.js
        public string YourReference { get; set; }  // Maps to `yourReference` in JobDetails.js
        public string AdditionalInfo { get; set; }  // Maps to `additionalInfo` in JobDetails.js
        // Removed unused fields like Postcode, City, Address, etc.
    }
}
