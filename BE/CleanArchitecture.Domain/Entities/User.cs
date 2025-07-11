using CleanArchitecture.Domain.Common;
using CleanArchitecture.Domain.Enums;
using System.ComponentModel.DataAnnotations;

namespace CleanArchitecture.Domain.Entities;

public class User : BaseEntity
{
    [Required]
    [EmailAddress]
    [MaxLength(255)]
    public string Email { get; set; } = string.Empty;

    [Required]
    [MaxLength(255)]
    public string PasswordHash { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string FirstName { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string LastName { get; set; } = string.Empty;

    [MaxLength(20)]
    public string? PhoneNumber { get; set; }

    public DateTime? DateOfBirth { get; set; }

    [MaxLength(10)]
    public string? Gender { get; set; }

    [MaxLength(500)]
    public string? AvatarUrl { get; set; }

    public UserRole Role { get; set; } = UserRole.User;

    public UserStatus Status { get; set; } = UserStatus.Active;

    public DateTime? LastLoginAt { get; set; }

    // Navigation properties
    public virtual ICollection<Design> Designs { get; set; } = new List<Design>();
    public virtual ICollection<Order> Orders { get; set; } = new List<Order>();
    public virtual ICollection<RefreshToken> RefreshTokens { get; set; } = new List<RefreshToken>();
    public virtual Wallet? Wallet { get; set; }

    // Helper properties
    public string FullName => $"{FirstName} {LastName}";

    public bool IsAdmin => Role == UserRole.Admin;
}
