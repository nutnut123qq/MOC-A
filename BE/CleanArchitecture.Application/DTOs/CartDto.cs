using CleanArchitecture.Domain.Entities;

namespace CleanArchitecture.Application.DTOs;

public class CartDto
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public int DesignId { get; set; }
    public int ProductId { get; set; }
    public decimal SizeWidth { get; set; }
    public decimal SizeHeight { get; set; }
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
    public decimal TotalPrice { get; set; }
    public string SpecialInstructions { get; set; } = string.Empty;
    public DateTime AddedAt { get; set; }
    public DateTime CreatedAt { get; set; }
    
    // Related data
    public string DesignName { get; set; } = string.Empty;
    public string DesignPreviewUrl { get; set; } = string.Empty;
    public string DesignData { get; set; } = string.Empty; // JSON design session
    public string ProductName { get; set; } = string.Empty;
    public ProductType ProductType { get; set; }
}

public class CartItemDto
{
    public int Id { get; set; }
    public int DesignId { get; set; }
    public int ProductId { get; set; }
    public decimal SizeWidth { get; set; }
    public decimal SizeHeight { get; set; }
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
    public decimal TotalPrice { get; set; }
    public string SpecialInstructions { get; set; } = string.Empty;
    
    // Related data
    public string DesignName { get; set; } = string.Empty;
    public string DesignPreviewUrl { get; set; } = string.Empty;
    public string ProductName { get; set; } = string.Empty;
    public ProductType ProductType { get; set; }
}

public class AddToCartDto
{
    public int DesignId { get; set; }
    public int ProductId { get; set; }
    public decimal SizeWidth { get; set; }
    public decimal SizeHeight { get; set; }
    public int Quantity { get; set; } = 1;
    public string SpecialInstructions { get; set; } = string.Empty;
}

public class UpdateCartItemDto
{
    public int Quantity { get; set; }
    public string SpecialInstructions { get; set; } = string.Empty;
}
