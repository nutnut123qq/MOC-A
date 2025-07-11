using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using CleanArchitecture.Domain.Entities;
using CleanArchitecture.Domain.Enums;

namespace CleanArchitecture.Infrastructure.Data.Configurations;

public class WalletTransactionConfiguration : IEntityTypeConfiguration<WalletTransaction>
{
    public void Configure(EntityTypeBuilder<WalletTransaction> builder)
    {
        builder.HasKey(t => t.Id);

        builder.Property(t => t.TransactionType)
            .HasMaxLength(20)
            .IsRequired();

        builder.Property(t => t.Amount)
            .HasColumnType("decimal(18,2)")
            .IsRequired();

        builder.Property(t => t.BalanceBefore)
            .HasColumnType("decimal(18,2)")
            .IsRequired();

        builder.Property(t => t.BalanceAfter)
            .HasColumnType("decimal(18,2)")
            .IsRequired();

        builder.Property(t => t.Description)
            .HasMaxLength(500)
            .IsRequired();

        builder.Property(t => t.PayOSOrderCode)
            .HasMaxLength(50);

        builder.Property(t => t.PayOSTransactionId)
            .HasMaxLength(100);

        builder.Property(t => t.Status)
            .HasDefaultValue(TransactionStatus.Pending);

        builder.Property(t => t.FailureReason)
            .HasMaxLength(500);

        // Relationships
        builder.HasOne(t => t.Wallet)
            .WithMany(w => w.Transactions)
            .HasForeignKey(t => t.WalletId)
            .OnDelete(DeleteBehavior.NoAction);

        builder.HasOne(t => t.Order)
            .WithMany(o => o.WalletTransactions)
            .HasForeignKey(t => t.OrderId)
            .OnDelete(DeleteBehavior.SetNull);

        // Indexes
        builder.HasIndex(t => t.WalletId);
        builder.HasIndex(t => t.OrderId);
        builder.HasIndex(t => t.PayOSOrderCode);
        builder.HasIndex(t => t.CreatedAt);
        builder.HasIndex(t => t.Status);
    }
}
