using CleanArchitecture.Domain.Common;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CleanArchitecture.Domain.Entities;

public class Wallet : BaseEntity
{
    public int UserId { get; set; }
    
    [Column(TypeName = "decimal(18,2)")]
    public decimal Balance { get; set; } = 0;
    
    [MaxLength(10)]
    public string Currency { get; set; } = "VND";
    
    public bool IsActive { get; set; } = true;
    
    public DateTime? LastTransactionAt { get; set; }

    // Navigation properties
    public virtual User User { get; set; } = null!;
    public virtual ICollection<WalletTransaction> Transactions { get; set; } = new List<WalletTransaction>();
}
