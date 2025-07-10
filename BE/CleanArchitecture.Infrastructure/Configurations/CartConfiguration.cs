using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using CleanArchitecture.Domain.Entities;

namespace CleanArchitecture.Infrastructure.Configurations;

public class CartConfiguration : IEntityTypeConfiguration<Cart>
{
    public void Configure(EntityTypeBuilder<Cart> builder)
    {
        builder.HasKey(c => c.Id);
        
        builder.Property(c => c.SizeWidth)
            .HasPrecision(5, 2);
            
        builder.Property(c => c.SizeHeight)
            .HasPrecision(5, 2);
            
        builder.Property(c => c.UnitPrice)
            .HasPrecision(10, 2);
            
        builder.Property(c => c.TotalPrice)
            .HasPrecision(10, 2);
            
        builder.Property(c => c.SpecialInstructions)
            .HasMaxLength(500);
            
        builder.Property(c => c.CreatedAt)
            .IsRequired();
            
        builder.Property(c => c.AddedAt)
            .IsRequired();

        // Relationships
        builder.HasOne(c => c.User)
            .WithMany()
            .HasForeignKey(c => c.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(c => c.Design)
            .WithMany()
            .HasForeignKey(c => c.DesignId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(c => c.Product)
            .WithMany()
            .HasForeignKey(c => c.ProductId)
            .OnDelete(DeleteBehavior.Restrict);

        // Indexes
        builder.HasIndex(c => c.UserId);
        builder.HasIndex(c => c.AddedAt);
        
        // Unique constraint: One user can have only one cart item per design+product combination
        builder.HasIndex(c => new { c.UserId, c.DesignId, c.ProductId })
            .IsUnique();
    }
}
