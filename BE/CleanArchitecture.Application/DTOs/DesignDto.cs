namespace CleanArchitecture.Application.DTOs;

public class DesignDto
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string CanvasData { get; set; } = string.Empty;
    public string PreviewImageUrl { get; set; } = string.Empty;
    public decimal Width { get; set; }
    public decimal Height { get; set; }
    public bool IsPublic { get; set; }
    public int ViewCount { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    
    // User info
    public string UserName { get; set; } = string.Empty;
}

public class CreateDesignDto
{
    public string Name { get; set; } = string.Empty;
    public string CanvasData { get; set; } = string.Empty;
    public string PreviewImageUrl { get; set; } = string.Empty;
    public decimal Width { get; set; }
    public decimal Height { get; set; }
    public bool IsPublic { get; set; } = false;
}

public class UpdateDesignDto
{
    public string Name { get; set; } = string.Empty;
    public string CanvasData { get; set; } = string.Empty;
    public string PreviewImageUrl { get; set; } = string.Empty;
    public decimal Width { get; set; }
    public decimal Height { get; set; }
    public bool IsPublic { get; set; }
}

public class DesignListDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string PreviewImageUrl { get; set; } = string.Empty;
    public decimal Width { get; set; }
    public decimal Height { get; set; }
    public int ViewCount { get; set; }
    public DateTime CreatedAt { get; set; }
}
