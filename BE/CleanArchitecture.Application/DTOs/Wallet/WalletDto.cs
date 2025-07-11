using CleanArchitecture.Domain.Enums;

namespace CleanArchitecture.Application.DTOs.Wallet;

public class WalletDto
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public decimal Balance { get; set; }
    public string Currency { get; set; } = string.Empty;
    public bool IsActive { get; set; }
    public DateTime? LastTransactionAt { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class WalletTransactionDto
{
    public int Id { get; set; }
    public int WalletId { get; set; }
    public int? OrderId { get; set; }
    public string TransactionType { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public decimal BalanceBefore { get; set; }
    public decimal BalanceAfter { get; set; }
    public string Description { get; set; } = string.Empty;
    public string? PayOSOrderCode { get; set; }
    public string? PayOSTransactionId { get; set; }
    public TransactionStatus Status { get; set; }
    public DateTime? CompletedAt { get; set; }
    public string? FailureReason { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class CreateWalletTransactionRequest
{
    public string TransactionType { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public string Description { get; set; } = string.Empty;
    public int? OrderId { get; set; }
}

public class PayFromWalletRequest
{
    public int OrderId { get; set; }
    public decimal Amount { get; set; }
    public string Description { get; set; } = string.Empty;
}
