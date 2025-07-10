using CleanArchitecture.Domain.Common;

namespace CleanArchitecture.Domain.Entities;

public class Cart : BaseEntity
{
    public int UserId { get; set; }
    public int DesignId { get; set; }
    public int ProductId { get; set; }
    public decimal SizeWidth { get; set; } // Width in cm
    public decimal SizeHeight { get; set; } // Height in cm
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
    public decimal TotalPrice { get; set; }
    public string SpecialInstructions { get; set; } = string.Empty;
    public DateTime AddedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public virtual User User { get; set; } = null!;
    public virtual Design Design { get; set; } = null!;
    public virtual Product Product { get; set; } = null!;
}
