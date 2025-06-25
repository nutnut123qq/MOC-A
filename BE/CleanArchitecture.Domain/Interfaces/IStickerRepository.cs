using CleanArchitecture.Domain.Entities;

namespace CleanArchitecture.Domain.Interfaces;

public interface IStickerRepository : IRepository<Sticker>
{
    Task<IEnumerable<Sticker>> GetActiveStickerAsync();
    Task<IEnumerable<Sticker>> GetByCategoryAsync(string category);
    Task<IEnumerable<Sticker>> SearchAsync(string searchTerm);
    Task<IEnumerable<string>> GetCategoriesAsync();
    Task<IEnumerable<Sticker>> GetPopularStickersAsync(int count = 10);
    Task IncrementUsageCountAsync(int id);
}
