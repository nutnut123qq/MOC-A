namespace CleanArchitecture.Application.DTOs.Design;

public class DesignDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int ProductId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public string? PreviewImageUrl { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public TShirtDesignSessionDto? DesignSession { get; set; }
}
