using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace CleanArchitecture.WebAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TempFilesController : ControllerBase
{
    private readonly ILogger<TempFilesController> _logger;
    private readonly string _webRootPath;

    public TempFilesController(
        ILogger<TempFilesController> logger)
    {
        _logger = logger;
        _webRootPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
    }

    [HttpPost("upload-image")]
    public async Task<IActionResult> UploadTempImage([FromForm] TempImageUploadRequest request)
    {
        try
        {
            var sessionId = GetOrCreateSessionId();

            // Validate file
            if (request.File == null || request.File.Length == 0)
                return BadRequest("No file provided");

            // Validate file type
            if (!request.File.ContentType.StartsWith("image/"))
                return BadRequest("Only image files are allowed");

            // Validate file size (max 10MB)
            if (request.File.Length > 10 * 1024 * 1024)
                return BadRequest("File size exceeds 10MB limit");

            // Create temp directory structure
            var tempDir = Path.Combine(_webRootPath, "temp", "uploads", sessionId, request.LayerId);
            Directory.CreateDirectory(tempDir);

            // Generate unique filename
            var fileExtension = Path.GetExtension(request.File.FileName);
            var fileName = $"{request.LayerId}-{DateTimeOffset.UtcNow.ToUnixTimeSeconds()}{fileExtension}";
            var filePath = Path.Combine(tempDir, fileName);

            // Save file to temp location
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await request.File.CopyToAsync(stream);
            }

            // Return relative path for frontend
            var relativePath = $"/temp/uploads/{sessionId}/{request.LayerId}/{fileName}";

            _logger.LogInformation($"✅ Temp file uploaded: {relativePath}");

            return Ok(new
            {
                TempPath = relativePath,
                FileName = request.File.FileName,
                FileSize = request.File.Length,
                SessionId = sessionId,
                LayerId = request.LayerId
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error uploading temp file");
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }

    [HttpPost("upload-base64")]
    public async Task<IActionResult> UploadTempBase64([FromBody] TempBase64UploadRequest request)
    {
        try
        {
            var sessionId = GetOrCreateSessionId();

            // Validate request
            if (string.IsNullOrEmpty(request.Base64Data))
                return BadRequest("No base64 data provided");

            // Parse base64 data
            var base64Match = System.Text.RegularExpressions.Regex.Match(
                request.Base64Data, @"data:(?<mimeType>image/[^;]+);base64,(?<data>.+)");

            if (!base64Match.Success)
                return BadRequest("Invalid base64 image format");

            var mimeType = base64Match.Groups["mimeType"].Value;
            var base64String = base64Match.Groups["data"].Value;
            var fileData = Convert.FromBase64String(base64String);

            // Validate file size (max 10MB)
            if (fileData.Length > 10 * 1024 * 1024)
                return BadRequest("File size exceeds 10MB limit");

            // Create temp directory structure
            var tempDir = Path.Combine(_webRootPath, "temp", "uploads", sessionId, request.LayerId);
            Directory.CreateDirectory(tempDir);

            // Generate filename based on mime type
            var fileExtension = mimeType switch
            {
                "image/jpeg" => ".jpg",
                "image/png" => ".png",
                "image/gif" => ".gif",
                "image/webp" => ".webp",
                _ => ".jpg"
            };

            var fileName = $"{request.LayerId}-{DateTimeOffset.UtcNow.ToUnixTimeSeconds()}{fileExtension}";
            var filePath = Path.Combine(tempDir, fileName);

            // Save file to temp location
            await System.IO.File.WriteAllBytesAsync(filePath, fileData);

            // Return relative path for frontend
            var relativePath = $"/temp/uploads/{sessionId}/{request.LayerId}/{fileName}";

            _logger.LogInformation($"✅ Temp base64 file uploaded: {relativePath}");

            return Ok(new
            {
                TempPath = relativePath,
                FileName = request.FileName ?? $"image{fileExtension}",
                FileSize = fileData.Length,
                SessionId = sessionId,
                LayerId = request.LayerId
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error uploading temp base64 file");
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }

    [HttpDelete("cleanup/{sessionId}")]
    public IActionResult CleanupTempFiles(string sessionId)
    {
        try
        {
            var tempDir = Path.Combine(_webRootPath, "temp", "uploads", sessionId);

            if (Directory.Exists(tempDir))
            {
                Directory.Delete(tempDir, true);
                _logger.LogInformation($"✅ Cleaned up temp files for session: {sessionId}");
            }

            return Ok(new { Message = "Temp files cleaned up successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error cleaning up temp files for session: {sessionId}");
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }

    private string GetOrCreateSessionId()
    {
        // Try to get user ID if authenticated
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (!string.IsNullOrEmpty(userIdClaim))
        {
            return $"user-{userIdClaim}";
        }

        // For anonymous users, create session based on IP + timestamp
        var clientIp = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown";
        var sessionId = $"anon-{clientIp.Replace(":", "").Replace(".", "")}-{DateTimeOffset.UtcNow.ToUnixTimeSeconds()}";

        return sessionId;
    }
}

public class TempImageUploadRequest
{
    public IFormFile File { get; set; } = null!;
    public string LayerId { get; set; } = string.Empty;
}

public class TempBase64UploadRequest
{
    public string Base64Data { get; set; } = string.Empty;
    public string LayerId { get; set; } = string.Empty;
    public string? FileName { get; set; }
}
