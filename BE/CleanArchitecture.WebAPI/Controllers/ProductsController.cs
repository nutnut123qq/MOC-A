using Microsoft.AspNetCore.Mvc;
using CleanArchitecture.Application.Interfaces;
using CleanArchitecture.Application.DTOs;
using CleanArchitecture.Domain.Entities;

namespace CleanArchitecture.WebAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly IProductService _productService;

    public ProductsController(IProductService productService)
    {
        _productService = productService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ProductDto>>> GetProducts()
    {
        try
        {
            var products = await _productService.GetActiveProductsAsync();
            return Ok(products);
        }
        catch (Exception ex)
        {
            // Return mock data for testing CORS
            var mockProducts = new List<ProductDto>
            {
                new ProductDto
                {
                    Id = 1,
                    Name = "Áo Thun",
                    Description = "Áo thun cotton 100%",
                    Type = ProductType.Shirt,
                    TypeName = "Áo Thun",
                    BasePrice = 150000,
                    IsActive = true,
                    CreatedAt = DateTime.Now
                },
                new ProductDto
                {
                    Id = 2,
                    Name = "Mũ Lưỡi Trai",
                    Description = "Mũ lưỡi trai thời trang",
                    Type = ProductType.Hat,
                    TypeName = "Mũ",
                    BasePrice = 80000,
                    IsActive = true,
                    CreatedAt = DateTime.Now
                },
                new ProductDto
                {
                    Id = 3,
                    Name = "Túi Canvas",
                    Description = "Túi canvas bền đẹp",
                    Type = ProductType.CanvasBag,
                    TypeName = "Túi",
                    BasePrice = 120000,
                    IsActive = true,
                    CreatedAt = DateTime.Now
                }
            };
            return Ok(mockProducts);
        }
    }

    [HttpGet("type/{type}")]
    public async Task<ActionResult<IEnumerable<ProductDto>>> GetProductsByType(ProductType type)
    {
        var products = await _productService.GetProductsByTypeAsync(type);
        return Ok(products);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ProductDto>> GetProduct(int id)
    {
        var product = await _productService.GetProductWithMockupsAsync(id);
        if (product == null)
        {
            return NotFound();
        }

        return Ok(product);
    }

    [HttpPost]
    public async Task<ActionResult<ProductDto>> CreateProduct([FromBody] CreateProductDto createProductDto)
    {
        var product = await _productService.CreateProductAsync(createProductDto);
        return CreatedAtAction(nameof(GetProduct), new { id = product.Id }, product);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<ProductDto>> UpdateProduct(int id, [FromBody] UpdateProductDto updateProductDto)
    {
        var product = await _productService.UpdateProductAsync(id, updateProductDto);
        if (product == null)
        {
            return NotFound();
        }

        return Ok(product);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteProduct(int id)
    {
        var result = await _productService.DeleteProductAsync(id);
        if (!result)
        {
            return NotFound();
        }

        return NoContent();
    }

    [HttpPost("calculate-price")]
    public async Task<ActionResult<decimal>> CalculatePrice([FromBody] CalculatePriceRequest request)
    {
        var price = await _productService.CalculatePriceAsync(request.ProductId, request.Width, request.Height);
        return Ok(new { price, productId = request.ProductId, width = request.Width, height = request.Height });
    }
}

public class CalculatePriceRequest
{
    public int ProductId { get; set; }
    public decimal Width { get; set; }
    public decimal Height { get; set; }
}
