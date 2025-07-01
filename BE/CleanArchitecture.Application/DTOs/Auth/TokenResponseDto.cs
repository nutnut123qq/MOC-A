namespace CleanArchitecture.Application.DTOs.Auth;

public class TokenResponseDto
{
    public string AccessToken { get; set; } = string.Empty;
    public string RefreshToken { get; set; } = string.Empty;
    public int ExpiresIn { get; set; } // seconds
    public UserProfileDto User { get; set; } = null!;
}
