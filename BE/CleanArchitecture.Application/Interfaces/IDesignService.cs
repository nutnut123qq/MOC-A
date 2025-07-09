using CleanArchitecture.Application.DTOs.Design;

namespace CleanArchitecture.Application.Interfaces;

public interface IDesignService
{
    Task<IEnumerable<DesignDto>> GetUserDesignsAsync(int userId);
    Task<DesignDto?> GetDesignByIdAsync(int id, int userId);
    Task<DesignDto> CreateDesignAsync(int userId, CreateDesignDto createDesignDto);
    Task<DesignDto?> UpdateDesignAsync(int id, int userId, UpdateDesignDto updateDesignDto);
    Task<bool> DeleteDesignAsync(int id, int userId);
    Task<DesignDto> CloneDesignAsync(int id, int userId, string newName);
}
