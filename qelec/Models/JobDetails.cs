using qelec.Models;
using System.ComponentModel.DataAnnotations;

public class JobDetails
{
    [Key]
    public int JobDetailsId { get; set; }

    public string? ClientName { get; set; }
    public string? SiteAccessInfo { get; set; }
    public string? Mobile { get; set; }
    public string? ClientEmail { get; set; }
    public string? YourReference { get; set; }
    public string? AdditionalInfo { get; set; }

    // Foreign Key
    public int? JobAddressId { get; set; } // Nullable, aby uniknąć problemów z kluczami obcymi
    public virtual JobAddress? JobAddress { get; set; }
}

