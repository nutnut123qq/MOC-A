using CleanArchitecture.Application.DTOs.Payment;
using CleanArchitecture.Application.Interfaces;
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
            if (code == "00") // Success
            {
                // Redirect to success page
                return Redirect($"/payment/success?orderCode={orderCode}");
            }
            else
            {
                // Redirect to failure page
                return Redirect($"/payment/failed?code={code}&orderCode={orderCode}");
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error processing payment return");
            return Redirect("/payment/failed");
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
