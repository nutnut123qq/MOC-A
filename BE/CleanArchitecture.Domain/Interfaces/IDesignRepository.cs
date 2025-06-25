using CleanArchitecture.Domain.Entities;

namespace CleanArchitecture.Domain.Interfaces;

public interface IDesignRepository : IRepository<Design>
{
    Task<IEnumerable<Design>> GetByUserIdAsync(int userId);
    Task<IEnumerable<Design>> GetPublicDesignsAsync();
    Task<IEnumerable<Design>> GetPopularDesignsAsync(int count = 10);
    Task<Design?> GetWithUserAsync(int id);
    Task IncrementViewCountAsync(int id);
}
