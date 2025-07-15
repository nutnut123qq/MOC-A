using CleanArchitecture.Application.DTOs.Payment;
using CleanArchitecture.Application.Interfaces;
using CleanArchitecture.Domain.Entities;
using CleanArchitecture.WebAPI.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CleanArchitecture.WebAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PaymentController : ControllerBase
{
    private readonly IPayOSService _payOSService;
    private readonly ILogger<PaymentController> _logger;

    public PaymentController(IPayOSService payOSService, ILogger<PaymentController> logger)
    {
        _payOSService = payOSService;
        _logger = logger;
    }

    [HttpPost("create-order-payment")]
    [Authorize]
    public async Task<ActionResult<PaymentResponse>> CreateOrderPayment([FromBody] CreatePaymentRequest request)
    {
        try
        {
            var result = await _payOSService.CreateOrderPaymentAsync(request);
            return Ok(result);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating order payment");
            return StatusCode(500, new { message = "Internal server error" });
        }
    }

    [HttpPost("create-topup-payment")]
    [Authorize]
    public async Task<ActionResult<PaymentResponse>> CreateTopUpPayment([FromBody] CreateTopUpRequest request)
    {
        try
        {
            var userId = User.GetUserId();
            var result = await _payOSService.CreateTopUpPaymentAsync(userId, request);
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating top-up payment for user {UserId}", User.GetUserId());
            return StatusCode(500, new { message = "Internal server error" });
        }
    }

    [HttpPost("webhook")]
    public async Task<IActionResult> PaymentWebhook([FromBody] PaymentWebhookData webhookData, [FromHeader(Name = "x-payos-signature")] string signature)
    {
        try
        {
            var isValid = await _payOSService.VerifyPaymentWebhookAsync(Request.Body.ToString(), signature);
            if (!isValid)
            {
                return BadRequest(new { message = "Invalid webhook signature" });
            }

            if (webhookData.Success)
            {
                await _payOSService.HandlePaymentSuccessAsync(webhookData.OrderCode, webhookData);
            }
            else
            {
                await _payOSService.HandlePaymentFailureAsync(webhookData.OrderCode, webhookData.Desc);
            }

            return Ok(new { message = "Webhook processed successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error processing payment webhook");
            return StatusCode(500, new { message = "Internal server error" });
        }
    }

    [HttpGet("return")]
    public async Task<IActionResult> PaymentReturn([FromQuery] string code, [FromQuery] string id, [FromQuery] string cancel, [FromQuery] string status, [FromQuery] string orderCode)
    {
        try
        {
            _logger.LogInformation("Payment return received: code={Code}, orderCode={OrderCode}, id={Id}", code, orderCode, id);

            if (code == "00") // Success
            {
                // Handle payment success if not already handled by webhook
                _logger.LogInformation("Processing payment success for orderCode {OrderCode}", orderCode);
                await _payOSService.HandlePaymentSuccessAsync(orderCode, new PaymentWebhookData
                {
                    OrderCode = orderCode,
                    Success = true,
                    Reference = id ?? "",
                    Desc = "Payment completed via return URL"
                });
                _logger.LogInformation("✅ Payment success processed for orderCode {OrderCode}", orderCode);

                // Check if this was a wallet top-up or order payment
                _logger.LogInformation("🔍 Checking if orderCode {OrderCode} is order or wallet top-up", orderCode);
                var order = await _payOSService.GetOrderByPayOSOrderCodeAsync(orderCode);
                if (order != null)
                {
                    _logger.LogInformation("📦 Found order {OrderId} - redirecting to order success page", order.Id);
                    // This was an order payment
                    var returnUrl = $"http://localhost:3000/payment/return?code={code}&orderCode={orderCode}&orderId={order.Id}";
                    return Redirect(returnUrl);
                }
                else
                {
                    _logger.LogInformation("💰 No order found - this was a wallet top-up, redirecting to wallet success page");
                    // This was a wallet top-up
                    var returnUrl = $"http://localhost:3000/payment/return?code={code}&orderCode={orderCode}&type=topup";
                    return Redirect(returnUrl);
                }
            }
            else
            {
                _logger.LogWarning("❌ Payment failed with code {Code} for orderCode {OrderCode}", code, orderCode);
                // Payment failed - check if order or wallet top-up
                var order = await _payOSService.GetOrderByPayOSOrderCodeAsync(orderCode);
                var orderId = order?.Id.ToString() ?? "";
                var type = order != null ? "" : "&type=topup";

                // Redirect to frontend failure page
                var returnUrl = $"http://localhost:3000/payment/return?code={code}&orderCode={orderCode}&orderId={orderId}{type}";
                return Redirect(returnUrl);
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "❌ Error processing payment return for orderCode {OrderCode}", orderCode);
            return Redirect($"http://localhost:3000/payment/return?code=99");
        }
    }

    [HttpGet("cancel")]
    public async Task<IActionResult> PaymentCancel([FromQuery] string orderCode)
    {
        try
        {
            await _payOSService.HandlePaymentFailureAsync(orderCode, "Payment cancelled by user");
            return Redirect($"/payment/cancelled?orderCode={orderCode}");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error processing payment cancellation");
            return Redirect("/payment/failed");
        }
    }
}
