using CleanArchitecture.Domain.Entities;

namespace CleanArchitecture.Domain.Interfaces;

public interface IDesignRepository : IRepository<Design>
{
    Task<IEnumerable<Design>> GetByUserIdAsync(int userId);
    Task<Design?> GetByIdAndUserIdAsync(int id, int userId);
    Task<Design?> GetWithProductAsync(int id);
    Task<bool> IsOwnerAsync(int designId, int userId);
}
