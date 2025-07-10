using CleanArchitecture.Application.DTOs;
using CleanArchitecture.Domain.Entities;

namespace CleanArchitecture.Application.Interfaces;

public interface IOrderService
{
    Task<IEnumerable<OrderDto>> GetAllOrdersAsync();
    Task<IEnumerable<OrderDto>> GetUserOrdersAsync(int userId);
    Task<OrderDto?> GetOrderByIdAsync(int id);
    Task<OrderDto?> GetOrderByIdAsync(int id, int userId); // For user-specific access
    Task<OrderDto> CreateOrderAsync(int userId, CreateOrderDto createOrderDto);
    Task<OrderDto> CreateOrderFromCartAsync(int userId, CreateOrderDto createOrderDto);
    Task<OrderDto?> UpdateOrderStatusAsync(int id, OrderStatus status);
    Task<bool> CancelOrderAsync(int id, int userId);
    Task<string> GenerateOrderNumberAsync();
}
