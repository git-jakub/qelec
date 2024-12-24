namespace qelec.Models.DTOs
{
    public class EstimateDetailsDto
    {
        public string JobDescription { get; set; }  // Odpowiada `input` w EstimateDetails.js
        public decimal GeneratedTime { get; set; }  // Odpowiada `generatedTime`
        public decimal CalculatedCost { get; set; }  // Odpowiada `calculatedCost`
        public bool PaidOnStreet { get; set; }  // Odpowiada `paidOnStreet`
        public bool CongestionCharge { get; set; }  // Odpowiada `congestionCharge`
        public string Postcode { get; set; }  // Odpowiada `postcode`
        public decimal PostcodeTierCost { get; set; }  // Odpowiada `postcodeTierCost`
        public MultiplierDetailsDto MultiplierDetails { get; set; }  // Dodatkowe szczegóły mnożnika
        public CostBreakdownDto CostBreakdown { get; set; }  // Szczegółowy podział kosztów
    }

    public class MultiplierDetailsDto
    {
        public string Name { get; set; }
        public string Start { get; set; }  // Czas rozpoczęcia mnożnika
        public string End { get; set; }  // Czas zakończenia mnożnika
        public decimal Multiplier { get; set; }
    }

    public class CostBreakdownDto
    {
        public decimal LaborCost { get; set; }  // Koszt pracy
        public decimal ParkingCost { get; set; }  // Koszt parkowania
        public decimal TotalCongestionCharge { get; set; }  // Opłata za kongestię
        public decimal CommutingCost { get; set; }  // Koszt dojazdu
    }
}
