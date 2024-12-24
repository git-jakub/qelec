using System.ComponentModel.DataAnnotations;

namespace qelec.Models
{
    public class EstimateDetails
    {
        [Key]
        public int EstimateDetailsId { get; set; }

        public string JobDescription { get; set; }
        public decimal GeneratedTime { get; set; }
        public decimal CalculatedCost { get; set; }
        public bool PaidOnStreet { get; set; }
        public bool CongestionCharge { get; set; }
        public string Postcode { get; set; }
        public decimal PostcodeTierCost { get; set; }

        // Nawigacja do szczegółów mnożnika
        public int? MultiplierDetailsId { get; set; }
        public MultiplierDetails MultiplierDetails { get; set; }

        // Nawigacja do podziału kosztów
        public int? CostBreakdownId { get; set; }
        public CostBreakdown CostBreakdown { get; set; }
    }

    public class MultiplierDetails
    {
        [Key]
        public int MultiplierDetailsId { get; set; }

        public string Name { get; set; }
        public string Start { get; set; }
        public string End { get; set; }
        public decimal Multiplier { get; set; }
    }

    public class CostBreakdown
    {
        [Key]
        public int CostBreakdownId { get; set; }

        public decimal LaborCost { get; set; }
        public decimal ParkingCost { get; set; }
        public decimal TotalCongestionCharge { get; set; }
        public decimal CommutingCost { get; set; }
    }
}
