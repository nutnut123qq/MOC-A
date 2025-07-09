using CleanArchitecture.Domain.Common;

namespace CleanArchitecture.Domain.Entities;

public class DesignFile : BaseEntity
{
    public int DesignId { get; set; }
    public string LayerId { get; set; } = string.Empty;
    public string FileName { get; set; } = string.Empty;
    public string FilePath { get; set; } = string.Empty;
    public long FileSize { get; set; }
    public string MimeType { get; set; } = string.Empty;
    
    // Navigation properties
    public virtual Design Design { get; set; } = null!;
}
