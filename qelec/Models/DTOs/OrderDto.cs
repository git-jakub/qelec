using System;
using System.Collections.Generic;
using qelec.Models.DTOs;

namespace qelec.Models.DTOs
{
    public class OrderDto
    {
        public int OrderId { get; set; }  // ID zamówienia
        public int TimeSlotId { get; set; }  // ID wybranego terminu
        public string Status { get; set; }  // Status zamówienia (Scheduled, Rescheduled, Unpaid, Completed)
        public DateTime CreatedDate { get; set; }  // Data utworzenia zamówienia
        public DateTime? UpdatedDate { get; set; }  // Data ostatniej aktualizacji zamówienia

        public List<string> StatusChangeHistory { get; set; } = new List<string>();  // Historia zmian statusu

        public int? UserId { get; set; }  // ID użytkownika (nullable dla zamówień gościa)

        public JobDetailsDto JobDetails { get; set; }  // Szczegóły pracy
        public InvoiceDetailsDto InvoiceDetails { get; set; }  // Szczegóły faktury
        public JobAddressDto JobAddress { get; set; }  // Adres pracy
        public EstimateDetailsDto EstimateDetails { get; set; }  // Szczegóły wyceny
    }
}
