using CleanArchitecture.Domain.Common;

namespace CleanArchitecture.Domain.Entities;

public class Order : BaseEntity
{
    public int UserId { get; set; }
    public string OrderNumber { get; set; } = string.Empty;
    public string CustomerName { get; set; } = string.Empty;
    public string CustomerPhone { get; set; } = string.Empty;
    public string CustomerEmail { get; set; } = string.Empty;
    public string DeliveryAddress { get; set; } = string.Empty;
    public string Notes { get; set; } = string.Empty;
    public decimal TotalAmount { get; set; }
    public OrderStatus Status { get; set; } = OrderStatus.Pending;
    public DateTime? CompletedAt { get; set; }

    // Navigation properties
    public virtual User User { get; set; } = null!;
    public virtual ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
}

public enum OrderStatus
{
    Pending = 1,        // Chờ xử lý
    Confirmed = 2,      // Đã xác nhận
    Printing = 3,       // Đang in
    Shipping = 4,       // Đang giao
    Completed = 5,      // Hoàn thành
    Cancelled = 6       // Đã hủy
}
