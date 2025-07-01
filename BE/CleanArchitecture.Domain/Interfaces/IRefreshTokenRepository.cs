using CleanArchitecture.Domain.Entities;

namespace CleanArchitecture.Domain.Interfaces;

public interface IRefreshTokenRepository : IRepository<RefreshToken>
{
    Task<RefreshToken?> GetByTokenAsync(string token);
    Task<IEnumerable<RefreshToken>> GetByUserIdAsync(int userId);
    Task RevokeAllUserTokensAsync(int userId);
    Task RevokeTokenAsync(string token);
    Task CleanupExpiredTokensAsync();
}
