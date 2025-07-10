using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using CleanArchitecture.Application.Interfaces;
using CleanArchitecture.Application.DTOs;
using System.Security.Claims;

namespace CleanArchitecture.WebAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class CartController : ControllerBase
{
    private readonly ICartService _cartService;
    private readonly ILogger<CartController> _logger;

    public CartController(ICartService cartService, ILogger<CartController> logger)
    {
        _cartService = cartService;
        _logger = logger;
    }

    private int GetCurrentUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return int.TryParse(userIdClaim, out var userId) ? userId : 0;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<CartDto>>> GetCart()
    {
        try
        {
            var userId = GetCurrentUserId();
            if (userId == 0)
            {
                return Unauthorized("Invalid user");
            }

            var cartItems = await _cartService.GetUserCartAsync(userId);
            return Ok(cartItems);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting cart");
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpPost("add")]
    public async Task<ActionResult<CartDto>> AddToCart([FromBody] AddToCartDto addToCartDto)
    {
        try
        {
            var userId = GetCurrentUserId();
            if (userId == 0)
            {
                return Unauthorized("Invalid user");
            }

            var cartItem = await _cartService.AddToCartAsync(userId, addToCartDto);
            return Ok(cartItem);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error adding to cart");
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpPut("{cartItemId}")]
    public async Task<ActionResult<CartDto>> UpdateCartItem(int cartItemId, [FromBody] UpdateCartItemDto updateCartItemDto)
    {
        try
        {
            var userId = GetCurrentUserId();
            if (userId == 0)
            {
                return Unauthorized("Invalid user");
            }

            var cartItem = await _cartService.UpdateCartItemAsync(userId, cartItemId, updateCartItemDto);
            if (cartItem == null)
            {
                return NotFound("Cart item not found");
            }

            return Ok(cartItem);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating cart item {CartItemId}", cartItemId);
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpDelete("{cartItemId}")]
    public async Task<ActionResult> RemoveFromCart(int cartItemId)
    {
        try
        {
            var userId = GetCurrentUserId();
            if (userId == 0)
            {
                return Unauthorized("Invalid user");
            }

            var success = await _cartService.RemoveFromCartAsync(userId, cartItemId);
            if (!success)
            {
                return NotFound("Cart item not found");
            }

            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error removing cart item {CartItemId}", cartItemId);
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpDelete("clear")]
    public async Task<ActionResult> ClearCart()
    {
        try
        {
            var userId = GetCurrentUserId();
            if (userId == 0)
            {
                return Unauthorized("Invalid user");
            }

            await _cartService.ClearCartAsync(userId);
            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error clearing cart");
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpGet("count")]
    public async Task<ActionResult<int>> GetCartItemCount()
    {
        try
        {
            var userId = GetCurrentUserId();
            if (userId == 0)
            {
                return Unauthorized("Invalid user");
            }

            var count = await _cartService.GetCartItemCountAsync(userId);
            return Ok(count);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting cart count");
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpGet("total")]
    public async Task<ActionResult<decimal>> GetCartTotal()
    {
        try
        {
            var userId = GetCurrentUserId();
            if (userId == 0)
            {
                return Unauthorized("Invalid user");
            }

            var total = await _cartService.GetCartTotalAsync(userId);
            return Ok(total);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting cart total");
            return StatusCode(500, "Internal server error");
        }
    }
}
