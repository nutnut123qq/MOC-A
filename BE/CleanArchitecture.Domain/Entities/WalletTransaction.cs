using CleanArchitecture.Domain.Common;
using CleanArchitecture.Domain.Enums;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CleanArchitecture.Domain.Entities;

public class WalletTransaction : BaseEntity
{
    public int WalletId { get; set; }
    
    public int? OrderId { get; set; }
    
    [Required]
    [MaxLength(20)]
    public string TransactionType { get; set; } = string.Empty; // TOPUP, PAYMENT, REFUND
    
    [Column(TypeName = "decimal(18,2)")]
    public decimal Amount { get; set; }
    
    [Column(TypeName = "decimal(18,2)")]
    public decimal BalanceBefore { get; set; }
    
    [Column(TypeName = "decimal(18,2)")]
    public decimal BalanceAfter { get; set; }
    
    [MaxLength(500)]
    public string Description { get; set; } = string.Empty;
    
    [MaxLength(50)]
    public string? PayOSOrderCode { get; set; }
    
    [MaxLength(100)]
    public string? PayOSTransactionId { get; set; }
    
    public TransactionStatus Status { get; set; } = TransactionStatus.Pending;
    
    public DateTime? CompletedAt { get; set; }
    
    [MaxLength(500)]
    public string? FailureReason { get; set; }

    // Navigation properties
    public virtual Wallet Wallet { get; set; } = null!;
    public virtual Order? Order { get; set; }
}
