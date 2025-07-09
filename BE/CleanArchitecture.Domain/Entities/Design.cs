using CleanArchitecture.Domain.Common;

namespace CleanArchitecture.Domain.Entities;

public class Design : BaseEntity
{
    public int UserId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int ProductId { get; set; }
    public string DesignData { get; set; } = string.Empty; // JSON data của T-shirt design session
    public string? PreviewImageUrl { get; set; }
    // Removed: IsPublic, ViewCount, Width, Height (chỉ private designs)

    // Navigation properties
    public virtual User User { get; set; } = null!;
    public virtual Product Product { get; set; } = null!;
    public virtual ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
    public virtual ICollection<DesignFile> DesignFiles { get; set; } = new List<DesignFile>();
}
