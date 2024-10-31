using System.ComponentModel.DataAnnotations;

namespace qelec.Models
{
    public class TimeSlot
    {
        [Key]
        public int TimeSlotId { get; set; }  // Klucz główny

        public DateTime Date { get; set; }
        public string Time { get; set; }
        public bool IsAvailable { get; set; }

        // Dodaj inne właściwości, jeśli są potrzebne
    }
}
