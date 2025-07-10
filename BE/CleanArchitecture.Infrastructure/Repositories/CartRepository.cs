using Microsoft.EntityFrameworkCore;
using CleanArchitecture.Domain.Entities;
using CleanArchitecture.Domain.Interfaces;
using CleanArchitecture.Infrastructure.Data;

namespace CleanArchitecture.Infrastructure.Repositories;

public class CartRepository : Repository<Cart>, ICartRepository
{
    public CartRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<Cart>> GetUserCartAsync(int userId)
    {
        return await _dbSet
            .Where(c => c.UserId == userId)
            .OrderByDescending(c => c.AddedAt)
            .ToListAsync();
    }

    public async Task<Cart?> GetCartItemAsync(int userId, int designId, int productId)
    {
        return await _dbSet
            .FirstOrDefaultAsync(c => c.UserId == userId && c.DesignId == designId && c.ProductId == productId);
    }

    public async Task<IEnumerable<Cart>> GetUserCartWithDetailsAsync(int userId)
    {
        return await _dbSet
            .Include(c => c.Design)
            .Include(c => c.Product)
            .Where(c => c.UserId == userId)
            .OrderByDescending(c => c.AddedAt)
            .ToListAsync();
    }

    public async Task ClearUserCartAsync(int userId)
    {
        var cartItems = await _dbSet
            .Where(c => c.UserId == userId)
            .ToListAsync();

        if (cartItems.Any())
        {
            _dbSet.RemoveRange(cartItems);
            await _context.SaveChangesAsync();
        }
    }

    public async Task<int> GetCartItemCountAsync(int userId)
    {
        return await _dbSet
            .Where(c => c.UserId == userId)
            .SumAsync(c => c.Quantity);
    }

    public async Task<decimal> GetCartTotalAsync(int userId)
    {
        return await _dbSet
            .Where(c => c.UserId == userId)
            .SumAsync(c => c.TotalPrice);
    }
}
