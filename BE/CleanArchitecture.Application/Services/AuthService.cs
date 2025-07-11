using CleanArchitecture.Application.DTOs.Auth;
using CleanArchitecture.Application.Interfaces;
using CleanArchitecture.Domain.Entities;
using CleanArchitecture.Domain.Enums;
using CleanArchitecture.Domain.Interfaces;
using Microsoft.Extensions.Logging;

namespace CleanArchitecture.Application.Services;

public class AuthService : IAuthService
{
    private readonly IUserRepository _userRepository;
    private readonly ITokenService _tokenService;
    private readonly ILogger<AuthService> _logger;

    public AuthService(
        IUserRepository userRepository,
        ITokenService tokenService,
        ILogger<AuthService> logger)
    {
        _userRepository = userRepository;
        _tokenService = tokenService;
        _logger = logger;
    }

    public async Task<TokenResponseDto> LoginAsync(LoginDto loginDto)
    {
        try
        {
            var user = await _userRepository.GetByEmailAsync(loginDto.Email);
            if (user == null)
            {
                throw new UnauthorizedAccessException("Email hoặc mật khẩu không đúng");
            }

            if (user.Status != UserStatus.Active)
            {
                throw new UnauthorizedAccessException("Tài khoản đã bị khóa");
            }

            if (!BCrypt.Net.BCrypt.Verify(loginDto.Password, user.PasswordHash))
            {
                throw new UnauthorizedAccessException("Email hoặc mật khẩu không đúng");
            }

            // Update last login
            user.LastLoginAt = DateTime.UtcNow;
            await _userRepository.UpdateAsync(user);

            // Generate tokens
            var accessToken = _tokenService.GenerateAccessToken(user);
            var refreshToken = await _tokenService.CreateRefreshTokenAsync(user.Id);

            var userProfile = MapToUserProfile(user);

            _logger.LogInformation("User {Email} logged in successfully", user.Email);

            return new TokenResponseDto
            {
                AccessToken = accessToken,
                RefreshToken = refreshToken,
                ExpiresIn = 900, // 15 minutes
                User = userProfile
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during login for email: {Email}", loginDto.Email);
            throw;
        }
    }

    public async Task<TokenResponseDto> RegisterAsync(RegisterDto registerDto)
    {
        try
        {
            // Check if user already exists
            if (await _userRepository.ExistsAsync(registerDto.Email))
            {
                throw new InvalidOperationException("Email đã được sử dụng");
            }

            // Create new user
            var user = new User
            {
                Email = registerDto.Email,
                FirstName = registerDto.FirstName,
                LastName = registerDto.LastName,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(registerDto.Password),
                PhoneNumber = registerDto.PhoneNumber,
                DateOfBirth = registerDto.DateOfBirth,
                Gender = registerDto.Gender,
                Role = UserRole.User,
                Status = UserStatus.Active,
                CreatedAt = DateTime.UtcNow
            };

            var createdUser = await _userRepository.AddAsync(user);

            // Generate tokens
            var accessToken = _tokenService.GenerateAccessToken(createdUser);
            var refreshToken = await _tokenService.CreateRefreshTokenAsync(createdUser.Id);

            var userProfile = MapToUserProfile(createdUser);

            _logger.LogInformation("New user registered: {Email}", createdUser.Email);

            return new TokenResponseDto
            {
                AccessToken = accessToken,
                RefreshToken = refreshToken,
                ExpiresIn = 900, // 15 minutes
                User = userProfile
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during registration for email: {Email}", registerDto.Email);
            throw;
        }
    }

    public async Task<TokenResponseDto> RefreshTokenAsync(string refreshToken)
    {
        try
        {
            // Get refresh token from database
            var refreshTokenEntity = await _tokenService.GetRefreshTokenAsync(refreshToken);
            if (refreshTokenEntity == null || !refreshTokenEntity.IsActive)
            {
                throw new UnauthorizedAccessException("Refresh token không hợp lệ hoặc đã hết hạn");
            }

            var user = await _userRepository.GetByIdAsync(refreshTokenEntity.UserId);
            if (user == null || user.Status != UserStatus.Active)
            {
                throw new UnauthorizedAccessException("User không tồn tại hoặc đã bị khóa");
            }

            // Revoke old refresh token
            await _tokenService.RevokeRefreshTokenAsync(refreshToken);

            // Generate new tokens
            var newAccessToken = _tokenService.GenerateAccessToken(user);
            var newRefreshToken = await _tokenService.CreateRefreshTokenAsync(user.Id);

            var userProfile = MapToUserProfile(user);

            return new TokenResponseDto
            {
                AccessToken = newAccessToken,
                RefreshToken = newRefreshToken,
                ExpiresIn = 900, // 15 minutes
                User = userProfile
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during token refresh");
            throw;
        }
    }

    public async Task LogoutAsync(string refreshToken)
    {
        try
        {
            await _tokenService.RevokeRefreshTokenAsync(refreshToken);
            _logger.LogInformation("User logged out successfully");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during logout");
            throw;
        }
    }

    public async Task<bool> ForgotPasswordAsync(ForgotPasswordDto forgotPasswordDto)
    {
        try
        {
            var user = await _userRepository.GetByEmailAsync(forgotPasswordDto.Email);
            if (user == null)
            {
                // Don't reveal if email exists or not
                return true;
            }

            // TODO: Implement password reset token generation and email sending
            // For now, just log the request
            _logger.LogInformation("Password reset requested for email: {Email}", forgotPasswordDto.Email);

            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during forgot password for email: {Email}", forgotPasswordDto.Email);
            return false;
        }
    }

    public async Task<bool> ResetPasswordAsync(ResetPasswordDto resetPasswordDto)
    {
        try
        {
            // TODO: Implement password reset token validation
            // For now, just update password directly
            var user = await _userRepository.GetByEmailAsync(resetPasswordDto.Email);
            if (user == null)
            {
                return false;
            }

            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(resetPasswordDto.NewPassword);
            user.UpdatedAt = DateTime.UtcNow;

            await _userRepository.UpdateAsync(user);

            // Revoke all refresh tokens for security
            await _tokenService.RevokeAllUserTokensAsync(user.Id);

            _logger.LogInformation("Password reset successfully for user: {Email}", user.Email);

            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during password reset for email: {Email}", resetPasswordDto.Email);
            return false;
        }
    }

    public async Task<UserProfileDto?> GetCurrentUserAsync(int userId)
    {
        try
        {
            var user = await _userRepository.GetByIdAsync(userId);
            return user != null ? MapToUserProfile(user) : null;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting current user: {UserId}", userId);
            return null;
        }
    }

    private static UserProfileDto MapToUserProfile(User user)
    {
        return new UserProfileDto
        {
            Id = user.Id,
            Email = user.Email,
            FirstName = user.FirstName,
            LastName = user.LastName,
            FullName = user.FullName,
            PhoneNumber = user.PhoneNumber,
            DateOfBirth = user.DateOfBirth,
            Gender = user.Gender,
            AvatarUrl = user.AvatarUrl,
            Role = user.Role,
            Status = user.Status,
            CreatedAt = user.CreatedAt,
            LastLoginAt = user.LastLoginAt,
            IsAdmin = user.IsAdmin
        };
    }


}
