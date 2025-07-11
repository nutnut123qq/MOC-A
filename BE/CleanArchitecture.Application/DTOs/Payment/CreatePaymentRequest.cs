using System.ComponentModel.DataAnnotations;

namespace CleanArchitecture.Application.DTOs.Payment;

public class CreatePaymentRequest
{
    [Required]
    public int OrderId { get; set; }
    
    [Required]
    [Range(1000, 50000000)]
    public decimal Amount { get; set; }
    
    [Required]
    [MaxLength(500)]
    public string Description { get; set; } = string.Empty;
    
    [MaxLength(1000)]
    public string? ReturnUrl { get; set; }
    
    [MaxLength(1000)]
    public string? CancelUrl { get; set; }
}

public class CreateTopUpRequest
{
    [Required]
    [Range(10000, 10000000)]
    public decimal Amount { get; set; }
    
    [MaxLength(500)]
    public string? Description { get; set; }
    
    [MaxLength(1000)]
    public string? ReturnUrl { get; set; }
    
    [MaxLength(1000)]
    public string? CancelUrl { get; set; }
}

public class PaymentResponse
{
    public string CheckoutUrl { get; set; } = string.Empty;
    public string OrderCode { get; set; } = string.Empty;
    public string QrCode { get; set; } = string.Empty;
    public string AccountNumber { get; set; } = string.Empty;
    public string AccountName { get; set; } = string.Empty;
    public string Bin { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public string Description { get; set; } = string.Empty;
}

public class PaymentWebhookData
{
    public string OrderCode { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public string Description { get; set; } = string.Empty;
    public string AccountNumber { get; set; } = string.Empty;
    public string Reference { get; set; } = string.Empty;
    public string TransactionDateTime { get; set; } = string.Empty;
    public string Currency { get; set; } = string.Empty;
    public string PaymentLinkId { get; set; } = string.Empty;
    public string Code { get; set; } = string.Empty;
    public string Desc { get; set; } = string.Empty;
    public bool Success { get; set; }
}
