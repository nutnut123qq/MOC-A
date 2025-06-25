using CleanArchitecture.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace CleanArchitecture.Infrastructure.Data;

public static class SeedData
{
    public static async Task SeedAsync(ApplicationDbContext context)
    {
        // Seed Products
        if (!await context.Products.AnyAsync())
        {
            var products = new List<Product>
            {
                new Product
                {
                    Name = "Áo Thun",
                    Type = ProductType.Shirt,
                    Description = "Áo thun cotton 100% chất lượng cao",
                    MockupImageUrl = "/images/mockups/shirt-default.jpg",
                    BasePrice = 15000,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new Product
                {
                    Name = "Mũ Lưỡi Trai",
                    Type = ProductType.Hat,
                    Description = "Mũ lưỡi trai thời trang",
                    MockupImageUrl = "/images/mockups/hat-default.jpg",
                    BasePrice = 15000,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new Product
                {
                    Name = "Túi Canvas",
                    Type = ProductType.CanvasBag,
                    Description = "Túi canvas bền đẹp, thân thiện môi trường",
                    MockupImageUrl = "/images/mockups/bag-default.jpg",
                    BasePrice = 15000,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                }
            };

            await context.Products.AddRangeAsync(products);
            await context.SaveChangesAsync();

            // Seed Mockups for each product
            var mockups = new List<Mockup>
            {
                // Shirt mockups
                new Mockup
                {
                    ProductId = products[0].Id,
                    Name = "Áo Thun Trắng",
                    ImageUrl = "/images/mockups/shirt-white.jpg",
                    OverlayCoordinates = "{\"x\": 150, \"y\": 200, \"width\": 200, \"height\": 250}",
                    MaxWidth = 25,
                    MaxHeight = 28,
                    IsDefault = true,
                    SortOrder = 1,
                    CreatedAt = DateTime.UtcNow
                },
                new Mockup
                {
                    ProductId = products[0].Id,
                    Name = "Áo Thun Đen",
                    ImageUrl = "/images/mockups/shirt-black.jpg",
                    OverlayCoordinates = "{\"x\": 150, \"y\": 200, \"width\": 200, \"height\": 250}",
                    MaxWidth = 25,
                    MaxHeight = 28,
                    IsDefault = false,
                    SortOrder = 2,
                    CreatedAt = DateTime.UtcNow
                },
                // Hat mockups
                new Mockup
                {
                    ProductId = products[1].Id,
                    Name = "Mũ Đen",
                    ImageUrl = "/images/mockups/hat-black.jpg",
                    OverlayCoordinates = "{\"x\": 100, \"y\": 80, \"width\": 150, \"height\": 100}",
                    MaxWidth = 15,
                    MaxHeight = 10,
                    IsDefault = true,
                    SortOrder = 1,
                    CreatedAt = DateTime.UtcNow
                },
                // Canvas bag mockups
                new Mockup
                {
                    ProductId = products[2].Id,
                    Name = "Túi Canvas Trắng",
                    ImageUrl = "/images/mockups/bag-white.jpg",
                    OverlayCoordinates = "{\"x\": 120, \"y\": 150, \"width\": 180, \"height\": 200}",
                    MaxWidth = 20,
                    MaxHeight = 25,
                    IsDefault = true,
                    SortOrder = 1,
                    CreatedAt = DateTime.UtcNow
                }
            };

            await context.Mockups.AddRangeAsync(mockups);
            await context.SaveChangesAsync();
        }

        // Seed Stickers
        if (!await context.Stickers.AnyAsync())
        {
            var stickers = new List<Sticker>
            {
                new Sticker
                {
                    Name = "Heart",
                    ImageUrl = "/images/stickers/heart.png",
                    Category = "Love",
                    Tags = "heart,love,valentine",
                    IsPremium = false,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new Sticker
                {
                    Name = "Star",
                    ImageUrl = "/images/stickers/star.png",
                    Category = "Shapes",
                    Tags = "star,shape,decoration",
                    IsPremium = false,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new Sticker
                {
                    Name = "Smile",
                    ImageUrl = "/images/stickers/smile.png",
                    Category = "Emoji",
                    Tags = "smile,happy,emoji,face",
                    IsPremium = false,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new Sticker
                {
                    Name = "Crown",
                    ImageUrl = "/images/stickers/crown.png",
                    Category = "Royal",
                    Tags = "crown,king,queen,royal",
                    IsPremium = true,
                    PremiumPrice = 5000,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                }
            };

            await context.Stickers.AddRangeAsync(stickers);
            await context.SaveChangesAsync();
        }

        // Seed Fonts
        if (!await context.Fonts.AnyAsync())
        {
            var fonts = new List<Font>
            {
                new Font
                {
                    Name = "Arial",
                    FontFamily = "Arial, sans-serif",
                    FontFileUrl = "/fonts/arial.woff2",
                    Category = "Sans Serif",
                    IsPremium = false,
                    PreviewText = "Sample Text",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new Font
                {
                    Name = "Times New Roman",
                    FontFamily = "Times New Roman, serif",
                    FontFileUrl = "/fonts/times.woff2",
                    Category = "Serif",
                    IsPremium = false,
                    PreviewText = "Sample Text",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                },
                new Font
                {
                    Name = "Dancing Script",
                    FontFamily = "Dancing Script, cursive",
                    FontFileUrl = "/fonts/dancing-script.woff2",
                    Category = "Handwriting",
                    IsPremium = true,
                    PremiumPrice = 10000,
                    PreviewText = "Sample Text",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                }
            };

            await context.Fonts.AddRangeAsync(fonts);
            await context.SaveChangesAsync();
        }
    }
}
