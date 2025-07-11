using CleanArchitecture.Domain.Common;
using System.ComponentModel.DataAnnotations.Schema;

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

    public PaymentMethod PaymentMethod { get; set; } = PaymentMethod.PayOS;

    public PaymentStatus PaymentStatus { get; set; } = PaymentStatus.Pending;

    public string? PayOSOrderCode { get; set; }

    public DateTime? CompletedAt { get; set; }

    // Navigation properties
    public virtual User User { get; set; } = null!;
    public virtual ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
    public virtual ICollection<WalletTransaction> WalletTransactions { get; set; } = new List<WalletTransaction>();
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

public enum PaymentMethod
{
    PayOS = 1,          // Thanh toán qua PayOS
    Wallet = 2          // Thanh toán từ ví
}

public enum PaymentStatus
{
    Pending = 1,        // Chờ thanh toán
    Paid = 2,           // Đã thanh toán
    Failed = 3,         // Thanh toán thất bại
    Refunded = 4        // Đã hoàn tiền
}
