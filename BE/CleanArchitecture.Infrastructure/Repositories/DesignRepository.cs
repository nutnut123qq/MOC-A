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
            .OrderByDescending(d => d.CreatedAt)
            .ToListAsync();
    }

    public async Task<IEnumerable<Design>> GetPublicDesignsAsync()
    {
        return await _dbSet
            .Where(d => d.IsPublic)
            .Include(d => d.User)
            .OrderByDescending(d => d.ViewCount)
            .ThenByDescending(d => d.CreatedAt)
            .ToListAsync();
    }

    public async Task<IEnumerable<Design>> GetPopularDesignsAsync(int count = 10)
    {
        return await _dbSet
            .Where(d => d.IsPublic)
            .Include(d => d.User)
            .OrderByDescending(d => d.ViewCount)
            .Take(count)
            .ToListAsync();
    }

    public async Task<Design?> GetWithUserAsync(int id)
    {
        return await _dbSet
            .Include(d => d.User)
            .FirstOrDefaultAsync(d => d.Id == id);
    }

    public async Task IncrementViewCountAsync(int id)
    {
        var design = await _dbSet.FindAsync(id);
        if (design != null)
        {
            design.ViewCount++;
            await _context.SaveChangesAsync();
        }
    }
}
