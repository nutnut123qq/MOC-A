using CleanArchitecture.Domain.Common;

namespace CleanArchitecture.Domain.Entities;

public class Product : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public ProductType Type { get; set; }
    public string Description { get; set; } = string.Empty;
    public string MockupImageUrl { get; set; } = string.Empty;
    public decimal BasePrice { get; set; }
    public bool IsActive { get; set; } = true;

    // Navigation properties
    public virtual ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
    public virtual ICollection<Mockup> Mockups { get; set; } = new List<Mockup>();
}

public enum ProductType
{
    Shirt = 1,      // Áo
    Hat = 2,        // Mũ
    CanvasBag = 3   // Túi canvas
}
