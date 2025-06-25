using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using CleanArchitecture.Domain.Entities;

namespace CleanArchitecture.Infrastructure.Configurations;

public class OrderConfiguration : IEntityTypeConfiguration<Order>
{
    public void Configure(EntityTypeBuilder<Order> builder)
    {
        builder.HasKey(o => o.Id);
        
        builder.Property(o => o.OrderNumber)
            .IsRequired()
            .HasMaxLength(50);
            
        builder.HasIndex(o => o.OrderNumber)
            .IsUnique();
            
        builder.Property(o => o.CustomerName)
            .IsRequired()
            .HasMaxLength(200);
            
        builder.Property(o => o.CustomerPhone)
            .IsRequired()
            .HasMaxLength(20);
            
        builder.Property(o => o.CustomerEmail)
            .HasMaxLength(255);
            
        builder.Property(o => o.DeliveryAddress)
            .IsRequired()
            .HasMaxLength(500);
            
        builder.Property(o => o.Notes)
            .HasMaxLength(1000);
            
        builder.Property(o => o.TotalAmount)
            .HasPrecision(10, 2);
            
        builder.Property(o => o.Status)
            .IsRequired()
            .HasConversion<int>();
            
        builder.Property(o => o.CreatedAt)
            .IsRequired();

        // Relationships
        builder.HasOne(o => o.User)
            .WithMany(u => u.Orders)
            .HasForeignKey(o => o.UserId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasMany(o => o.OrderItems)
            .WithOne(oi => oi.Order)
            .HasForeignKey(oi => oi.OrderId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
