using CleanArchitecture.Domain.Entities;

namespace CleanArchitecture.Application.DTOs;

public class ProductDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public ProductType Type { get; set; }
    public string TypeName { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string MockupImageUrl { get; set; } = string.Empty;
    public decimal BasePrice { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
    
    public List<MockupDto> Mockups { get; set; } = new();
}

public class MockupDto
{
    public int Id { get; set; }
    public int ProductId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string ImageUrl { get; set; } = string.Empty;
    public string OverlayCoordinates { get; set; } = string.Empty;
    public decimal MaxWidth { get; set; }
    public decimal MaxHeight { get; set; }
    public bool IsDefault { get; set; }
    public int SortOrder { get; set; }
}

public class CreateProductDto
{
    public string Name { get; set; } = string.Empty;
    public ProductType Type { get; set; }
    public string Description { get; set; } = string.Empty;
    public string MockupImageUrl { get; set; } = string.Empty;
    public decimal BasePrice { get; set; }
}

public class UpdateProductDto
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string MockupImageUrl { get; set; } = string.Empty;
    public decimal BasePrice { get; set; }
    public bool IsActive { get; set; }
}
