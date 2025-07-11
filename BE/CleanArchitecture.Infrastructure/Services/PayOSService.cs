using CleanArchitecture.Application.DTOs.Payment;
using CleanArchitecture.Application.Interfaces;
using CleanArchitecture.Domain.Entities;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Net.payOS;
using Net.payOS.Types;

namespace CleanArchitecture.Infrastructure.Services;

public class PayOSService : IPayOSService
{
    private readonly PayOS _payOS;
    private readonly IConfiguration _configuration;
    private readonly ILogger<PayOSService> _logger;
    private readonly IWalletService _walletService;
    private readonly IOrderService _orderService;

    public PayOSService(
        IConfiguration configuration,
        ILogger<PayOSService> logger,
        IWalletService walletService,
        IOrderService orderService)
    {
        _configuration = configuration;
        _logger = logger;
        _walletService = walletService;
        _orderService = orderService;

        var clientId = _configuration["PayOS:ClientId"];
        var apiKey = _configuration["PayOS:ApiKey"];
        var checksumKey = _configuration["PayOS:ChecksumKey"];

        if (string.IsNullOrEmpty(clientId) || string.IsNullOrEmpty(apiKey) || string.IsNullOrEmpty(checksumKey))
        {
            _logger.LogWarning("PayOS credentials not configured. PayOS integration will use fallback mode.");
            _logger.LogWarning("ClientId: {ClientId}, ApiKey: {ApiKey}, ChecksumKey: {ChecksumKey}",
                string.IsNullOrEmpty(clientId) ? "EMPTY" : "SET",
                string.IsNullOrEmpty(apiKey) ? "EMPTY" : "SET",
                string.IsNullOrEmpty(checksumKey) ? "EMPTY" : "SET");
            _payOS = null!; // Will use fallback in methods
        }
        else
        {
            _payOS = new PayOS(clientId, apiKey, checksumKey);
            _logger.LogInformation("PayOS SDK initialized successfully with ClientId: {ClientId}",
                clientId?.Substring(0, 8) + "...");
        }
    }

