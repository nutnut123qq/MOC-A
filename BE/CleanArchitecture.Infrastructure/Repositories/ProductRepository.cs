using Microsoft.EntityFrameworkCore;
using CleanArchitecture.Domain.Entities;
using CleanArchitecture.Domain.Interfaces;
using CleanArchitecture.Infrastructure.Data;

namespace CleanArchitecture.Infrastructure.Repositories;

public class ProductRepository : Repository<Product>, IProductRepository
{
    public ProductRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<Product>> GetActiveProductsAsync()
    {
        return await _dbSet
            .Where(p => p.IsActive)
            .Include(p => p.Mockups)
            .OrderBy(p => p.Name)
            .ToListAsync();
    }

    public async Task<IEnumerable<Product>> GetByTypeAsync(ProductType type)
    {
        return await _dbSet
            .Where(p => p.Type == type && p.IsActive)
            .Include(p => p.Mockups)
            .OrderBy(p => p.Name)
            .ToListAsync();
    }

    public async Task<Product?> GetWithMockupsAsync(int id)
    {
        return await _dbSet
            .Include(p => p.Mockups.OrderBy(m => m.SortOrder))
            .FirstOrDefaultAsync(p => p.Id == id);
    }

    public async Task<IEnumerable<Product>> GetWithMockupsAsync()
    {
        return await _dbSet
            .Include(p => p.Mockups.OrderBy(m => m.SortOrder))
            .Where(p => p.IsActive)
            .OrderBy(p => p.Name)
            .ToListAsync();
    }
}
