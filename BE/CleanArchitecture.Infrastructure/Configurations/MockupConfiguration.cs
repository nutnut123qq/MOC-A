using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using CleanArchitecture.Domain.Entities;

namespace CleanArchitecture.Infrastructure.Configurations;

public class MockupConfiguration : IEntityTypeConfiguration<Mockup>
{
    public void Configure(EntityTypeBuilder<Mockup> builder)
    {
        builder.HasKey(m => m.Id);
        
        builder.Property(m => m.Name)
            .IsRequired()
            .HasMaxLength(200);
            
        builder.Property(m => m.ImageUrl)
            .IsRequired()
            .HasMaxLength(500);
            
        builder.Property(m => m.OverlayCoordinates)
            .HasColumnType("nvarchar(max)");
            
        builder.Property(m => m.MaxWidth)
            .HasPrecision(5, 2);
            
        builder.Property(m => m.MaxHeight)
            .HasPrecision(5, 2);
            
        builder.Property(m => m.CreatedAt)
            .IsRequired();

        // Relationships
        builder.HasOne(m => m.Product)
            .WithMany(p => p.Mockups)
            .HasForeignKey(m => m.ProductId)
            .OnDelete(DeleteBehavior.Cascade);

        // Indexes
        builder.HasIndex(m => m.ProductId);
        builder.HasIndex(m => m.IsDefault);
    }
}
