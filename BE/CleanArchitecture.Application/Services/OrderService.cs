using CleanArchitecture.Application.DTOs;
using CleanArchitecture.Application.Interfaces;
using CleanArchitecture.Domain.Entities;
using CleanArchitecture.Domain.Interfaces;
using Microsoft.Extensions.Logging;

namespace CleanArchitecture.Application.Services;

public class OrderService : IOrderService
{
    private readonly IOrderRepository _orderRepository;
    private readonly ICartRepository _cartRepository;
    private readonly IDesignRepository _designRepository;
    private readonly IProductRepository _productRepository;
    private readonly IProductService _productService;
    private readonly ICartService _cartService;
    private readonly ILogger<OrderService> _logger;

    public OrderService(
        IOrderRepository orderRepository,
        ICartRepository cartRepository,
        IDesignRepository designRepository,
        IProductRepository productRepository,
        IProductService productService,
        ICartService cartService,
        ILogger<OrderService> logger)
    {
        _orderRepository = orderRepository;
        _cartRepository = cartRepository;
        _designRepository = designRepository;
        _productRepository = productRepository;
        _productService = productService;
        _cartService = cartService;
        _logger = logger;
    }

    public async Task<IEnumerable<OrderDto>> GetAllOrdersAsync()
    {
        var orders = await _orderRepository.GetWithItemsAsync();
        return orders.Select(MapToDto);
    }

    public async Task<IEnumerable<OrderDto>> GetUserOrdersAsync(int userId)
    {
        var orders = await _orderRepository.GetUserOrdersAsync(userId);
        return orders.Select(MapToDto);
    }

    public async Task<OrderDto?> GetOrderByIdAsync(int id)
    {
        var order = await _orderRepository.GetOrderWithItemsAsync(id);
        return order != null ? MapToDto(order) : null;
    }

    public async Task<OrderDto?> GetOrderByIdAsync(int id, int userId)
    {
        var order = await _orderRepository.GetOrderWithItemsAsync(id);
        if (order == null || order.UserId != userId)
        {
            return null;
        }
        return MapToDto(order);
    }

    public async Task<OrderDto> CreateOrderAsync(int userId, CreateOrderDto createOrderDto)
    {
        try
        {
            // Generate order number
            var orderNumber = await _orderRepository.GenerateOrderNumberAsync();

            // Create order
            var order = new Order
            {
                UserId = userId,
                OrderNumber = orderNumber,
                CustomerName = createOrderDto.CustomerName,
                CustomerPhone = createOrderDto.CustomerPhone,
                CustomerEmail = createOrderDto.CustomerEmail,
                DeliveryAddress = createOrderDto.DeliveryAddress,
                Notes = createOrderDto.Notes,
                Status = OrderStatus.Pending,
                CreatedAt = DateTime.UtcNow,
                OrderItems = new List<OrderItem>()
            };

            decimal totalAmount = 0;

            // Add order items
            foreach (var itemDto in createOrderDto.OrderItems)
            {
                // Validate design exists
                var design = await _designRepository.GetByIdAsync(itemDto.DesignId);
                if (design == null)
                {
                    throw new ArgumentException($"Design with ID {itemDto.DesignId} not found");
                }

                // Validate product exists
                var product = await _productRepository.GetByIdAsync(itemDto.ProductId);
                if (product == null)
                {
                    throw new ArgumentException($"Product with ID {itemDto.ProductId} not found");
                }

                // Calculate price
                var unitPrice = await _productService.CalculatePriceAsync(
                    itemDto.ProductId,
                    itemDto.SizeWidth,
                    itemDto.SizeHeight);

                var totalPrice = unitPrice * itemDto.Quantity;
                totalAmount += totalPrice;

                // Create order item
                var orderItem = new OrderItem
                {
                    DesignId = itemDto.DesignId,
                    ProductId = itemDto.ProductId,
                    SizeWidth = itemDto.SizeWidth,
                    SizeHeight = itemDto.SizeHeight,
                    Quantity = itemDto.Quantity,
                    UnitPrice = unitPrice,
                    TotalPrice = totalPrice,
                    SpecialInstructions = itemDto.SpecialInstructions,
                    CreatedAt = DateTime.UtcNow
                };

                order.OrderItems.Add(orderItem);
            }

            // Set total amount
            order.TotalAmount = totalAmount;

            // Save order
            var createdOrder = await _orderRepository.AddAsync(order);
            
            // Get full order with items
            var fullOrder = await _orderRepository.GetOrderWithItemsAsync(createdOrder.Id);
            return MapToDto(fullOrder!);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating order for user {UserId}", userId);
            throw;
        }
    }

