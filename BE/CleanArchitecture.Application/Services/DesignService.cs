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

            // Generate and save preview image
            try
            {
                var previewImageUrl = await GenerateDesignPreviewAsync(userId, createdDesign.Id, finalDesignSession);
                if (!string.IsNullOrEmpty(previewImageUrl))
                {
                    createdDesign.PreviewImageUrl = previewImageUrl;
                    _logger.LogInformation("Generated preview image for design {DesignId}: {PreviewUrl}", createdDesign.Id, previewImageUrl);
                }
            }
            catch (Exception previewEx)
            {
                _logger.LogWarning(previewEx, "Failed to generate preview image for design {DesignId}", createdDesign.Id);
                // Continue without preview image - not critical
            }

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

            // Generate and save updated preview image
            try
            {
                var previewImageUrl = await GenerateDesignPreviewAsync(userId, id, processedDesignSession);
                if (!string.IsNullOrEmpty(previewImageUrl))
                {
                    design.PreviewImageUrl = previewImageUrl;
                    _logger.LogInformation("Updated preview image for design {DesignId}: {PreviewUrl}", id, previewImageUrl);
                }
            }
            catch (Exception previewEx)
            {
                _logger.LogWarning(previewEx, "Failed to update preview image for design {DesignId}", id);
                // Continue without preview image - not critical
            }

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

                // Ensure required fields are populated if missing
                if (designSession != null)
                {
                    if (string.IsNullOrEmpty(designSession.Id))
                        designSession.Id = $"session-{design.Id}";

                    if (designSession.TshirtId == 0)
                        designSession.TshirtId = 1; // Default T-shirt ID

                    if (string.IsNullOrEmpty(designSession.CurrentPrintArea))
                        designSession.CurrentPrintArea = "front";

                    if (string.IsNullOrEmpty(designSession.CreatedAt))
                        designSession.CreatedAt = design.CreatedAt.ToString("O");

                    if (string.IsNullOrEmpty(designSession.UpdatedAt))
                        designSession.UpdatedAt = (design.UpdatedAt ?? design.CreatedAt).ToString("O");
                }
            }
            catch (JsonException ex)
            {
                // Log error but don't fail the mapping
                Console.WriteLine($"Error deserializing design session for design {design.Id}: {ex.Message}");
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
                Id = designSession.Id ?? $"session-{DateTime.UtcNow.Ticks}",
                TshirtId = designSession.TshirtId,
                SelectedSize = designSession.SelectedSize,
                SelectedColor = designSession.SelectedColor,
                CurrentPrintArea = designSession.CurrentPrintArea ?? "front",
                CreatedAt = designSession.CreatedAt ?? DateTime.UtcNow.ToString("O"),
                UpdatedAt = DateTime.UtcNow.ToString("O"),
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

    /// <summary>
    /// Generate preview image for design session
    /// This is a simplified implementation - in production you might want to use a more sophisticated image generation service
    /// </summary>
    private async Task<string?> GenerateDesignPreviewAsync(int userId, int designId, TShirtDesignSessionDto designSession)
    {
        try
        {
            _logger.LogInformation("Generating preview image for design {DesignId}", designId);

            // For now, we'll create a simple placeholder preview
            // In a real implementation, you would:
            // 1. Load the T-shirt template image
            // 2. Render all design layers on top
            // 3. Save the composite image

            // Create a simple preview metadata JSON that frontend can use
            var previewData = new
            {
                designId = designId,
                selectedSize = designSession.SelectedSize,
                selectedColor = designSession.SelectedColor,
                layerCount = designSession.DesignLayers?.Count ?? 0,
                frontLayers = designSession.DesignLayers?.Count(l => l.PrintArea == "front") ?? 0,
                backLayers = designSession.DesignLayers?.Count(l => l.PrintArea == "back") ?? 0,
                generatedAt = DateTime.UtcNow
            };

            var previewJson = JsonSerializer.Serialize(previewData);
            var previewBytes = System.Text.Encoding.UTF8.GetBytes(previewJson);

            // Save preview metadata as a file (this will be replaced by actual image generation)
            var previewPath = await _fileStorageService.SaveDesignImageAsync(
                userId,
                designId,
                "preview",
                previewBytes,
                "preview.json",
                "application/json"
            );

            _logger.LogInformation("Generated preview metadata for design {DesignId}: {PreviewPath}", designId, previewPath);
            return previewPath;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to generate preview for design {DesignId}", designId);
            return null;
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
