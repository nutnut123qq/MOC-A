using Microsoft.EntityFrameworkCore;
using CleanArchitecture.Domain.Entities;
using CleanArchitecture.Domain.Interfaces;
using CleanArchitecture.Infrastructure.Data;

namespace CleanArchitecture.Infrastructure.Repositories;

public class StickerRepository : Repository<Sticker>, IStickerRepository
{
    public StickerRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<Sticker>> GetActiveStickerAsync()
    {
        return await _dbSet
            .Where(s => s.IsActive)
            .OrderBy(s => s.Category)
            .ThenBy(s => s.Name)
            .ToListAsync();
    }

    public async Task<IEnumerable<Sticker>> GetByCategoryAsync(string category)
    {
        return await _dbSet
            .Where(s => s.Category == category && s.IsActive)
            .OrderBy(s => s.Name)
            .ToListAsync();
    }

    public async Task<IEnumerable<Sticker>> SearchAsync(string searchTerm)
    {
        return await _dbSet
            .Where(s => s.IsActive && 
                       (s.Name.Contains(searchTerm) || 
                        s.Tags.Contains(searchTerm) || 
                        s.Category.Contains(searchTerm)))
            .OrderBy(s => s.Name)
            .ToListAsync();
    }

    public async Task<IEnumerable<string>> GetCategoriesAsync()
    {
        return await _dbSet
            .Where(s => s.IsActive)
            .Select(s => s.Category)
            .Distinct()
            .OrderBy(c => c)
            .ToListAsync();
    }

    public async Task<IEnumerable<Sticker>> GetPopularStickersAsync(int count = 10)
    {
        return await _dbSet
            .Where(s => s.IsActive)
            .OrderByDescending(s => s.UsageCount)
            .Take(count)
            .ToListAsync();
    }

    public async Task IncrementUsageCountAsync(int id)
    {
        var sticker = await _dbSet.FindAsync(id);
        if (sticker != null)
        {
            sticker.UsageCount++;
            await _context.SaveChangesAsync();
        }
    }
}