    public async Task<OrderDto> CreateOrderFromCartAsync(int userId, CreateOrderDto createOrderDto)
    {
        try
        {
            // Get user cart
            var cartItems = await _cartRepository.GetUserCartWithDetailsAsync(userId);
            if (!cartItems.Any())
            {
                throw new InvalidOperationException("Cart is empty");
            }

            // Generate order number
            var orderNumber = await _orderRepository.GenerateOrderNumberAsync();

            // Create order
            var order = new Order
            {
                UserId = userId,
                OrderNumber = orderNumber,
                CustomerName = createOrderDto.CustomerName,
                CustomerPhone = createOrderDto.CustomerPhone,
                CustomerEmail = createOrderDto.CustomerEmail,
                DeliveryAddress = createOrderDto.DeliveryAddress,
                Notes = createOrderDto.Notes,
                Status = OrderStatus.Pending,
                CreatedAt = DateTime.UtcNow,
                OrderItems = new List<OrderItem>()
            };

            decimal totalAmount = 0;

            // Add order items from cart
            foreach (var cartItem in cartItems)
            {
                var orderItem = new OrderItem
                {
                    DesignId = cartItem.DesignId,
                    ProductId = cartItem.ProductId,
                    SizeWidth = cartItem.SizeWidth,
                    SizeHeight = cartItem.SizeHeight,
                    Quantity = cartItem.Quantity,
                    UnitPrice = cartItem.UnitPrice,
                    TotalPrice = cartItem.TotalPrice,
                    SpecialInstructions = cartItem.SpecialInstructions,
                    CreatedAt = DateTime.UtcNow
                };

                order.OrderItems.Add(orderItem);
                totalAmount += cartItem.TotalPrice;
            }

            // Set total amount
            order.TotalAmount = totalAmount;

            // Save order
            var createdOrder = await _orderRepository.AddAsync(order);
            
            // Clear cart
            await _cartService.ClearCartAsync(userId);
            
            // Get full order with items
            var fullOrder = await _orderRepository.GetOrderWithItemsAsync(createdOrder.Id);
            return MapToDto(fullOrder!);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating order from cart for user {UserId}", userId);
            throw;
        }
    }

    public async Task<OrderDto?> UpdateOrderStatusAsync(int id, OrderStatus status)
    {
        var order = await _orderRepository.GetByIdAsync(id);
        if (order == null)
        {
            return null;
        }

        order.Status = status;
        order.UpdatedAt = DateTime.UtcNow;
        
        if (status == OrderStatus.Completed)
        {
            order.CompletedAt = DateTime.UtcNow;
        }

        await _orderRepository.UpdateAsync(order);
        
        // Get full order with items
        var fullOrder = await _orderRepository.GetOrderWithItemsAsync(id);
        return MapToDto(fullOrder!);
    }

    public async Task<bool> CancelOrderAsync(int id, int userId)
    {
        var order = await _orderRepository.GetByIdAsync(id);
        if (order == null || order.UserId != userId)
        {
            return false;
        }

        // Only allow cancellation if order is pending or confirmed
        if (order.Status != OrderStatus.Pending && order.Status != OrderStatus.Confirmed)
        {
            return false;
        }

        order.Status = OrderStatus.Cancelled;
        order.UpdatedAt = DateTime.UtcNow;

        await _orderRepository.UpdateAsync(order);
        return true;
    }

    public async Task<string> GenerateOrderNumberAsync()
    {
        return await _orderRepository.GenerateOrderNumberAsync();
    }

    private static OrderDto MapToDto(Order order)
    {
        return new OrderDto
        {
            Id = order.Id,
            UserId = order.UserId,
            OrderNumber = order.OrderNumber,
            CustomerName = order.CustomerName,
            CustomerPhone = order.CustomerPhone,
            CustomerEmail = order.CustomerEmail,
            DeliveryAddress = order.DeliveryAddress,
            Notes = order.Notes,
            TotalAmount = order.TotalAmount,
            Status = order.Status,
            StatusName = order.Status.ToString(),
            PaymentStatus = order.PaymentStatus,
            CreatedAt = order.CreatedAt,
            CompletedAt = order.CompletedAt,
            OrderItems = order.OrderItems.Select(item => new OrderItemDto
            {
                Id = item.Id,
                OrderId = item.OrderId,
                DesignId = item.DesignId,
                ProductId = item.ProductId,
                SizeWidth = item.SizeWidth,
                SizeHeight = item.SizeHeight,
                Quantity = item.Quantity,
                UnitPrice = item.UnitPrice,
                TotalPrice = item.TotalPrice,
                SpecialInstructions = item.SpecialInstructions,
                DesignName = item.Design?.Name ?? "",
                DesignPreviewUrl = item.Design?.PreviewImageUrl ?? "",
                DesignData = item.Design?.DesignData ?? "",
                ProductName = item.Product?.Name ?? "",
                ProductType = item.Product?.Type ?? ProductType.Shirt
            }).ToList()
        };
    }

    // PayOS integration methods
    public async Task<Order?> GetByIdAsync(int id)
    {
        return await _orderRepository.GetByIdAsync(id);
    }

    public async Task<Order?> GetByPayOSOrderCodeAsync(string payOSOrderCode)
    {
        return await _orderRepository.GetByPayOSOrderCodeAsync(payOSOrderCode);
    }

    public async Task UpdatePayOSOrderCodeAsync(int orderId, string payOSOrderCode)
    {
        await _orderRepository.UpdatePayOSOrderCodeAsync(orderId, payOSOrderCode);
    }

    public async Task UpdatePaymentStatusAsync(int orderId, PaymentStatus paymentStatus)
    {
        await _orderRepository.UpdatePaymentStatusAsync(orderId, paymentStatus);
    }
}
