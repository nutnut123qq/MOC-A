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
            .HasMaxLength(100);

        builder.Property(d => d.Description)
            .HasMaxLength(500);

        builder.Property(d => d.DesignData)
            .IsRequired()
            .HasColumnType("nvarchar(max)");

        builder.Property(d => d.PreviewImageUrl)
            .HasMaxLength(500);

        builder.Property(d => d.CreatedAt)
            .IsRequired();

        // Relationships
        builder.HasOne(d => d.User)
            .WithMany(u => u.Designs)
            .HasForeignKey(d => d.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(d => d.Product)
            .WithMany()
            .HasForeignKey(d => d.ProductId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasMany(d => d.OrderItems)
            .WithOne(oi => oi.Design)
            .HasForeignKey(oi => oi.DesignId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
