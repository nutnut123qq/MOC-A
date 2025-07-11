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

            // Generate preview image URL from design layers
            try
            {
                var previewImageUrl = GetPreviewImageFromLayers(finalDesignSession);
                if (!string.IsNullOrEmpty(previewImageUrl))
                {
                    createdDesign.PreviewImageUrl = previewImageUrl;
                    _logger.LogInformation("Set preview image for design {DesignId}: {PreviewUrl}", createdDesign.Id, previewImageUrl);
                }
                else
                {
                    _logger.LogInformation("No temp file found for design {DesignId}, skipping preview", createdDesign.Id);
                }
            }
            catch (Exception previewEx)
            {
                _logger.LogWarning(previewEx, "Failed to set preview image for design {DesignId}", createdDesign.Id);
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

            // Update preview image URL from design layers
            try
            {
                var previewImageUrl = GetPreviewImageFromLayers(processedDesignSession);
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
                                if (tempFileInfo != null && !string.IsNullOrEmpty(tempFileInfo.tempPath))
                                {
                                    var permanentPath = await _tempFileService.CopyTempFileToPermanentAsync(
                                        tempFileInfo.tempPath,
                                        designId,
                                        layer.Id,
                                        userId
                                    );

                                    // Update layer data with permanent file path
                                    processedLayer.Data = new
                                    {
                                        filePath = permanentPath,
                                        type = "file",
                                        originalFile = tempFileInfo.originalFile,
                                        fileSize = tempFileInfo.fileSize
                                    };

                                    _logger.LogInformation($"✅ Copied temp file to permanent storage: {permanentPath}");
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
            return tempFileInfo != null && !string.IsNullOrEmpty(tempFileInfo.tempPath);
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
    /// Get preview image URL from design layers (use temp files if available)
    /// </summary>
    private string? GetPreviewImageFromLayers(TShirtDesignSessionDto designSession)
    {
        try
        {
            _logger.LogInformation("🔍 GetPreviewImageFromLayers: Starting preview search");

            // Debug: Log all layers
            if (designSession.DesignLayers != null)
            {
                foreach (var layer in designSession.DesignLayers)
                {
                    _logger.LogInformation("🔍 Layer {Id}: Type={Type}, Content={Content}",
                        layer.Id, layer.Type, layer.Content?.ToString()?.Substring(0, Math.Min(100, layer.Content?.ToString()?.Length ?? 0)));
                }
            }

            // Look for image layers with temp file paths
            var imageLayers = designSession.DesignLayers?
                .Where(layer => layer.Type == "image" && layer.Content != null)
                .ToList();

            _logger.LogInformation("🔍 Found {Count} total layers, {ImageCount} image layers",
                designSession.DesignLayers?.Count ?? 0, imageLayers?.Count ?? 0);

            if (imageLayers?.Any() == true)
            {
                _logger.LogInformation("Found {Count} image layers for preview", imageLayers.Count);

                foreach (var layer in imageLayers)
                {
                    var contentString = layer.Content.ToString();
                    _logger.LogInformation("Layer {LayerId} content: {Content}", layer.Id, contentString?.Substring(0, Math.Min(200, contentString?.Length ?? 0)));

                    // Check if it's temp file data
                    if (IsTempFileData(contentString))
                    {
                        _logger.LogInformation("Layer {LayerId} is temp file data", layer.Id);
                        try
                        {
                            var tempFileInfo = System.Text.Json.JsonSerializer.Deserialize<TempFileInfo>(contentString);
                            if (tempFileInfo != null && !string.IsNullOrEmpty(tempFileInfo.tempPath))
                            {
                                // Convert temp path to full URL
                                var fullUrl = $"http://localhost:5168{tempFileInfo.tempPath}";
                                _logger.LogInformation("Found temp file for preview: {TempPath}", fullUrl);
                                return fullUrl;
                            }
                        }
                        catch (Exception ex)
                        {
                            _logger.LogWarning(ex, "Failed to parse temp file data for layer {LayerId}", layer.Id);
                        }
                    }
                }
            }

            _logger.LogInformation("No suitable image layers found for preview");
            return null;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting preview image from layers");
            return null;
        }
    }

    /// <summary>
    /// Generate preview image for design session (fallback method)
    /// Creates a simple PNG preview image for the design
    /// </summary>
    private async Task<string?> GenerateDesignPreviewAsync(int userId, int designId, TShirtDesignSessionDto designSession)
    {
        try
        {
            _logger.LogInformation("Generating preview image for design {DesignId}", designId);

            // Create a simple preview PNG image
            var previewImageBytes = await CreatePreviewImageAsync(designSession);

            // Save preview image as PNG
            var previewPath = await _fileStorageService.SaveDesignImageAsync(
                userId,
                designId,
                "preview",
                previewImageBytes,
                $"layer-preview-{DateTimeOffset.UtcNow.ToUnixTimeSeconds()}-{designId}.png",
                "image/png"
            );

            _logger.LogInformation("Generated preview image for design {DesignId}: {PreviewPath}", designId, previewPath);
            return previewPath;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to generate preview for design {DesignId}", designId);
            return null;
        }
    }

    /// <summary>
    /// Create a simple preview image as PNG bytes
    /// </summary>
    private async Task<byte[]> CreatePreviewImageAsync(TShirtDesignSessionDto designSession)
    {
        try
        {
            // Create a simple but valid PNG image
            // Use a known working PNG format similar to the working designs

            // Create a 200x200 simple PNG (smaller size, easier to generate correctly)
            const int width = 200;
            const int height = 200;

            // Get color for the design
            var colorBytes = GetColorBytes(designSession.SelectedColor);

            // Create a simple valid PNG using BMP-to-PNG conversion
            return CreateValidPngImage(width, height, colorBytes);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating preview image");
            // Return a simple fallback PNG
            return CreateFallbackPng();
        }
    }

    private byte[] CreateValidPngImage(int width, int height, (byte R, byte G, byte B) color)
    {
        // Create a simple solid color PNG
        // This creates a minimal but valid PNG that browsers can display

        var pngData = new List<byte>();

        // PNG signature
        pngData.AddRange(new byte[] { 0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A });

        // IHDR chunk
        pngData.AddRange(BitConverter.GetBytes((uint)13).Reverse()); // Length
        pngData.AddRange(System.Text.Encoding.ASCII.GetBytes("IHDR"));
        pngData.AddRange(BitConverter.GetBytes((uint)width).Reverse());
        pngData.AddRange(BitConverter.GetBytes((uint)height).Reverse());
        pngData.Add(8); // Bit depth
        pngData.Add(2); // Color type (RGB)
        pngData.Add(0); // Compression
        pngData.Add(0); // Filter
        pngData.Add(0); // Interlace

        // Calculate and add CRC for IHDR
        var ihdrData = pngData.Skip(12).Take(17).ToArray();
        var ihdrCrc = CalculateCrc(ihdrData);
        pngData.AddRange(BitConverter.GetBytes(ihdrCrc).Reverse());

        // Create simple IDAT chunk with solid color
        var imageData = new List<byte>();
        for (int y = 0; y < height; y++)
        {
            imageData.Add(0); // Filter type for each row
            for (int x = 0; x < width; x++)
            {
                imageData.Add(color.R);
                imageData.Add(color.G);
                imageData.Add(color.B);
            }
        }

        // Compress the image data (very simple compression)
        var compressedData = SimpleCompress(imageData.ToArray());

        // IDAT chunk
        pngData.AddRange(BitConverter.GetBytes((uint)compressedData.Length).Reverse());
        pngData.AddRange(System.Text.Encoding.ASCII.GetBytes("IDAT"));
        pngData.AddRange(compressedData);

        // Calculate and add CRC for IDAT
        var idatData = System.Text.Encoding.ASCII.GetBytes("IDAT").Concat(compressedData).ToArray();
        var idatCrc = CalculateCrc(idatData);
        pngData.AddRange(BitConverter.GetBytes(idatCrc).Reverse());

        // IEND chunk
        pngData.AddRange(BitConverter.GetBytes((uint)0).Reverse()); // Length
        pngData.AddRange(System.Text.Encoding.ASCII.GetBytes("IEND"));
        pngData.AddRange(BitConverter.GetBytes(0xAE426082u).Reverse()); // CRC

        return pngData.ToArray();
    }

    private byte[] SimpleCompress(byte[] data)
    {
        // Very simple compression - just add deflate headers
        var compressed = new List<byte>();
        compressed.Add(0x78); // CMF
        compressed.Add(0x9C); // FLG

        // Add uncompressed blocks
        var blockSize = Math.Min(data.Length, 65535);
        compressed.Add(0x01); // Final block, uncompressed
        compressed.AddRange(BitConverter.GetBytes((ushort)blockSize));
        compressed.AddRange(BitConverter.GetBytes((ushort)~blockSize));
        compressed.AddRange(data.Take(blockSize));

        // Add Adler-32 checksum
        var adler = CalculateAdler32(data);
        compressed.AddRange(BitConverter.GetBytes(adler).Reverse());

        return compressed.ToArray();
    }

    private uint CalculateCrc(byte[] data)
    {
        // Simple CRC-32 calculation
        uint crc = 0xFFFFFFFF;
        foreach (byte b in data)
        {
            crc ^= b;
            for (int i = 0; i < 8; i++)
            {
                if ((crc & 1) != 0)
                    crc = (crc >> 1) ^ 0xEDB88320;
                else
                    crc >>= 1;
            }
        }
        return crc ^ 0xFFFFFFFF;
    }

    private uint CalculateAdler32(byte[] data)
    {
        uint a = 1, b = 0;
        foreach (byte c in data)
        {
            a = (a + c) % 65521;
            b = (b + a) % 65521;
        }
        return (b << 16) | a;
    }

    private byte[] CreateFallbackPng()
    {
        // Return a minimal valid 1x1 PNG as fallback
        return new byte[]
        {
            0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, // PNG signature
            0x00, 0x00, 0x00, 0x0D, 0x49, 0x48, 0x44, 0x52, // IHDR chunk header
            0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01, // 1x1 dimensions
            0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53, 0xDE, // IHDR data + CRC
            0x00, 0x00, 0x00, 0x0C, 0x49, 0x44, 0x41, 0x54, // IDAT chunk header
            0x08, 0x99, 0x01, 0x01, 0x00, 0x00, 0x00, 0xFF, 0xFF, 0x00, 0x00, 0x00, // IDAT data
            0x02, 0x00, 0x01, 0xE2, 0x21, 0xBC, 0x33, // IDAT CRC
            0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82 // IEND
        };
    }

    private (byte R, byte G, byte B) GetColorBytes(string? color)
    {
        return color?.ToLower() switch
        {
            "red" => (220, 53, 69),
            "blue" => (13, 110, 253),
            "green" => (25, 135, 84),
            "yellow" => (255, 193, 7),
            "purple" => (111, 66, 193),
            "pink" => (214, 51, 132),
            "orange" => (253, 126, 20),
            "black" => (33, 37, 41),
            "white" => (248, 249, 250),
            "gray" => (108, 117, 125),
            _ => (108, 117, 125) // Default gray
        };
    }


}

/// <summary>
/// Represents temp file information from design layers
/// </summary>
public class TempFileInfo
{
    public string type { get; set; } = string.Empty;
    public string tempPath { get; set; } = string.Empty;
    public string sessionId { get; set; } = string.Empty;
    public string originalFile { get; set; } = string.Empty;
    public long fileSize { get; set; }
}


