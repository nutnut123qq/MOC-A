using CleanArchitecture.Domain.Entities;

namespace CleanArchitecture.Application.DTOs;

public class OrderDto
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string OrderNumber { get; set; } = string.Empty;
    public string CustomerName { get; set; } = string.Empty;
    public string CustomerPhone { get; set; } = string.Empty;
    public string CustomerEmail { get; set; } = string.Empty;
    public string DeliveryAddress { get; set; } = string.Empty;
    public string Notes { get; set; } = string.Empty;
    public decimal TotalAmount { get; set; }
    public OrderStatus Status { get; set; }
    public string StatusName { get; set; } = string.Empty;
    public PaymentStatus PaymentStatus { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? CompletedAt { get; set; }
    
    public List<OrderItemDto> OrderItems { get; set; } = new();
}

public class OrderItemDto
{
    public int Id { get; set; }
    public int OrderId { get; set; }
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
    public string DesignData { get; set; } = string.Empty; // JSON design session
    public string ProductName { get; set; } = string.Empty;
    public ProductType ProductType { get; set; }
}

public class CreateOrderDto
{
    public string CustomerName { get; set; } = string.Empty;
    public string CustomerPhone { get; set; } = string.Empty;
    public string CustomerEmail { get; set; } = string.Empty;
    public string DeliveryAddress { get; set; } = string.Empty;
    public string Notes { get; set; } = string.Empty;
    
    public List<CreateOrderItemDto> OrderItems { get; set; } = new();
}

public class CreateOrderItemDto
{
    public int DesignId { get; set; }
    public int ProductId { get; set; }
    public decimal SizeWidth { get; set; }
    public decimal SizeHeight { get; set; }
    public int Quantity { get; set; }
    public string SpecialInstructions { get; set; } = string.Empty;
}

public class UpdateOrderStatusDto
{
    public OrderStatus Status { get; set; }
    public string Notes { get; set; } = string.Empty;
}

public class OrderStatusHistoryDto
{
    public OrderStatus Status { get; set; }
    public string StatusName { get; set; } = string.Empty;
    public DateTime Timestamp { get; set; }
    public bool IsCompleted { get; set; }
    public string Description { get; set; } = string.Empty;
}

public class OrderSummaryDto
{
    public int Id { get; set; }
    public string OrderNumber { get; set; } = string.Empty;
    public string CustomerName { get; set; } = string.Empty;
    public decimal TotalAmount { get; set; }
    public OrderStatus Status { get; set; }
    public string StatusName { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public int ItemCount { get; set; }
}
