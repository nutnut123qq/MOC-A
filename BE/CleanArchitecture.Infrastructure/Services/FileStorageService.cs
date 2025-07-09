using CleanArchitecture.Application.Interfaces;
using Microsoft.Extensions.Logging;
using System.Text.RegularExpressions;

namespace CleanArchitecture.Infrastructure.Services;

public class FileStorageService : IFileStorageService
{
    private readonly ILogger<FileStorageService> _logger;
    private readonly string _uploadsPath;
    private readonly string _baseUrl;

    public FileStorageService(ILogger<FileStorageService> logger)
    {
        _logger = logger;
        _uploadsPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "designs");
        _baseUrl = "/uploads/designs";
        
        // Tạo thư mục nếu chưa tồn tại
        EnsureDirectoryExists(_uploadsPath);
    }

    public async Task<string> SaveDesignImageAsync(int userId, int designId, string layerId, byte[] imageData, string fileName, string mimeType)
    {
        try
        {
            // Tạo cấu trúc thư mục: uploads/designs/images/user-{userId}/design-{designId}/
            var userDir = Path.Combine(_uploadsPath, "images", $"user-{userId}");
            var designDir = Path.Combine(userDir, $"design-{designId}");
            
            EnsureDirectoryExists(designDir);

            // Tạo tên file unique
            var timestamp = DateTimeOffset.UtcNow.ToUnixTimeSeconds();
            var extension = GetFileExtension(mimeType, fileName);
            var uniqueFileName = $"layer-{layerId}-{timestamp}{extension}";
            var fullPath = Path.Combine(designDir, uniqueFileName);

            // Lưu file
            await File.WriteAllBytesAsync(fullPath, imageData);

            // Trả về relative path
            var relativePath = $"{_baseUrl}/images/user-{userId}/design-{designId}/{uniqueFileName}";
            
            _logger.LogInformation($"✅ Saved design image: {relativePath} ({imageData.Length} bytes)");
            return relativePath;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"❌ Error saving design image for user {userId}, design {designId}, layer {layerId}");
            throw;
        }
    }

    public async Task<string> SaveDesignImageFromBase64Async(int userId, int designId, string layerId, string base64Data, string fileName)
    {
        try
        {
            // Parse base64 data (format: data:image/jpeg;base64,/9j/4AAQ...)
            var match = Regex.Match(base64Data, @"data:(?<mimeType>image/[^;]+);base64,(?<data>.+)");
            if (!match.Success)
            {
                throw new ArgumentException("Invalid base64 image format");
            }

            var mimeType = match.Groups["mimeType"].Value;
            var base64String = match.Groups["data"].Value;
            var imageData = Convert.FromBase64String(base64String);

            return await SaveDesignImageAsync(userId, designId, layerId, imageData, fileName, mimeType);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"❌ Error saving base64 image for user {userId}, design {designId}, layer {layerId}");
            throw;
        }
    }

    public async Task<bool> DeleteDesignImageAsync(string filePath)
    {
        try
        {
            // Convert relative path to full path
            var fullPath = GetFullPath(filePath);
            
            if (File.Exists(fullPath))
            {
                await Task.Run(() => File.Delete(fullPath));
                _logger.LogInformation($"🗑️ Deleted design image: {filePath}");
                return true;
            }
            
            _logger.LogWarning($"⚠️ File not found for deletion: {filePath}");
            return false;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"❌ Error deleting design image: {filePath}");
            return false;
        }
    }

    public async Task CleanupOrphanedFilesAsync(int designId)
    {
        try
        {
            // Tìm tất cả files của design này
            var designPattern = $"design-{designId}";
            var searchPath = Path.Combine(_uploadsPath, "images");
            
            if (!Directory.Exists(searchPath))
                return;

            var designDirs = Directory.GetDirectories(searchPath, "*", SearchOption.AllDirectories)
                .Where(dir => Path.GetFileName(dir).Contains(designPattern));

            foreach (var dir in designDirs)
            {
                if (Directory.Exists(dir))
                {
                    await Task.Run(() => Directory.Delete(dir, true));
                    _logger.LogInformation($"🧹 Cleaned up design directory: {dir}");
                }
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"❌ Error cleaning up files for design {designId}");
        }
    }

    public string GetFileUrl(string filePath)
    {
        return filePath; // Already relative path starting with /uploads/designs
    }

    public bool FileExists(string filePath)
    {
        var fullPath = GetFullPath(filePath);
        return File.Exists(fullPath);
    }

    public async Task<(byte[] data, string mimeType)> GetFileAsync(string filePath)
    {
        try
        {
            var fullPath = GetFullPath(filePath);
            
            if (!File.Exists(fullPath))
            {
                throw new FileNotFoundException($"File not found: {filePath}");
            }

            var data = await File.ReadAllBytesAsync(fullPath);
            var mimeType = GetMimeTypeFromPath(filePath);
            
            return (data, mimeType);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"❌ Error reading file: {filePath}");
            throw;
        }
    }

    #region Private Methods

    private void EnsureDirectoryExists(string path)
    {
        if (!Directory.Exists(path))
        {
            Directory.CreateDirectory(path);
            _logger.LogInformation($"📁 Created directory: {path}");
        }
    }

    private string GetFullPath(string relativePath)
    {
        // Remove leading slash and convert to full path
        var cleanPath = relativePath.TrimStart('/').Replace('/', Path.DirectorySeparatorChar);
        return Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", cleanPath);
    }

    private string GetFileExtension(string mimeType, string fileName)
    {
        // Ưu tiên extension từ mimeType
        return mimeType.ToLower() switch
        {
            "image/jpeg" => ".jpg",
            "image/jpg" => ".jpg", 
            "image/png" => ".png",
            "image/gif" => ".gif",
            "image/webp" => ".webp",
            "image/svg+xml" => ".svg",
            _ => Path.GetExtension(fileName) ?? ".jpg"
        };
    }

    private string GetMimeTypeFromPath(string filePath)
    {
        var extension = Path.GetExtension(filePath).ToLower();
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

    #endregion
}
