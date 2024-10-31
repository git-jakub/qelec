using System.ComponentModel.DataAnnotations;

namespace qelec.Models
{
    public class Order
    {
        [Key]
        public int OrderId { get; set; }  // ID zamówienia

        public int TimeSlotId { get; set; }  // ID przypisany do wybranego terminu
        public string JobDetails { get; set; }  // Szczegóły związane z pracą
        public string InvoiceDetails { get; set; }  // Szczegóły faktury

        // Możesz dodać inne właściwości, jeśli są potrzebne
    }
}
