namespace CleanArchitecture.Application.Interfaces;

public interface IFileStorageService
{
    /// <summary>
    /// Lưu design image vào folder và trả về file path
    /// </summary>
    Task<string> SaveDesignImageAsync(int userId, int designId, string layerId, byte[] imageData, string fileName, string mimeType);
    
    /// <summary>
    /// Lưu design image từ base64 string
    /// </summary>
    Task<string> SaveDesignImageFromBase64Async(int userId, int designId, string layerId, string base64Data, string fileName);
    
    /// <summary>
    /// Xóa design image file
    /// </summary>
    Task<bool> DeleteDesignImageAsync(string filePath);
    
    /// <summary>
    /// Cleanup các files không còn được sử dụng
    /// </summary>
    Task CleanupOrphanedFilesAsync(int designId);
    
    /// <summary>
    /// Lấy full URL của file
    /// </summary>
    string GetFileUrl(string filePath);
    
    /// <summary>
    /// Kiểm tra file có tồn tại không
    /// </summary>
    bool FileExists(string filePath);
    
    /// <summary>
    /// Lấy file info
    /// </summary>
    Task<(byte[] data, string mimeType)> GetFileAsync(string filePath);
}
