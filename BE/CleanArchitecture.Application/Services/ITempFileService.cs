namespace CleanArchitecture.Application.Services;

public interface ITempFileService
{
    Task<string> CopyTempFileToPermanentAsync(string tempPath, int designId, string layerId, int userId);
    Task CleanupTempFilesAsync(string sessionId);
    Task CleanupOldTempFilesAsync(TimeSpan maxAge);
}
