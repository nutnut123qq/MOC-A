using CleanArchitecture.Domain.Common;

namespace CleanArchitecture.Domain.Entities;

public class Mockup : BaseEntity
{
    public int ProductId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string ImageUrl { get; set; } = string.Empty;
    public string OverlayCoordinates { get; set; } = string.Empty; // JSON coordinates for design placement
    public decimal MaxWidth { get; set; } // Maximum design width for this mockup
    public decimal MaxHeight { get; set; } // Maximum design height for this mockup
    public bool IsDefault { get; set; } = false;
    public int SortOrder { get; set; } = 0;

    // Navigation properties
    public virtual Product Product { get; set; } = null!;
}
