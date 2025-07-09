using CleanArchitecture.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CleanArchitecture.Infrastructure.Data.Configurations;

public class DesignFileConfiguration : IEntityTypeConfiguration<DesignFile>
{
    public void Configure(EntityTypeBuilder<DesignFile> builder)
    {
        builder.ToTable("DesignFiles");

        builder.HasKey(df => df.Id);

        builder.Property(df => df.LayerId)
            .IsRequired()
            .HasMaxLength(50);

        builder.Property(df => df.FileName)
            .IsRequired()
            .HasMaxLength(255);

        builder.Property(df => df.FilePath)
            .IsRequired()
            .HasMaxLength(500);

        builder.Property(df => df.MimeType)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(df => df.FileSize)
            .IsRequired();

        // Foreign key relationship
        builder.HasOne(df => df.Design)
            .WithMany(d => d.DesignFiles)
            .HasForeignKey(df => df.DesignId)
            .OnDelete(DeleteBehavior.Cascade);

        // Indexes
        builder.HasIndex(df => df.DesignId);
        builder.HasIndex(df => df.LayerId);
        builder.HasIndex(df => df.FilePath);
    }
}
