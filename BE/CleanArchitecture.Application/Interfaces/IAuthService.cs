using CleanArchitecture.Application.DTOs.Auth;

namespace CleanArchitecture.Application.Interfaces;

public interface IAuthService
{
    Task<TokenResponseDto> LoginAsync(LoginDto loginDto);
    Task<TokenResponseDto> RegisterAsync(RegisterDto registerDto);
    Task<TokenResponseDto> RefreshTokenAsync(string refreshToken);
    Task LogoutAsync(string refreshToken);
    Task<bool> ForgotPasswordAsync(ForgotPasswordDto forgotPasswordDto);
    Task<bool> ResetPasswordAsync(ResetPasswordDto resetPasswordDto);
    Task<UserProfileDto?> GetCurrentUserAsync(int userId);
}
