using System.ComponentModel.DataAnnotations;

namespace qelec.Models
{
    public class JobAddress
    {
        [Key]
        public int JobAddressId { get; set; }  // Klucz główny

        [Required]
        public string Postcode { get; set; }  // Kod pocztowy

        [Required]
        public string Street { get; set; }  // Ulica

        [Required]
        public string City { get; set; }  // Miasto

        public bool PaidOnStreet { get; set; }  // Czy płatne na ulicy

        public bool VisitorPermit { get; set; }  // Czy istnieje pozwolenie dla gości

        public bool CongestionCharge { get; set; }  // Czy obowiązuje opłata za kongestię
    }
}
