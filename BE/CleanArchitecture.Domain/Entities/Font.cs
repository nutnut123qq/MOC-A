using CleanArchitecture.Domain.Common;

namespace CleanArchitecture.Domain.Entities;

public class Font : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string FontFamily { get; set; } = string.Empty;
    public string FontFileUrl { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public bool IsPremium { get; set; } = false;
    public decimal PremiumPrice { get; set; } = 0;
    public bool IsActive { get; set; } = true;
    public int UsageCount { get; set; } = 0;
    public string PreviewText { get; set; } = "Sample Text";
}
