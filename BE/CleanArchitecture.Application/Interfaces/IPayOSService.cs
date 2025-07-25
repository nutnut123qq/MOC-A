using CleanArchitecture.Application.DTOs.Payment;
using CleanArchitecture.Domain.Entities;

namespace CleanArchitecture.Application.Interfaces;

public interface IPayOSService
{
    Task<PaymentResponse> CreateTopUpPaymentAsync(int userId, CreateTopUpRequest request);
    Task<PaymentResponse> CreateOrderPaymentAsync(CreatePaymentRequest request);
    Task<bool> VerifyPaymentWebhookAsync(string webhookData, string signature);
    Task HandlePaymentSuccessAsync(string orderCode, PaymentWebhookData webhookData);
    Task HandlePaymentFailureAsync(string orderCode, string reason);
    Task<string> GenerateOrderCodeAsync();
    Task<Order?> GetOrderByPayOSOrderCodeAsync(string orderCode);
}
