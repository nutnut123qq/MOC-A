using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using CleanArchitecture.Domain.Entities;

namespace CleanArchitecture.Infrastructure.Configurations;

public class StickerConfiguration : IEntityTypeConfiguration<Sticker>
{
    public void Configure(EntityTypeBuilder<Sticker> builder)
    {
        builder.HasKey(s => s.Id);
        
        builder.Property(s => s.Name)
            .IsRequired()
            .HasMaxLength(200);
            
        builder.Property(s => s.ImageUrl)
            .IsRequired()
            .HasMaxLength(500);
            
        builder.Property(s => s.Category)
            .IsRequired()
            .HasMaxLength(100);
            
        builder.Property(s => s.Tags)
            .HasMaxLength(500);
            
        builder.Property(s => s.PremiumPrice)
            .HasPrecision(10, 2);
            
        builder.Property(s => s.CreatedAt)
            .IsRequired();

        // Indexes
        builder.HasIndex(s => s.Category);
        builder.HasIndex(s => s.IsActive);
    }
}
