using CleanArchitecture.Application.DTOs;

namespace CleanArchitecture.Application.Interfaces;

public interface IDesignService
{
    Task<IEnumerable<DesignListDto>> GetUserDesignsAsync(int userId);
    Task<IEnumerable<DesignListDto>> GetPublicDesignsAsync();
    Task<IEnumerable<DesignListDto>> GetPopularDesignsAsync(int count = 10);
    Task<DesignDto?> GetDesignByIdAsync(int id);
    Task<DesignDto> CreateDesignAsync(int userId, CreateDesignDto createDesignDto);
    Task<DesignDto?> UpdateDesignAsync(int id, int userId, UpdateDesignDto updateDesignDto);
    Task<bool> DeleteDesignAsync(int id, int userId);
    Task<bool> IncrementViewCountAsync(int id);
    Task<string> GeneratePreviewImageAsync(string canvasData);
}
