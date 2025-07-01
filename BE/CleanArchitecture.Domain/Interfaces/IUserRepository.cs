using CleanArchitecture.Domain.Entities;

namespace CleanArchitecture.Domain.Interfaces;

public interface IUserRepository : IRepository<User>
{
    Task<User?> GetByEmailAsync(string email);
    Task<IEnumerable<User>> GetActiveUsersAsync();
    Task<bool> ExistsAsync(string email);
    Task<IEnumerable<User>> GetUsersByRoleAsync(int role);
    Task<int> GetTotalUsersCountAsync();
}
