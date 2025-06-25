using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using CleanArchitecture.Domain.Entities;

namespace CleanArchitecture.Infrastructure.Configurations;

public class OrderItemConfiguration : IEntityTypeConfiguration<OrderItem>
{
    public void Configure(EntityTypeBuilder<OrderItem> builder)
    {
        builder.HasKey(oi => oi.Id);
        
        builder.Property(oi => oi.SizeWidth)
            .HasPrecision(5, 2);
            
        builder.Property(oi => oi.SizeHeight)
            .HasPrecision(5, 2);
            
        builder.Property(oi => oi.UnitPrice)
            .HasPrecision(10, 2);
            
        builder.Property(oi => oi.TotalPrice)
            .HasPrecision(10, 2);
            
        builder.Property(oi => oi.SpecialInstructions)
            .HasMaxLength(500);
            
        builder.Property(oi => oi.CreatedAt)
            .IsRequired();

        // Relationships
        builder.HasOne(oi => oi.Order)
            .WithMany(o => o.OrderItems)
            .HasForeignKey(oi => oi.OrderId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(oi => oi.Design)
            .WithMany(d => d.OrderItems)
            .HasForeignKey(oi => oi.DesignId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(oi => oi.Product)
            .WithMany(p => p.OrderItems)
            .HasForeignKey(oi => oi.ProductId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
