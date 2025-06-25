using CleanArchitecture.Domain.Common;

namespace CleanArchitecture.Domain.Entities;

public class Sticker : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string ImageUrl { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string Tags { get; set; } = string.Empty; // Comma-separated tags for search
    public bool IsPremium { get; set; } = false;
    public decimal PremiumPrice { get; set; } = 0;
    public bool IsActive { get; set; } = true;
    public int UsageCount { get; set; } = 0;
}
