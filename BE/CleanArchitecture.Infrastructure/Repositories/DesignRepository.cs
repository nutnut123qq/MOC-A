using Microsoft.EntityFrameworkCore;
using CleanArchitecture.Domain.Entities;
using CleanArchitecture.Domain.Interfaces;
using CleanArchitecture.Infrastructure.Data;

namespace CleanArchitecture.Infrastructure.Repositories;

public class DesignRepository : Repository<Design>, IDesignRepository
{
    public DesignRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<Design>> GetByUserIdAsync(int userId)
    {
        return await _dbSet
            .Where(d => d.UserId == userId)
            .Include(d => d.Product)
            .OrderByDescending(d => d.CreatedAt)
            .ToListAsync();
    }

    public async Task<Design?> GetByIdAndUserIdAsync(int id, int userId)
    {
        return await _dbSet
            .Include(d => d.Product)
            .FirstOrDefaultAsync(d => d.Id == id && d.UserId == userId);
    }

    public async Task<Design?> GetWithProductAsync(int id)
    {
        return await _dbSet
            .Include(d => d.Product)
            .Include(d => d.User)
            .FirstOrDefaultAsync(d => d.Id == id);
    }

    public async Task<bool> IsOwnerAsync(int designId, int userId)
    {
        return await _dbSet
            .AnyAsync(d => d.Id == designId && d.UserId == userId);
    }
}
