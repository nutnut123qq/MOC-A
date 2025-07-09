using System.ComponentModel.DataAnnotations;

namespace CleanArchitecture.Application.DTOs.Design;

public class UpdateDesignDto
{
    [Required(ErrorMessage = "Tên thiết kế là bắt buộc")]
    [MaxLength(100, ErrorMessage = "Tên thiết kế không được vượt quá 100 ký tự")]
    public string Name { get; set; } = string.Empty;

    [MaxLength(500, ErrorMessage = "Mô tả không được vượt quá 500 ký tự")]
    public string? Description { get; set; }

    [Required(ErrorMessage = "Dữ liệu thiết kế là bắt buộc")]
    public TShirtDesignSessionDto DesignSession { get; set; } = new();
}
