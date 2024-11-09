using System;
using System.ComponentModel.DataAnnotations;

namespace qelec.Models
{
    public class TimeSlot
    {
        [Key]
        public int TimeSlotId { get; set; }  // Primary Key

        // StartDate will include both the start date and time
        public DateTime StartDate { get; set; }

        // EndDate will include both the end date and time
        public DateTime EndDate { get; set; }

        // Indicates whether the time slot is available
        public bool IsAvailable { get; set; }

        public virtual ICollection<Order> Orders { get; set; } = new List<Order>();
    }
}