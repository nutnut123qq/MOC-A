using CleanArchitecture.Domain.Entities;

namespace CleanArchitecture.Domain.Interfaces;

public interface IProductRepository : IRepository<Product>
{
    Task<IEnumerable<Product>> GetActiveProductsAsync();
    Task<IEnumerable<Product>> GetByTypeAsync(ProductType type);
    Task<Product?> GetWithMockupsAsync(int id);
    Task<IEnumerable<Product>> GetWithMockupsAsync();
}
