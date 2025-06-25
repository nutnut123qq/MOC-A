using CleanArchitecture.Application.DTOs;
using CleanArchitecture.Application.Interfaces;
using CleanArchitecture.Domain.Entities;
using CleanArchitecture.Domain.Interfaces;

namespace CleanArchitecture.Application.Services;

public class DesignService : IDesignService
{
    private readonly IDesignRepository _designRepository;

    public DesignService(IDesignRepository designRepository)
    {
        _designRepository = designRepository;
    }

    public async Task<IEnumerable<DesignListDto>> GetUserDesignsAsync(int userId)
    {
        var designs = await _designRepository.GetByUserIdAsync(userId);
        return designs.Select(MapToListDto);
    }

    public async Task<IEnumerable<DesignListDto>> GetPublicDesignsAsync()
    {
        var designs = await _designRepository.GetPublicDesignsAsync();
        return designs.Select(MapToListDto);
    }

    public async Task<IEnumerable<DesignListDto>> GetPopularDesignsAsync(int count = 10)
    {
        var designs = await _designRepository.GetPopularDesignsAsync(count);
        return designs.Select(MapToListDto);
    }

    public async Task<DesignDto?> GetDesignByIdAsync(int id)
    {
        var design = await _designRepository.GetWithUserAsync(id);
        return design != null ? MapToDto(design) : null;
    }

    public async Task<DesignDto> CreateDesignAsync(int userId, CreateDesignDto createDesignDto)
    {
        var design = new Design
        {
            UserId = userId,
            Name = createDesignDto.Name,
            CanvasData = createDesignDto.CanvasData,
            PreviewImageUrl = createDesignDto.PreviewImageUrl,
            Width = createDesignDto.Width,
            Height = createDesignDto.Height,
            IsPublic = createDesignDto.IsPublic,
            CreatedAt = DateTime.UtcNow
        };

        var createdDesign = await _designRepository.AddAsync(design);
        return MapToDto(createdDesign);
    }

    public async Task<DesignDto?> UpdateDesignAsync(int id, int userId, UpdateDesignDto updateDesignDto)
    {
        var design = await _designRepository.GetByIdAsync(id);
        if (design == null || design.UserId != userId) return null;

        design.Name = updateDesignDto.Name;
        design.CanvasData = updateDesignDto.CanvasData;
        design.PreviewImageUrl = updateDesignDto.PreviewImageUrl;
        design.Width = updateDesignDto.Width;
        design.Height = updateDesignDto.Height;
        design.IsPublic = updateDesignDto.IsPublic;
        design.UpdatedAt = DateTime.UtcNow;

        await _designRepository.UpdateAsync(design);
        return MapToDto(design);
    }

    public async Task<bool> DeleteDesignAsync(int id, int userId)
    {
        var design = await _designRepository.GetByIdAsync(id);
        if (design == null || design.UserId != userId) return false;

        await _designRepository.DeleteAsync(design);
        return true;
    }

    public async Task<bool> IncrementViewCountAsync(int id)
    {
        await _designRepository.IncrementViewCountAsync(id);
        return true;
    }

    public async Task<string> GeneratePreviewImageAsync(string canvasData)
    {
        // TODO: Implement canvas to image conversion
        // This would typically involve using a service like Puppeteer or similar
        // to render the canvas data to an image
        return "preview-placeholder.jpg";
    }

    private static DesignDto MapToDto(Design design)
    {
        return new DesignDto
        {
            Id = design.Id,
            UserId = design.UserId,
            Name = design.Name,
            CanvasData = design.CanvasData,
            PreviewImageUrl = design.PreviewImageUrl,
            Width = design.Width,
            Height = design.Height,
            IsPublic = design.IsPublic,
            ViewCount = design.ViewCount,
            CreatedAt = design.CreatedAt,
            UpdatedAt = design.UpdatedAt,
            UserName = design.User?.FirstName + " " + design.User?.LastName ?? ""
        };
    }

    private static DesignListDto MapToListDto(Design design)
    {
        return new DesignListDto
        {
            Id = design.Id,
            Name = design.Name,
            PreviewImageUrl = design.PreviewImageUrl,
            Width = design.Width,
            Height = design.Height,
            ViewCount = design.ViewCount,
            CreatedAt = design.CreatedAt
        };
    }
}
