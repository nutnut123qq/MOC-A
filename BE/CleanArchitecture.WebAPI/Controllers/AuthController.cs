using CleanArchitecture.Application.DTOs;
using CleanArchitecture.Application.DTOs.Auth;
using CleanArchitecture.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace CleanArchitecture.WebAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly IUserService _userService;
    private readonly ILogger<AuthController> _logger;

    public AuthController(IAuthService authService, IUserService userService, ILogger<AuthController> logger)
    {
        _authService = authService;
        _userService = userService;
        _logger = logger;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterDto registerDto)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { success = false, message = "Dữ liệu không hợp lệ", errors = ModelState });
            }

            var result = await _authService.RegisterAsync(registerDto);
            
            return Ok(new { success = true, data = result, message = "Đăng ký thành công" });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { success = false, message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during registration");
            return StatusCode(500, new { success = false, message = "Đã xảy ra lỗi trong quá trình đăng ký" });
        }
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { success = false, message = "Dữ liệu không hợp lệ", errors = ModelState });
            }

            var result = await _authService.LoginAsync(loginDto);
            
            return Ok(new { success = true, data = result, message = "Đăng nhập thành công" });
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new { success = false, message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during login");
            return StatusCode(500, new { success = false, message = "Đã xảy ra lỗi trong quá trình đăng nhập" });
        }
    }

    [HttpPost("refresh-token")]
    public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenDto refreshTokenDto)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { success = false, message = "Dữ liệu không hợp lệ", errors = ModelState });
            }

            var result = await _authService.RefreshTokenAsync(refreshTokenDto.RefreshToken);
            
            return Ok(new { success = true, data = result, message = "Token đã được làm mới" });
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new { success = false, message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during token refresh");
            return StatusCode(500, new { success = false, message = "Đã xảy ra lỗi trong quá trình làm mới token" });
        }
    }

    [HttpPost("logout")]
    [Authorize]
    public async Task<IActionResult> Logout([FromBody] RefreshTokenDto refreshTokenDto)
    {
        try
        {
            await _authService.LogoutAsync(refreshTokenDto.RefreshToken);
            
            return Ok(new { success = true, message = "Đăng xuất thành công" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during logout");
            return StatusCode(500, new { success = false, message = "Đã xảy ra lỗi trong quá trình đăng xuất" });
        }
    }

    [HttpPost("forgot-password")]
    public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordDto forgotPasswordDto)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { success = false, message = "Dữ liệu không hợp lệ", errors = ModelState });
            }

            var result = await _authService.ForgotPasswordAsync(forgotPasswordDto);
            
            return Ok(new { success = true, message = "Nếu email tồn tại, chúng tôi đã gửi hướng dẫn đặt lại mật khẩu" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during forgot password");
            return StatusCode(500, new { success = false, message = "Đã xảy ra lỗi trong quá trình xử lý" });
        }
    }

    [HttpPost("reset-password")]
    public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto resetPasswordDto)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { success = false, message = "Dữ liệu không hợp lệ", errors = ModelState });
            }

            var result = await _authService.ResetPasswordAsync(resetPasswordDto);
            
            if (result)
            {
                return Ok(new { success = true, message = "Mật khẩu đã được đặt lại thành công" });
            }
            
            return BadRequest(new { success = false, message = "Token không hợp lệ hoặc đã hết hạn" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during password reset");
            return StatusCode(500, new { success = false, message = "Đã xảy ra lỗi trong quá trình đặt lại mật khẩu" });
        }
    }

    [HttpGet("me")]
    [Authorize]
    public async Task<IActionResult> GetCurrentUser()
    {
        try
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!int.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized(new { success = false, message = "Token không hợp lệ" });
            }

            var user = await _authService.GetCurrentUserAsync(userId);
            if (user == null)
            {
                return NotFound(new { success = false, message = "Người dùng không tồn tại" });
            }

            return Ok(new { success = true, data = user });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting current user");
            return StatusCode(500, new { success = false, message = "Đã xảy ra lỗi trong quá trình lấy thông tin người dùng" });
        }
    }

    [HttpPut("profile")]
    [Authorize]
    public async Task<IActionResult> UpdateProfile([FromBody] UpdateUserProfileDto updateProfileDto)
    {
        try
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!int.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized(new { success = false, message = "Token không hợp lệ" });
            }

            var updatedUser = await _userService.UpdateUserProfileAsync(userId, updateProfileDto);
            if (updatedUser == null)
            {
                return NotFound(new { success = false, message = "Người dùng không tồn tại" });
            }

            return Ok(new { success = true, data = updatedUser, message = "Cập nhật thông tin thành công" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating user profile");
            return StatusCode(500, new { success = false, message = "Đã xảy ra lỗi trong quá trình cập nhật thông tin" });
        }
    }


}
