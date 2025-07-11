using CleanArchitecture.Application.DTOs;
using CleanArchitecture.Application.Interfaces;
using CleanArchitecture.Domain.Entities;
using CleanArchitecture.Domain.Interfaces;

namespace CleanArchitecture.Application.Services;

public class CartService : ICartService
{
    private readonly ICartRepository _cartRepository;
    private readonly IDesignRepository _designRepository;
    private readonly IProductRepository _productRepository;
    private readonly IProductService _productService;

    public CartService(
        ICartRepository cartRepository,
        IDesignRepository designRepository,
        IProductRepository productRepository,
        IProductService productService)
    {
        _cartRepository = cartRepository;
        _designRepository = designRepository;
        _productRepository = productRepository;
        _productService = productService;
    }

    public async Task<IEnumerable<CartDto>> GetUserCartAsync(int userId)
    {
        var cartItems = await _cartRepository.GetUserCartWithDetailsAsync(userId);
        return cartItems.Select(MapToDto);
    }

    public async Task<CartDto> AddToCartAsync(int userId, AddToCartDto addToCartDto)
    {
        // Validate design exists and belongs to user
        var design = await _designRepository.GetByIdAsync(addToCartDto.DesignId);
        if (design == null || design.UserId != userId)
        {
            throw new ArgumentException("Design not found or access denied");
        }

        // Validate product exists
        var product = await _productRepository.GetByIdAsync(addToCartDto.ProductId);
        if (product == null || !product.IsActive)
        {
            throw new ArgumentException("Product not found or inactive");
        }

        // Calculate price
        var unitPrice = await _productService.CalculatePriceAsync(
            addToCartDto.ProductId, 
            addToCartDto.SizeWidth, 
            addToCartDto.SizeHeight);

        // Check if item already exists in cart
        var existingItem = await _cartRepository.GetCartItemAsync(
            userId, 
            addToCartDto.DesignId, 
            addToCartDto.ProductId);

        if (existingItem != null)
        {
            // Update existing item
            existingItem.Quantity += addToCartDto.Quantity;
            existingItem.SizeWidth = addToCartDto.SizeWidth;
            existingItem.SizeHeight = addToCartDto.SizeHeight;
            existingItem.UnitPrice = unitPrice;
            existingItem.TotalPrice = unitPrice * existingItem.Quantity;
            existingItem.SpecialInstructions = addToCartDto.SpecialInstructions;
            existingItem.UpdatedAt = DateTime.UtcNow;

            await _cartRepository.UpdateAsync(existingItem);
            
            // Reload with details
            var updatedItem = await _cartRepository.GetUserCartWithDetailsAsync(userId);
            var updated = updatedItem.First(c => c.Id == existingItem.Id);
            return MapToDto(updated);
        }
        else
        {
            // Create new cart item
            var cartItem = new Cart
            {
                UserId = userId,
                DesignId = addToCartDto.DesignId,
                ProductId = addToCartDto.ProductId,
                SizeWidth = addToCartDto.SizeWidth,
                SizeHeight = addToCartDto.SizeHeight,
                Quantity = addToCartDto.Quantity,
                UnitPrice = unitPrice,
                TotalPrice = unitPrice * addToCartDto.Quantity,
                SpecialInstructions = addToCartDto.SpecialInstructions,
                AddedAt = DateTime.UtcNow,
                CreatedAt = DateTime.UtcNow
            };

            var created = await _cartRepository.AddAsync(cartItem);
            
            // Reload with details
            var cartWithDetails = await _cartRepository.GetUserCartWithDetailsAsync(userId);
            var createdWithDetails = cartWithDetails.First(c => c.Id == created.Id);
            return MapToDto(createdWithDetails);
        }
    }

    public async Task<CartDto?> UpdateCartItemAsync(int userId, int cartItemId, UpdateCartItemDto updateCartItemDto)
    {
        var cartItem = await _cartRepository.GetByIdAsync(cartItemId);
        if (cartItem == null || cartItem.UserId != userId)
        {
            return null;
        }

        cartItem.Quantity = updateCartItemDto.Quantity;
        cartItem.TotalPrice = cartItem.UnitPrice * updateCartItemDto.Quantity;
        cartItem.SpecialInstructions = updateCartItemDto.SpecialInstructions;
        cartItem.UpdatedAt = DateTime.UtcNow;

        await _cartRepository.UpdateAsync(cartItem);
        
        // Reload with details
        var cartWithDetails = await _cartRepository.GetUserCartWithDetailsAsync(userId);
        var updatedWithDetails = cartWithDetails.FirstOrDefault(c => c.Id == cartItemId);
        return updatedWithDetails != null ? MapToDto(updatedWithDetails) : null;
    }

    public async Task<bool> RemoveFromCartAsync(int userId, int cartItemId)
    {
        var cartItem = await _cartRepository.GetByIdAsync(cartItemId);
        if (cartItem == null || cartItem.UserId != userId)
        {
            return false;
        }

        await _cartRepository.DeleteAsync(cartItem);
        return true;
    }

    public async Task<bool> ClearCartAsync(int userId)
    {
        await _cartRepository.ClearUserCartAsync(userId);
        return true;
    }

    public async Task<int> GetCartItemCountAsync(int userId)
    {
        return await _cartRepository.GetCartItemCountAsync(userId);
    }

    public async Task<decimal> GetCartTotalAsync(int userId)
    {
        return await _cartRepository.GetCartTotalAsync(userId);
    }

    public async Task<bool> MoveCartToOrderAsync(int userId, int orderId)
    {
        // This will be implemented when creating order from cart
        await _cartRepository.ClearUserCartAsync(userId);
        return true;
    }

    private static CartDto MapToDto(Cart cart)
    {
        return new CartDto
        {
            Id = cart.Id,
            UserId = cart.UserId,
            DesignId = cart.DesignId,
            ProductId = cart.ProductId,
            SizeWidth = cart.SizeWidth,
            SizeHeight = cart.SizeHeight,
            Quantity = cart.Quantity,
            UnitPrice = cart.UnitPrice,
            TotalPrice = cart.TotalPrice,
            SpecialInstructions = cart.SpecialInstructions,
            AddedAt = cart.AddedAt,
            CreatedAt = cart.CreatedAt,
            DesignName = cart.Design?.Name ?? "",
            DesignPreviewUrl = cart.Design?.PreviewImageUrl ?? "",
            DesignData = cart.Design?.DesignData ?? "",
            ProductName = cart.Product?.Name ?? "",
            ProductType = cart.Product?.Type ?? ProductType.Shirt
        };
    }
}
