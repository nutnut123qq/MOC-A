using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using CleanArchitecture.Domain.Entities;

namespace CleanArchitecture.Infrastructure.Configurations;

public class DesignConfiguration : IEntityTypeConfiguration<Design>
{
    public void Configure(EntityTypeBuilder<Design> builder)
    {
        builder.HasKey(d => d.Id);
        
        builder.Property(d => d.Name)
            .IsRequired()
            .HasMaxLength(200);
            
        builder.Property(d => d.CanvasData)
            .IsRequired()
            .HasColumnType("nvarchar(max)");
            
        builder.Property(d => d.PreviewImageUrl)
            .HasMaxLength(500);
            
        builder.Property(d => d.Width)
            .HasPrecision(5, 2);
            
        builder.Property(d => d.Height)
            .HasPrecision(5, 2);
            
        builder.Property(d => d.CreatedAt)
            .IsRequired();

        // Relationships
        builder.HasOne(d => d.User)
            .WithMany(u => u.Designs)
            .HasForeignKey(d => d.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(d => d.OrderItems)
            .WithOne(oi => oi.Design)
            .HasForeignKey(oi => oi.DesignId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
