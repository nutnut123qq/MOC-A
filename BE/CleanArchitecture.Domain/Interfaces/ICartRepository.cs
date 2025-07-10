using CleanArchitecture.Domain.Entities;

namespace CleanArchitecture.Domain.Interfaces;

public interface ICartRepository : IRepository<Cart>
{
    Task<IEnumerable<Cart>> GetUserCartAsync(int userId);
    Task<Cart?> GetCartItemAsync(int userId, int designId, int productId);
    Task<IEnumerable<Cart>> GetUserCartWithDetailsAsync(int userId);
    Task ClearUserCartAsync(int userId);
    Task<int> GetCartItemCountAsync(int userId);
    Task<decimal> GetCartTotalAsync(int userId);
}