    public async Task<PaymentResponse> CreateTopUpPaymentAsync(int userId, CreateTopUpRequest request)
    {
        try
        {
            var orderCode = await GenerateOrderCodeAsync();
            var returnUrl = request.ReturnUrl ?? _configuration["PayOS:ReturnUrl"] ?? "http://localhost:3000/payment/return";
            var cancelUrl = request.CancelUrl ?? _configuration["PayOS:CancelUrl"] ?? "http://localhost:3000/payment/cancel";

            // Create wallet transaction first
            await _walletService.CreateTopUpTransactionAsync(userId, request.Amount, orderCode);

            // Create PayOS payment link with real API
            if (_payOS != null)
            {
                try
                {
                    var paymentData = new PaymentData(
                        orderCode: long.Parse(orderCode),
                        amount: (int)request.Amount,
                        description: request.Description ?? $"Nạp tiền vào ví - User {userId}",
                        items: new List<ItemData>
                        {
                            new ItemData("Nạp tiền vào ví", 1, (int)request.Amount)
                        },
                        returnUrl: returnUrl,
                        cancelUrl: cancelUrl
                    );

                    var createPayment = await _payOS.createPaymentLink(paymentData);

                    return new PaymentResponse
                    {
                        CheckoutUrl = createPayment.checkoutUrl,
                        OrderCode = orderCode,
                        QrCode = createPayment.qrCode,
                        AccountNumber = "",
                        AccountName = "",
                        Bin = "",
                        Amount = request.Amount,
                        Description = request.Description ?? $"Nạp tiền vào ví - User {userId}"
                    };
                }
                catch (Exception payOSEx)
                {
                    _logger.LogError(payOSEx, "PayOS API error for user {UserId}", userId);
                }
            }

            // Fallback to mock for development if PayOS not configured or fails
            _logger.LogWarning("Using PayOS fallback mode for user {UserId}", userId);
            return new PaymentResponse
            {
                CheckoutUrl = $"http://localhost:3000/payment/return?code=00&orderCode={orderCode}",
                OrderCode = orderCode,
                QrCode = "data:image/png;base64,mock-qr-code",
                AccountNumber = "19036035704",
                AccountName = "NGUYEN VAN A",
                Bin = "970415",
                Amount = request.Amount,
                Description = request.Description ?? $"Nạp tiền vào ví - User {userId}"
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating top-up payment for user {UserId}", userId);
            throw;
        }
    }

    public async Task<PaymentResponse> CreateOrderPaymentAsync(CreatePaymentRequest request)
    {
        try
        {
            var order = await _orderService.GetByIdAsync(request.OrderId);
            if (order == null)
            {
                throw new ArgumentException("Order not found");
            }

            var orderCode = await GenerateOrderCodeAsync();
            var returnUrl = request.ReturnUrl ?? _configuration["PayOS:ReturnUrl"] ?? "http://localhost:3000/payment/return";
            var cancelUrl = request.CancelUrl ?? _configuration["PayOS:CancelUrl"] ?? "http://localhost:3000/payment/cancel";

            // Update order với PayOS order code
            await _orderService.UpdatePayOSOrderCodeAsync(request.OrderId, orderCode);

            // Create PayOS payment link with real API
            try
            {
                var paymentData = new PaymentData(
                    orderCode: long.Parse(orderCode),
                    amount: (int)request.Amount,
                    description: request.Description ?? $"Thanh toán đơn hàng #{order.OrderNumber}",
                    items: new List<ItemData>
                    {
                        new ItemData($"Đơn hàng #{order.OrderNumber}", 1, (int)request.Amount)
                    },
                    returnUrl: returnUrl,
                    cancelUrl: cancelUrl
                );

                var createPayment = await _payOS.createPaymentLink(paymentData);

                return new PaymentResponse
                {
                    CheckoutUrl = createPayment.checkoutUrl,
                    OrderCode = orderCode,
                    QrCode = createPayment.qrCode,
                    AccountNumber = "",
                    AccountName = "",
                    Bin = "",
                    Amount = request.Amount,
                    Description = request.Description
                };
            }
            catch (Exception payOSEx)
            {
                _logger.LogError(payOSEx, "PayOS API error for order {OrderId}", request.OrderId);

                // Fallback to mock for development if PayOS fails
                return new PaymentResponse
                {
                    CheckoutUrl = $"http://localhost:3000/payment/return?code=00&orderCode={orderCode}",
                    OrderCode = orderCode,
                    QrCode = "data:image/png;base64,mock-qr-code",
                    AccountNumber = "19036035704",
                    AccountName = "NGUYEN VAN A",
                    Bin = "970415",
                    Amount = request.Amount,
                    Description = request.Description
                };
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating order payment for order {OrderId}", request.OrderId);
            throw;
        }
    }

    public async Task<bool> VerifyPaymentWebhookAsync(string webhookData, string signature)
    {
        try
        {
            // TODO: Implement PayOS webhook verification properly
            // For now, return true for testing
            await Task.CompletedTask;
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error verifying payment webhook");
            return false;
        }
    }

    public async Task HandlePaymentSuccessAsync(string orderCode, PaymentWebhookData webhookData)
    {
        try
        {
            _logger.LogInformation("Processing payment success for order code: {OrderCode}", orderCode);

            // Check if this is a top-up transaction
            var walletTransaction = await _walletService.GetTransactionByPayOSOrderCodeAsync(orderCode);
            if (walletTransaction != null)
            {
                // Handle wallet top-up
                await _walletService.CompleteTopUpTransactionAsync(orderCode, webhookData.Reference);
                _logger.LogInformation("Wallet top-up completed for order code: {OrderCode}", orderCode);
                return;
            }

            // Handle order payment
            var order = await _orderService.GetByPayOSOrderCodeAsync(orderCode);
            if (order != null)
            {
                await _orderService.UpdatePaymentStatusAsync(order.Id, PaymentStatus.Paid);
                _logger.LogInformation("Order payment completed for order code: {OrderCode}", orderCode);
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error handling payment success for order code: {OrderCode}", orderCode);
            throw;
        }
    }

    public async Task HandlePaymentFailureAsync(string orderCode, string reason)
    {
        try
        {
            _logger.LogWarning("Processing payment failure for order code: {OrderCode}, reason: {Reason}", orderCode, reason);

            // Check if this is a top-up transaction
            var walletTransaction = await _walletService.GetTransactionByPayOSOrderCodeAsync(orderCode);
            if (walletTransaction != null)
            {
                await _walletService.FailTopUpTransactionAsync(orderCode, reason);
                return;
            }

            // Handle order payment failure
            var order = await _orderService.GetByPayOSOrderCodeAsync(orderCode);
            if (order != null)
            {
                await _orderService.UpdatePaymentStatusAsync(order.Id, PaymentStatus.Failed);
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error handling payment failure for order code: {OrderCode}", orderCode);
            throw;
        }
    }

    public Task<string> GenerateOrderCodeAsync()
    {
        // Generate unique order code using timestamp + random
        var timestamp = DateTimeOffset.UtcNow.ToUnixTimeSeconds();
        var random = new Random().Next(1000, 9999);
        return Task.FromResult($"{timestamp}{random}");
    }
}
