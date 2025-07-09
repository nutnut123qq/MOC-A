using System.Text.Json;
using System.Text.RegularExpressions;
using CleanArchitecture.Application.DTOs.Design;
using CleanArchitecture.Application.Interfaces;
using CleanArchitecture.Domain.Entities;
using CleanArchitecture.Domain.Interfaces;
using Microsoft.Extensions.Logging;

namespace CleanArchitecture.Application.Services;

public class DesignService : IDesignService
{
    private readonly IDesignRepository _designRepository;
    private readonly IProductRepository _productRepository;
    private readonly IFileStorageService _fileStorageService;
    private readonly ITempFileService _tempFileService;
    private readonly ILogger<DesignService> _logger;

    public DesignService(
        IDesignRepository designRepository,
        IProductRepository productRepository,
        IFileStorageService fileStorageService,
        ITempFileService tempFileService,
        ILogger<DesignService> logger)
    {
        _designRepository = designRepository;
        _productRepository = productRepository;
        _fileStorageService = fileStorageService;
        _tempFileService = tempFileService;
        _logger = logger;
    }

    public async Task<IEnumerable<DesignDto>> GetUserDesignsAsync(int userId)
    {
        try
        {
            var designs = await _designRepository.GetByUserIdAsync(userId);
            return designs.Select(MapToDto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting designs for user {UserId}", userId);
            throw;
        }
    }

    public async Task<DesignDto?> GetDesignByIdAsync(int id, int userId)
    {
        try
        {
            var design = await _designRepository.GetByIdAndUserIdAsync(id, userId);
            return design != null ? MapToDto(design) : null;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting design {DesignId} for user {UserId}", id, userId);
            throw;
        }
    }

    public async Task<DesignDto> CreateDesignAsync(int userId, CreateDesignDto createDesignDto)
    {
        try
        {
            // Validate product exists or create default one
            var product = await _productRepository.GetByIdAsync(createDesignDto.ProductId);
            if (product == null)
            {
                // Create default product if it doesn't exist
                product = new Product
                {
                    Name = "Default T-Shirt",
                    Description = "Default t-shirt for custom designs",
                    Type = ProductType.Shirt,
                    BasePrice = 15.99m,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                await _productRepository.AddAsync(product);
                Console.WriteLine($"Created default product with ID: {product.Id}");
            }

            // Process design session to convert base64 images to files
            var processedDesignSession = await ProcessDesignSessionAsync(userId, 0, createDesignDto.DesignSession);

            var design = new Design
            {
                UserId = userId,
                Name = createDesignDto.Name,
                Description = createDesignDto.Description,
                ProductId = createDesignDto.ProductId,
                DesignData = JsonSerializer.Serialize(processedDesignSession),
                CreatedAt = DateTime.UtcNow
            };

            var createdDesign = await _designRepository.AddAsync(design);

            // Update design ID in processed session and save again
            var finalDesignSession = await ProcessDesignSessionAsync(userId, createdDesign.Id, createDesignDto.DesignSession);
            createdDesign.DesignData = JsonSerializer.Serialize(finalDesignSession);
            await _designRepository.UpdateAsync(createdDesign);

            _logger.LogInformation("Created design {DesignId} for user {UserId}", createdDesign.Id, userId);

            return MapToDto(createdDesign);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating design for user {UserId}", userId);
            throw;
        }
    }

    public async Task<DesignDto?> UpdateDesignAsync(int id, int userId, UpdateDesignDto updateDesignDto)
    {
        try
        {
            var design = await _designRepository.GetByIdAndUserIdAsync(id, userId);
            if (design == null) return null;

            // Process design session to convert base64 images to files
            var processedDesignSession = await ProcessDesignSessionAsync(userId, id, updateDesignDto.DesignSession);

            design.Name = updateDesignDto.Name;
            design.Description = updateDesignDto.Description;
            design.DesignData = JsonSerializer.Serialize(processedDesignSession);
            design.UpdatedAt = DateTime.UtcNow;

            await _designRepository.UpdateAsync(design);
            _logger.LogInformation("Updated design {DesignId} for user {UserId}", id, userId);

            return MapToDto(design);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating design {DesignId} for user {UserId}", id, userId);
            throw;
        }
    }

    public async Task<bool> DeleteDesignAsync(int id, int userId)
    {
        try
        {
            var design = await _designRepository.GetByIdAndUserIdAsync(id, userId);
            if (design == null) return false;

            await _designRepository.DeleteAsync(design);
            _logger.LogInformation("Deleted design {DesignId} for user {UserId}", id, userId);

            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting design {DesignId} for user {UserId}", id, userId);
            throw;
        }
    }

    public async Task<DesignDto> CloneDesignAsync(int id, int userId, string newName)
    {
        try
        {
            var originalDesign = await _designRepository.GetByIdAndUserIdAsync(id, userId);
            if (originalDesign == null)
            {
                throw new ArgumentException($"Design with ID {id} not found or not owned by user {userId}");
            }

            var clonedDesign = new Design
            {
                UserId = userId,
                Name = newName,
                Description = originalDesign.Description,
                ProductId = originalDesign.ProductId,
                DesignData = originalDesign.DesignData, // Copy design data
                CreatedAt = DateTime.UtcNow
            };

            var createdDesign = await _designRepository.AddAsync(clonedDesign);
            _logger.LogInformation("Cloned design {OriginalId} to {NewId} for user {UserId}", id, createdDesign.Id, userId);

            return MapToDto(createdDesign);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error cloning design {DesignId} for user {UserId}", id, userId);
            throw;
        }
    }

    private static DesignDto MapToDto(Design design)
    {
        TShirtDesignSessionDto? designSession = null;

        if (!string.IsNullOrEmpty(design.DesignData))
        {
            try
            {
                designSession = JsonSerializer.Deserialize<TShirtDesignSessionDto>(design.DesignData);
            }
            catch (JsonException)
            {
                // Log error but don't fail the mapping
                designSession = null;
            }
        }

        return new DesignDto
        {
            Id = design.Id,
            Name = design.Name,
            Description = design.Description,
            ProductId = design.ProductId,
            ProductName = design.Product?.Name ?? "",
            PreviewImageUrl = design.PreviewImageUrl,
            CreatedAt = design.CreatedAt,
            UpdatedAt = design.UpdatedAt ?? design.CreatedAt,
            DesignSession = designSession
        };
    }

    /// <summary>
    /// Process design session to convert base64 images to files
    /// </summary>
    private async Task<TShirtDesignSessionDto> ProcessDesignSessionAsync(int userId, int designId, TShirtDesignSessionDto designSession)
    {
        try
        {
            var processedSession = new TShirtDesignSessionDto
            {
                SelectedSize = designSession.SelectedSize,
                SelectedColor = designSession.SelectedColor,
                DesignLayers = new List<DesignLayerDto>()
            };

            foreach (var layer in designSession.DesignLayers)
            {
                var processedLayer = new DesignLayerDto
                {
                    Id = layer.Id,
                    Type = layer.Type,
                    PrintArea = layer.PrintArea,
                    Position = layer.Position,
                    Style = layer.Style,
                    Transform = layer.Transform,
                    Locked = layer.Locked,
                    Visible = layer.Visible,
                    Data = layer.Data,
                    Content = layer.Content
                };

                // Process image layers - check both Data and Content fields
                if (layer.Type == "image")
                {
                    // First try to process Content field (new format)
                    if (layer.Content != null)
                    {
                        var contentString = layer.Content.ToString();
                        _logger.LogInformation($"🔍 Processing Content field for layer {layer.Id}: {contentString?.Substring(0, Math.Min(100, contentString?.Length ?? 0))}...");

                        // Check if it's temp file data (JSON format)
                        if (IsTempFileData(contentString))
                        {
                            try
                            {
                                // Parse temp file data and move to permanent storage
                                var tempFileInfo = System.Text.Json.JsonSerializer.Deserialize<TempFileInfo>(contentString);
                                if (tempFileInfo != null && !string.IsNullOrEmpty(tempFileInfo.TempPath))
                                {
                                    var permanentPath = await _tempFileService.MoveTempFileToPermanentAsync(
                                        tempFileInfo.TempPath,
                                        designId,
                                        layer.Id,
                                        userId
                                    );

                                    // Update layer data with permanent file path
                                    processedLayer.Data = new
                                    {
                                        filePath = permanentPath,
                                        type = "file",
                                        originalFile = tempFileInfo.OriginalFile,
                                        fileSize = tempFileInfo.FileSize
                                    };

                                    _logger.LogInformation($"✅ Moved temp file to permanent storage: {permanentPath}");
                                }
                            }
                            catch (Exception ex)
                            {
                                _logger.LogWarning(ex, $"⚠️ Failed to process temp file for layer {layer.Id}, keeping original content");
                            }
                        }
                        else if (IsBase64ImageData(contentString))
                        {
                            // Handle base64 data (fallback)
                            try
                            {
                                var filePath = await _fileStorageService.SaveDesignImageFromBase64Async(
                                    userId,
                                    designId,
                                    layer.Id,
                                    contentString,
                                    $"layer-{layer.Id}.jpg"
                                );

                                processedLayer.Data = new
                                {
                                    filePath = filePath,
                                    type = "file"
                                };

                                _logger.LogInformation($"✅ Converted base64 image to file: {filePath}");
                            }
                            catch (Exception ex)
                            {
                                _logger.LogWarning(ex, $"⚠️ Failed to convert base64 image for layer {layer.Id}");
                            }
                        }
                    }
                    // Fallback to Data field (legacy format)
                    else if (layer.Data != null)
                    {
                        var dataString = layer.Data.ToString();
                        _logger.LogInformation($"🔍 Processing Data field for layer {layer.Id} (legacy)");

                        if (IsBase64ImageData(dataString))
                        {
                            try
                            {
                                var filePath = await _fileStorageService.SaveDesignImageFromBase64Async(
                                    userId,
                                    designId,
                                    layer.Id,
                                    dataString,
                                    $"layer-{layer.Id}.jpg"
                                );

                                processedLayer.Data = new
                                {
                                    filePath = filePath,
                                    type = "file"
                                };

                                _logger.LogInformation($"✅ Converted base64 image to file: {filePath}");
                            }
                            catch (Exception ex)
                            {
                                _logger.LogWarning(ex, $"⚠️ Failed to convert base64 image for layer {layer.Id}");
                            }
                        }
                        else if (IsFilePathData(dataString))
                        {
                            _logger.LogInformation($"📁 Layer {layer.Id} already uses file storage");
                        }
                    }
                }

                processedSession.DesignLayers.Add(processedLayer);
            }

            return processedSession;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"❌ Error processing design session for user {userId}, design {designId}");
            // Return original session if processing fails
            return designSession;
        }
    }

    /// <summary>
    /// Check if data is base64 image format
    /// </summary>
    private static bool IsBase64ImageData(string? data)
    {
        if (string.IsNullOrEmpty(data)) return false;

        // Check for base64 image format: data:image/...;base64,...
        return Regex.IsMatch(data, @"^data:image\/[^;]+;base64,", RegexOptions.IgnoreCase);
    }

    /// <summary>
    /// Check if data is temp file format (JSON with tempPath)
    /// </summary>
    private static bool IsTempFileData(string? data)
    {
        if (string.IsNullOrEmpty(data)) return false;

        try
        {
            var tempFileInfo = System.Text.Json.JsonSerializer.Deserialize<TempFileInfo>(data);
            return tempFileInfo != null && !string.IsNullOrEmpty(tempFileInfo.TempPath);
        }
        catch
        {
            return false;
        }
    }

    /// <summary>
    /// Check if data contains file path
    /// </summary>
    private static bool IsFilePathData(string? data)
    {
        if (string.IsNullOrEmpty(data)) return false;

        try
        {
            // Try to parse as JSON to check for filePath property
            var jsonDoc = JsonDocument.Parse(data);
            return jsonDoc.RootElement.TryGetProperty("filePath", out _);
        }
        catch
        {
            return false;
        }
    }
}

/// <summary>
/// Temp file information structure
/// </summary>
public class TempFileInfo
{
    public string Type { get; set; } = string.Empty;
    public string TempPath { get; set; } = string.Empty;
    public string SessionId { get; set; } = string.Empty;
    public string OriginalFile { get; set; } = string.Empty;
    public long FileSize { get; set; }
}
