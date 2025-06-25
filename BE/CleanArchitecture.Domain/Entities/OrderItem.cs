using CleanArchitecture.Domain.Common;

namespace CleanArchitecture.Domain.Entities;

public class OrderItem : BaseEntity
{
    public int OrderId { get; set; }
    public int DesignId { get; set; }
    public int ProductId { get; set; }
    public decimal SizeWidth { get; set; } // Width in cm
    public decimal SizeHeight { get; set; } // Height in cm
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
    public decimal TotalPrice { get; set; }
    public string SpecialInstructions { get; set; } = string.Empty;

    // Navigation properties
    public virtual Order Order { get; set; } = null!;
    public virtual Design Design { get; set; } = null!;
    public virtual Product Product { get; set; } = null!;
}
