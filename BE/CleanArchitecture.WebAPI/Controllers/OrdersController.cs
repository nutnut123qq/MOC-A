using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using CleanArchitecture.Application.Interfaces;
using CleanArchitecture.Application.DTOs;
using CleanArchitecture.Domain.Entities;
using System.Security.Claims;

namespace CleanArchitecture.WebAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class OrdersController : ControllerBase
{
    private readonly IOrderService _orderService;
    private readonly ILogger<OrdersController> _logger;

    public OrdersController(IOrderService orderService, ILogger<OrdersController> logger)
    {
        _orderService = orderService;
        _logger = logger;
    }

    private int GetCurrentUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return int.TryParse(userIdClaim, out var userId) ? userId : 0;
    }

    private bool IsAdmin()
    {
        var roleClaim = User.FindFirst(ClaimTypes.Role)?.Value;
        return roleClaim == "Admin";
    }

    [HttpGet]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<IEnumerable<OrderDto>>> GetAllOrders()
    {
        try
        {
            var orders = await _orderService.GetAllOrdersAsync();
            return Ok(orders);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting all orders");
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpGet("my")]
    public async Task<ActionResult<IEnumerable<OrderDto>>> GetMyOrders()
    {
        try
        {
            var userId = GetCurrentUserId();
            if (userId == 0)
            {
                return Unauthorized("Invalid user");
            }

            var orders = await _orderService.GetUserOrdersAsync(userId);
            return Ok(orders);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting user orders");
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<OrderDto>> GetOrder(int id)
    {
        try
        {
            var userId = GetCurrentUserId();
            if (userId == 0)
            {
                return Unauthorized("Invalid user");
            }

            OrderDto? order;
            if (IsAdmin())
            {
                order = await _orderService.GetOrderByIdAsync(id);
            }
            else
            {
                order = await _orderService.GetOrderByIdAsync(id, userId);
            }

            if (order == null)
            {
                return NotFound("Order not found");
            }

            return Ok(order);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting order {OrderId}", id);
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpPost]
    public async Task<ActionResult<OrderDto>> CreateOrder([FromBody] CreateOrderDto createOrderDto)
    {
        try
        {
            var userId = GetCurrentUserId();
            if (userId == 0)
            {
                return Unauthorized("Invalid user");
            }

            var order = await _orderService.CreateOrderAsync(userId, createOrderDto);
            return CreatedAtAction(nameof(GetOrder), new { id = order.Id }, order);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating order");
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpPost("from-cart")]
    public async Task<ActionResult<OrderDto>> CreateOrderFromCart([FromBody] CreateOrderDto createOrderDto)
    {
        try
        {
            var userId = GetCurrentUserId();
            if (userId == 0)
            {
                return Unauthorized("Invalid user");
            }

            var order = await _orderService.CreateOrderFromCartAsync(userId, createOrderDto);
            return CreatedAtAction(nameof(GetOrder), new { id = order.Id }, order);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating order from cart");
            return StatusCode(500, "Internal server error");
        }
    }



    [HttpPost("{id}/cancel")]
    public async Task<ActionResult> CancelOrder(int id)
    {
        try
        {
            var userId = GetCurrentUserId();
            if (userId == 0)
            {
                return Unauthorized("Invalid user");
            }

            var success = await _orderService.CancelOrderAsync(id, userId);
            if (!success)
            {
                return BadRequest("Cannot cancel this order");
            }

            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error cancelling order {OrderId}", id);
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpPut("{id}/payment-status")]
    public async Task<ActionResult> UpdatePaymentStatus(int id, [FromBody] UpdatePaymentStatusDto dto)
    {
        try
        {
            var userId = GetCurrentUserId();
            if (userId == 0)
            {
                return Unauthorized("Invalid user");
            }

            // Get order to verify ownership
            var order = await _orderService.GetByIdAsync(id);
            if (order == null || order.UserId != userId)
            {
                return NotFound("Order not found");
            }

            await _orderService.UpdatePaymentStatusAsync(id, dto.PaymentStatus);
            _logger.LogInformation("Payment status updated for order {OrderId} to {PaymentStatus}", id, dto.PaymentStatus);

            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating payment status for order {OrderId}", id);
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpPut("{id}/status")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<OrderDto>> UpdateOrderStatus(int id, [FromBody] UpdateOrderStatusDto updateStatusDto)
    {
        try
        {
            var order = await _orderService.UpdateOrderStatusAsync(id, updateStatusDto.Status);
            if (order == null)
            {
                return NotFound("Order not found");
            }

            return Ok(order);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating order status for order {OrderId}", id);
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpGet("{id}/status-history")]
    public async Task<ActionResult<IEnumerable<OrderStatusHistoryDto>>> GetOrderStatusHistory(int id)
    {
        try
        {
            var userId = GetCurrentUserId();
            if (userId == 0)
            {
                return Unauthorized("Invalid user");
            }

            // Check if user owns the order or is admin
            OrderDto? order;
            if (IsAdmin())
            {
                order = await _orderService.GetOrderByIdAsync(id);
            }
            else
            {
                order = await _orderService.GetOrderByIdAsync(id, userId);
            }

            if (order == null)
            {
                return NotFound("Order not found");
            }

            // For now, return simple status history based on current status
            var statusHistory = GetStatusHistoryFromCurrentStatus(order.Status, order.CreatedAt, order.CompletedAt);
            return Ok(statusHistory);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting order status history for order {OrderId}", id);
            return StatusCode(500, "Internal server error");
        }
    }

    private List<OrderStatusHistoryDto> GetStatusHistoryFromCurrentStatus(OrderStatus currentStatus, DateTime createdAt, DateTime? completedAt)
    {
        var history = new List<OrderStatusHistoryDto>();
        var currentTime = DateTime.UtcNow;

        // Always add Pending status
        history.Add(new OrderStatusHistoryDto
        {
            Status = OrderStatus.Pending,
            StatusName = "Chờ xử lý",
            Timestamp = createdAt,
            IsCompleted = true,
            Description = "Đơn hàng đã được tạo và đang chờ xử lý"
        });

        if (currentStatus >= OrderStatus.Confirmed)
        {
            history.Add(new OrderStatusHistoryDto
            {
                Status = OrderStatus.Confirmed,
                StatusName = "Đã xác nhận",
                Timestamp = createdAt.AddMinutes(5), // Estimate
                IsCompleted = true,
                Description = "Đơn hàng đã được xác nhận và chuẩn bị in"
            });
        }

        if (currentStatus >= OrderStatus.Printing)
        {
            history.Add(new OrderStatusHistoryDto
            {
                Status = OrderStatus.Printing,
                StatusName = "Đang in",
                Timestamp = createdAt.AddHours(1), // Estimate
                IsCompleted = currentStatus > OrderStatus.Printing,
                Description = "Decal đang được in với chất lượng cao"
            });
        }

        if (currentStatus >= OrderStatus.Shipping)
        {
            history.Add(new OrderStatusHistoryDto
            {
                Status = OrderStatus.Shipping,
                StatusName = "Đang giao",
                Timestamp = createdAt.AddHours(24), // Estimate
                IsCompleted = currentStatus > OrderStatus.Shipping,
                Description = "Đơn hàng đang được giao đến địa chỉ của bạn"
            });
        }

        if (currentStatus == OrderStatus.Completed)
        {
            history.Add(new OrderStatusHistoryDto
            {
                Status = OrderStatus.Completed,
                StatusName = "Hoàn thành",
                Timestamp = completedAt ?? currentTime,
                IsCompleted = true,
                Description = "Đơn hàng đã được giao thành công"
            });
        }

        if (currentStatus == OrderStatus.Cancelled)
        {
            history.Add(new OrderStatusHistoryDto
            {
                Status = OrderStatus.Cancelled,
                StatusName = "Đã hủy",
                Timestamp = completedAt ?? currentTime,
                IsCompleted = true,
                Description = "Đơn hàng đã được hủy"
            });
        }

        return history;
    }
}
