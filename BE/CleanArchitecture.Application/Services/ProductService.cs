using CleanArchitecture.Application.DTOs;
using CleanArchitecture.Application.Interfaces;
using CleanArchitecture.Domain.Entities;
using CleanArchitecture.Domain.Interfaces;

namespace CleanArchitecture.Application.Services;

public class ProductService : IProductService
{
    private readonly IProductRepository _productRepository;

    public ProductService(IProductRepository productRepository)
    {
        _productRepository = productRepository;
    }

    public async Task<IEnumerable<ProductDto>> GetAllProductsAsync()
    {
        var products = await _productRepository.GetWithMockupsAsync();
        return products.Select(MapToDto);
    }

    public async Task<IEnumerable<ProductDto>> GetActiveProductsAsync()
    {
        var products = await _productRepository.GetActiveProductsAsync();
        return products.Select(MapToDto);
    }

    public async Task<IEnumerable<ProductDto>> GetProductsByTypeAsync(ProductType type)
    {
        var products = await _productRepository.GetByTypeAsync(type);
        return products.Select(MapToDto);
    }

    public async Task<ProductDto?> GetProductByIdAsync(int id)
    {
        var product = await _productRepository.GetByIdAsync(id);
        return product != null ? MapToDto(product) : null;
    }

    public async Task<ProductDto?> GetProductWithMockupsAsync(int id)
    {
        var product = await _productRepository.GetWithMockupsAsync(id);
        return product != null ? MapToDto(product) : null;
    }

    public async Task<ProductDto> CreateProductAsync(CreateProductDto createProductDto)
    {
        var product = new Product
        {
            Name = createProductDto.Name,
            Type = createProductDto.Type,
            Description = createProductDto.Description,
            MockupImageUrl = createProductDto.MockupImageUrl,
            BasePrice = createProductDto.BasePrice,
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };

        var createdProduct = await _productRepository.AddAsync(product);
        return MapToDto(createdProduct);
    }

    public async Task<ProductDto?> UpdateProductAsync(int id, UpdateProductDto updateProductDto)
    {
        var product = await _productRepository.GetByIdAsync(id);
        if (product == null) return null;

        product.Name = updateProductDto.Name;
        product.Description = updateProductDto.Description;
        product.MockupImageUrl = updateProductDto.MockupImageUrl;
        product.BasePrice = updateProductDto.BasePrice;
        product.IsActive = updateProductDto.IsActive;
        product.UpdatedAt = DateTime.UtcNow;

        await _productRepository.UpdateAsync(product);
        return MapToDto(product);
    }

    public async Task<bool> DeleteProductAsync(int id)
    {
        var product = await _productRepository.GetByIdAsync(id);
        if (product == null) return false;

        await _productRepository.DeleteAsync(product);
        return true;
    }

    public async Task<decimal> CalculatePriceAsync(int productId, decimal width, decimal height)
    {
        var product = await _productRepository.GetByIdAsync(productId);
        if (product == null) return 0;

        decimal price;

        // Determine product type based on size
        // If size >= 150, it's combo (T-shirt + decal)
        // If size < 150, it's decal-only
        var maxSize = Math.Max(width, height);

        if (maxSize >= 150)
        {
            // Combo: T-shirt + decal (fixed price)
            price = 149000m; // 149,000 VND for combo
        }
        else
        {
            // Decal only: calculate based on size using formula (size + 5) * 1000
            // NOTE: This is simplified - frontend should calculate total for multiple elements
            // and pass the total as a single size value
            price = (maxSize + 5) * 1000m;
        }



        return price;
    }

    // New method to calculate price based on design data
    public async Task<decimal> CalculatePriceFromDesignAsync(int productId, int designId)
    {
        var product = await _productRepository.GetByIdAsync(productId);
        if (product == null) return 0;

        var design = await _designRepository.GetByIdAsync(designId);
        if (design == null) return 0;

        // Parse design session to get elements
        try
        {
            var designSession = System.Text.Json.JsonSerializer.Deserialize<dynamic>(design.CanvasData);
            // TODO: Parse design layers and calculate total price for all elements
            // For now, fallback to existing logic
            return await CalculatePriceAsync(productId, design.Width, design.Height);
        }
        catch
        {
            // Fallback to existing logic
            return await CalculatePriceAsync(productId, design.Width, design.Height);
        }
    }

    private static ProductDto MapToDto(Product product)
    {
        return new ProductDto
        {
            Id = product.Id,
            Name = product.Name,
            Type = product.Type,
            TypeName = product.Type.ToString(),
            Description = product.Description,
            MockupImageUrl = product.MockupImageUrl,
            BasePrice = product.BasePrice,
            IsActive = product.IsActive,
            CreatedAt = product.CreatedAt,
            Mockups = product.Mockups?.Select(m => new MockupDto
            {
                Id = m.Id,
                ProductId = m.ProductId,
                Name = m.Name,
                ImageUrl = m.ImageUrl,
                OverlayCoordinates = m.OverlayCoordinates,
                MaxWidth = m.MaxWidth,
                MaxHeight = m.MaxHeight,
                IsDefault = m.IsDefault,
                SortOrder = m.SortOrder
            }).ToList() ?? new List<MockupDto>()
        };
    }
}
