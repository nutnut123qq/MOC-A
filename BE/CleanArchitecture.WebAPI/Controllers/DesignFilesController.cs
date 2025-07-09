using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using CleanArchitecture.Application.Interfaces;
using CleanArchitecture.Infrastructure.Data;
using CleanArchitecture.Domain.Entities;
using System.Security.Claims;

namespace CleanArchitecture.WebAPI.Controllers;

[ApiController]
[Route("api/design-files")]
// [Authorize] // Temporarily disabled for testing
public class DesignFilesController : ControllerBase
{
    private readonly IFileStorageService _fileStorageService;
    private readonly ApplicationDbContext _context;
    private readonly ILogger<DesignFilesController> _logger;

    public DesignFilesController(
        IFileStorageService fileStorageService,
        ApplicationDbContext context,
        ILogger<DesignFilesController> logger)
    {
        _fileStorageService = fileStorageService;
        _context = context;
        _logger = logger;
    }

    [HttpPost("upload-image")]
    public async Task<ActionResult<UploadImageResponse>> UploadImage([FromForm] UploadImageRequest request)
    {
        try
        {
            var userId = GetCurrentUserId();
            if (userId == 0)
            {
                // For anonymous users, use a default user ID for design uploads
                userId = 1; // Anonymous user ID
            }

            // Ensure design exists - create if not found
            var actualDesignId = await EnsureDesignExistsAsync(request.DesignId, userId);

            // Validate file
            if (request.File == null || request.File.Length == 0)
                return BadRequest("No file provided");

            // Validate file type
            var allowedTypes = new[] { "image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp" };
            if (!allowedTypes.Contains(request.File.ContentType.ToLower()))
                return BadRequest("Invalid file type. Only images are allowed.");

            // Validate file size (max 10MB)
            if (request.File.Length > 10 * 1024 * 1024)
                return BadRequest("File too large. Maximum size is 10MB.");

            // Convert file to byte array
            byte[] fileData;
            using (var memoryStream = new MemoryStream())
            {
                await request.File.CopyToAsync(memoryStream);
                fileData = memoryStream.ToArray();
            }

            // Save file
            var filePath = await _fileStorageService.SaveDesignImageAsync(
                userId,
                actualDesignId,
                request.LayerId,
                fileData,
                request.File.FileName,
                request.File.ContentType
            );

            // Save file record to database
            var designFile = new DesignFile
            {
                DesignId = actualDesignId,
                LayerId = request.LayerId,
                FileName = request.File.FileName,
                FilePath = filePath,
                FileSize = request.File.Length,
                MimeType = request.File.ContentType,
                CreatedAt = DateTime.UtcNow
            };

            _context.DesignFiles.Add(designFile);
            await _context.SaveChangesAsync();

            _logger.LogInformation($"✅ File uploaded successfully: {filePath}");

            return Ok(new UploadImageResponse
            {
                FilePath = filePath,
                FileUrl = _fileStorageService.GetFileUrl(filePath),
                FileId = designFile.Id
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "❌ Error uploading file");
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }

    [HttpPost("upload-base64")]
    public async Task<ActionResult<UploadImageResponse>> UploadBase64Image([FromBody] UploadBase64Request request)
    {
        try
        {
            var userId = GetCurrentUserId();
            if (userId == 0)
            {
                // For anonymous users, use a default user ID for design uploads
                userId = 1; // Anonymous user ID
            }

            // Ensure design exists - create if not found
            var actualDesignId = await EnsureDesignExistsAsync(request.DesignId, userId);

            // Validate request
            if (string.IsNullOrEmpty(request.Base64Data))
                return BadRequest("No base64 data provided");

            // Save file from base64
            var filePath = await _fileStorageService.SaveDesignImageFromBase64Async(
                userId,
                actualDesignId,
                request.LayerId,
                request.Base64Data,
                request.FileName ?? "image.jpg"
            );

            // Extract file info for database
            var base64Match = System.Text.RegularExpressions.Regex.Match(
                request.Base64Data, @"data:(?<mimeType>image/[^;]+);base64,(?<data>.+)");

            var mimeType = base64Match.Success ? base64Match.Groups["mimeType"].Value : "image/jpeg";
            var base64String = base64Match.Success ? base64Match.Groups["data"].Value : request.Base64Data;
            var fileSize = Convert.FromBase64String(base64String).Length;

            // Save file record to database
            var designFile = new DesignFile
            {
                DesignId = actualDesignId,
                LayerId = request.LayerId,
                FileName = request.FileName ?? "image.jpg",
                FilePath = filePath,
                FileSize = fileSize,
                MimeType = mimeType,
                CreatedAt = DateTime.UtcNow
            };

            _context.DesignFiles.Add(designFile);
            await _context.SaveChangesAsync();

            _logger.LogInformation($"✅ Base64 file uploaded successfully: {filePath}");

            return Ok(new UploadImageResponse
            {
                FilePath = filePath,
                FileUrl = _fileStorageService.GetFileUrl(filePath),
                FileId = designFile.Id
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "❌ Error uploading base64 file");
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }

    [HttpDelete("{fileId}")]
    public async Task<ActionResult> DeleteFile(int fileId)
    {
        try
        {
            var userId = 1; // GetCurrentUserId(); // Hardcoded for testing
            // if (userId == 0)
            //     return Unauthorized("User not authenticated");

            // Find file record
            var designFile = await _context.DesignFiles.FindAsync(fileId);
            if (designFile == null)
                return NotFound("File not found");

            // Check if user owns the design
            var design = await _context.Designs.FindAsync(designFile.DesignId);
            if (design == null || design.UserId != userId)
                return Forbid("Access denied");

            // Delete physical file
            await _fileStorageService.DeleteDesignImageAsync(designFile.FilePath);

            // Delete database record
            _context.DesignFiles.Remove(designFile);
            await _context.SaveChangesAsync();

            _logger.LogInformation($"🗑️ File deleted successfully: {designFile.FilePath}");

            return Ok();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"❌ Error deleting file {fileId}");
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }

    private int GetCurrentUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return int.TryParse(userIdClaim, out var userId) ? userId : 0;
    }

    private async Task<int> EnsureDesignExistsAsync(int designId, int userId)
    {
        var existingDesign = await _context.Designs.FindAsync(designId);
        if (existingDesign == null)
        {
            // Create a new design if it doesn't exist
            var newDesign = new CleanArchitecture.Domain.Entities.Design
            {
                UserId = userId,
                Name = $"Test Design {DateTime.Now:yyyy-MM-dd HH:mm:ss}",
                ProductId = 1, // Default to first product (T-shirt)
                DesignData = "{}",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Designs.Add(newDesign);
            await _context.SaveChangesAsync();

            _logger.LogInformation($"✅ Created new design with ID: {newDesign.Id}");
            return newDesign.Id;
        }
        return existingDesign.Id;
    }
}

// Request/Response DTOs
public class UploadImageRequest
{
    public IFormFile File { get; set; } = null!;
    public int DesignId { get; set; }
    public string LayerId { get; set; } = string.Empty;
}

public class UploadBase64Request
{
    public string Base64Data { get; set; } = string.Empty;
    public int DesignId { get; set; }
    public string LayerId { get; set; } = string.Empty;
    public string? FileName { get; set; }
}

public class UploadImageResponse
{
    public string FilePath { get; set; } = string.Empty;
    public string FileUrl { get; set; } = string.Empty;
    public int FileId { get; set; }
}
