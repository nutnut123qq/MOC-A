using CleanArchitecture.Application.Services;
using Microsoft.Extensions.Logging;

namespace CleanArchitecture.Infrastructure.Services;

public class TempFileService : ITempFileService
{
    private readonly string _webRootPath;
    private readonly ILogger<TempFileService> _logger;

    public TempFileService(
        ILogger<TempFileService> logger)
    {
        _webRootPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
        _logger = logger;
    }

    public async Task<string> MoveTempFileToPermanentAsync(string tempPath, int designId, string layerId, int userId)
    {
        try
        {
            // Parse temp path to get file info
            var tempFullPath = Path.Combine(_webRootPath, tempPath.TrimStart('/').Replace('/', Path.DirectorySeparatorChar));

            if (!File.Exists(tempFullPath))
            {
                throw new FileNotFoundException($"Temp file not found: {tempPath}");
            }

            // Create permanent directory structure
            var permanentDir = Path.Combine(
                _webRootPath,
                "uploads",
                "designs",
                "images",
                $"user-{userId}",
                $"design-{designId}"
            );

            Directory.CreateDirectory(permanentDir);

            // Generate new filename for permanent storage
            var fileExtension = Path.GetExtension(tempFullPath);
            var permanentFileName = $"layer-{layerId}-{DateTimeOffset.UtcNow.ToUnixTimeSeconds()}{fileExtension}";
            var permanentFullPath = Path.Combine(permanentDir, permanentFileName);

            // Move file from temp to permanent location
            File.Move(tempFullPath, permanentFullPath);

            // Return relative path for database storage
            var relativePath = $"/uploads/designs/images/user-{userId}/design-{designId}/{permanentFileName}";

            _logger.LogInformation($"✅ Moved temp file to permanent: {tempPath} → {relativePath}");

            return relativePath;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error moving temp file to permanent: {tempPath}");
            throw;
        }
    }

    public async Task CleanupTempFilesAsync(string sessionId)
    {
        try
        {
            var tempDir = Path.Combine(_webRootPath, "temp", "uploads", sessionId);

            if (Directory.Exists(tempDir))
            {
                Directory.Delete(tempDir, true);
                _logger.LogInformation($"✅ Cleaned up temp files for session: {sessionId}");
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error cleaning up temp files for session: {sessionId}");
            throw;
        }
    }

    public async Task CleanupOldTempFilesAsync(TimeSpan maxAge)
    {
        try
        {
            var tempUploadsDir = Path.Combine(_webRootPath, "temp", "uploads");

            if (!Directory.Exists(tempUploadsDir))
                return;

            var cutoffTime = DateTime.UtcNow - maxAge;
            var sessionDirs = Directory.GetDirectories(tempUploadsDir);

            foreach (var sessionDir in sessionDirs)
            {
                var dirInfo = new DirectoryInfo(sessionDir);

                if (dirInfo.CreationTimeUtc < cutoffTime)
                {
                    try
                    {
                        Directory.Delete(sessionDir, true);
                        _logger.LogInformation($"✅ Cleaned up old temp session: {Path.GetFileName(sessionDir)}");
                    }
                    catch (Exception ex)
                    {
                        _logger.LogWarning(ex, $"Failed to cleanup temp session: {Path.GetFileName(sessionDir)}");
                    }
                }
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error cleaning up old temp files");
            throw;
        }
    }
}
