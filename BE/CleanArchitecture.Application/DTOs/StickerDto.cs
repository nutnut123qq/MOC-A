namespace CleanArchitecture.Application.DTOs;

public class StickerDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string ImageUrl { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string Tags { get; set; } = string.Empty;
    public bool IsPremium { get; set; }
    public decimal PremiumPrice { get; set; }
    public bool IsActive { get; set; }
    public int UsageCount { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class StickerCategoryDto
{
    public string Category { get; set; } = string.Empty;
    public int Count { get; set; }
    public List<StickerDto> Stickers { get; set; } = new();
}

public class CreateStickerDto
{
    public string Name { get; set; } = string.Empty;
    public string ImageUrl { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string Tags { get; set; } = string.Empty;
    public bool IsPremium { get; set; } = false;
    public decimal PremiumPrice { get; set; } = 0;
}

public class UpdateStickerDto
{
    public string Name { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string Tags { get; set; } = string.Empty;
    public bool IsPremium { get; set; }
    public decimal PremiumPrice { get; set; }
    public bool IsActive { get; set; }
}
