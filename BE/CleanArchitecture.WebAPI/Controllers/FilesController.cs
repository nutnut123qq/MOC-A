using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Cors;

namespace CleanArchitecture.WebAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
[EnableCors("AllowFrontend")]
public class FilesController : ControllerBase
{
    private readonly ILogger<FilesController> _logger;
    private readonly string _uploadsPath;

    public FilesController(ILogger<FilesController> logger)
    {
        _logger = logger;
        _uploadsPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");
    }

    [HttpGet("download")]
    public async Task<IActionResult> DownloadFile([FromQuery] string path)
    {
        try
        {
            if (string.IsNullOrEmpty(path))
            {
                return BadRequest("File path is required");
            }

            // Clean the path and ensure it's within uploads directory
            var cleanPath = path.TrimStart('/').Replace('/', Path.DirectorySeparatorChar);

            // Remove "uploads" from the beginning if present since _uploadsPath already includes it
            if (cleanPath.StartsWith("uploads" + Path.DirectorySeparatorChar))
            {
                cleanPath = cleanPath.Substring(("uploads" + Path.DirectorySeparatorChar).Length);
            }

            var fullPath = Path.Combine(_uploadsPath, cleanPath);

            // Security check: ensure the file is within uploads directory
            var uploadsFullPath = Path.GetFullPath(_uploadsPath);
            var requestedFullPath = Path.GetFullPath(fullPath);
            
            if (!requestedFullPath.StartsWith(uploadsFullPath))
            {
                return BadRequest("Invalid file path");
            }

            if (!System.IO.File.Exists(fullPath))
            {
                return NotFound("File not found");
            }

            var fileBytes = await System.IO.File.ReadAllBytesAsync(fullPath);
            var fileName = Path.GetFileName(fullPath);
            var contentType = GetContentType(fileName);

            // Add CORS headers explicitly
            Response.Headers.Add("Access-Control-Allow-Origin", "*");
            Response.Headers.Add("Access-Control-Allow-Methods", "GET");
            Response.Headers.Add("Access-Control-Allow-Headers", "Content-Type");

            return File(fileBytes, contentType, fileName);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error serving file: {path}");
            return StatusCode(500, "Internal server error");
        }
    }

    private string GetContentType(string fileName)
    {
        var extension = Path.GetExtension(fileName).ToLower();
        return extension switch
        {
            ".jpg" or ".jpeg" => "image/jpeg",
            ".png" => "image/png",
            ".gif" => "image/gif",
            ".webp" => "image/webp",
            ".svg" => "image/svg+xml",
            _ => "application/octet-stream"
        };
    }
}
