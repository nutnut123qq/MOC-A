using CleanArchitecture.Application.DTOs;

namespace CleanArchitecture.Application.Interfaces;

public interface ICartService
{
    Task<IEnumerable<CartDto>> GetUserCartAsync(int userId);
    Task<CartDto> AddToCartAsync(int userId, AddToCartDto addToCartDto);
    Task<CartDto?> UpdateCartItemAsync(int userId, int cartItemId, UpdateCartItemDto updateCartItemDto);
    Task<bool> RemoveFromCartAsync(int userId, int cartItemId);
    Task<bool> ClearCartAsync(int userId);
    Task<int> GetCartItemCountAsync(int userId);
    Task<decimal> GetCartTotalAsync(int userId);
    Task<bool> MoveCartToOrderAsync(int userId, int orderId);
}
