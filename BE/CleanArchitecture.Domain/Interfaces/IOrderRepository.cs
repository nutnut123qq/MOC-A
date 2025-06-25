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
}
