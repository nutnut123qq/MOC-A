using CleanArchitecture.Domain.Common;
using System.ComponentModel.DataAnnotations;

namespace CleanArchitecture.Domain.Entities;

public class RefreshToken : BaseEntity
{
    [Required]
    public int UserId { get; set; }
    
    [Required]
    [MaxLength(255)]
    public string Token { get; set; } = string.Empty;
    
    [Required]
    public DateTime ExpiresAt { get; set; }
    
    public DateTime? RevokedAt { get; set; }
    
    public bool IsExpired => DateTime.UtcNow >= ExpiresAt;
    
    public bool IsRevoked => RevokedAt != null;
    
    public bool IsActive => !IsRevoked && !IsExpired;
    
    // Navigation properties
    public virtual User User { get; set; } = null!;
}
