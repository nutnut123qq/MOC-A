using CleanArchitecture.Domain.Common;

namespace CleanArchitecture.Domain.Entities;

public class Design : BaseEntity
{
    public int UserId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string CanvasData { get; set; } = string.Empty; // JSON data của canvas
    public string PreviewImageUrl { get; set; } = string.Empty;
    public decimal Width { get; set; } // Width in cm
    public decimal Height { get; set; } // Height in cm
    public bool IsPublic { get; set; } = false;
    public int ViewCount { get; set; } = 0;

    // Navigation properties
    public virtual User User { get; set; } = null!;
    public virtual ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
}
