using CleanArchitecture.Domain.Entities;
using System.Security.Claims;

namespace CleanArchitecture.Application.Interfaces;

public interface ITokenService
{
    string GenerateAccessToken(User user);
    string GenerateRefreshToken();
    ClaimsPrincipal? GetPrincipalFromExpiredToken(string token);
    Task<string> CreateRefreshTokenAsync(int userId);
    Task<bool> ValidateRefreshTokenAsync(string token);
    Task RevokeRefreshTokenAsync(string token);
    Task RevokeAllUserTokensAsync(int userId);
}
