using CleanArchitecture.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace CleanArchitecture.Infrastructure.Data;

public static class DataSeeder
{
    public static async Task SeedAsync(ApplicationDbContext context)
    {
        // Check if products already exist
        if (await context.Products.AnyAsync())
        {
            Console.WriteLine("Products already exist, skipping seed.");
            return;
        }

        Console.WriteLine("Seeding sample products...");

        var products = new List<Product>
        {
            new Product
            {
                Name = "Classic Cotton T-Shirt",
                Description = "Comfortable cotton t-shirt perfect for custom designs",
                Type = ProductType.Shirt,
                BasePrice = 15.99m,
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new Product
            {
                Name = "Premium Cotton Tee",
                Description = "High-quality premium cotton t-shirt",
                Type = ProductType.Shirt,
                BasePrice = 19.99m,
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new Product
            {
                Name = "Vintage Style Shirt",
                Description = "Retro vintage style t-shirt",
                Type = ProductType.Shirt,
                BasePrice = 17.99m,
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            }
        };

        await context.Products.AddRangeAsync(products);
        await context.SaveChangesAsync();

        Console.WriteLine($"Seeded {products.Count} products successfully!");

        // Add mockups for the products
        var mockups = new List<Mockup>
        {
            new Mockup
            {
                ProductId = 1,
                Name = "Front View",
                ImageUrl = "/images/tshirt-front.png",
                IsDefault = true,
                MaxWidth = 300,
                MaxHeight = 400,
                SortOrder = 1,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new Mockup
            {
                ProductId = 1,
                Name = "Back View",
                ImageUrl = "/images/tshirt-back.png",
                IsDefault = false,
                MaxWidth = 300,
                MaxHeight = 400,
                SortOrder = 2,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new Mockup
            {
                ProductId = 2,
                Name = "Front View",
                ImageUrl = "/images/premium-tshirt-front.png",
                IsDefault = true,
                MaxWidth = 300,
                MaxHeight = 400,
                SortOrder = 1,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new Mockup
            {
                ProductId = 3,
                Name = "Front View",
                ImageUrl = "/images/vintage-tshirt-front.png",
                IsDefault = true,
                MaxWidth = 300,
                MaxHeight = 400,
                SortOrder = 1,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            }
        };

        await context.Mockups.AddRangeAsync(mockups);
        await context.SaveChangesAsync();

        Console.WriteLine($"Seeded {mockups.Count} mockups successfully!");
    }
}
