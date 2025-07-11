using CleanArchitecture.Domain.Entities;

namespace CleanArchitecture.Domain.Interfaces;

public interface IOrderRepository : IRepository<Order>
{
    Task<IEnumerable<Order>> GetByUserIdAsync(int userId);
    Task<IEnumerable<Order>> GetByStatusAsync(OrderStatus status);
    Task<Order?> GetByOrderNumberAsync(string orderNumber);
    Task<Order?> GetWithItemsAsync(int id);
    Task<IEnumerable<Order>> GetWithItemsAsync();
    Task<string> GenerateOrderNumberAsync();
    Task<IEnumerable<Order>> GetUserOrdersAsync(int userId);
    Task<Order?> GetOrderWithItemsAsync(int id);

    // PayOS integration methods
    Task<Order?> GetByPayOSOrderCodeAsync(string payOSOrderCode);
    Task UpdatePayOSOrderCodeAsync(int orderId, string payOSOrderCode);
    Task UpdatePaymentStatusAsync(int orderId, PaymentStatus paymentStatus);
}
