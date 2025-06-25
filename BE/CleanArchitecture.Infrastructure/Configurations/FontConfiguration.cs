using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using CleanArchitecture.Domain.Entities;

namespace CleanArchitecture.Infrastructure.Configurations;

public class FontConfiguration : IEntityTypeConfiguration<Font>
{
    public void Configure(EntityTypeBuilder<Font> builder)
    {
        builder.HasKey(f => f.Id);
        
        builder.Property(f => f.Name)
            .IsRequired()
            .HasMaxLength(200);
            
        builder.Property(f => f.FontFamily)
            .IsRequired()
            .HasMaxLength(200);
            
        builder.Property(f => f.FontFileUrl)
            .IsRequired()
            .HasMaxLength(500);
            
        builder.Property(f => f.Category)
            .IsRequired()
            .HasMaxLength(100);
            
        builder.Property(f => f.PremiumPrice)
            .HasPrecision(10, 2);
            
        builder.Property(f => f.PreviewText)
            .HasMaxLength(100);
            
        builder.Property(f => f.CreatedAt)
            .IsRequired();

        // Indexes
        builder.HasIndex(f => f.Category);
        builder.HasIndex(f => f.IsActive);
    }
}
