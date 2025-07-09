using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace CleanArchitecture.Application.DTOs.Design;

public class CreateDesignDto
{
    [Required(ErrorMessage = "Tên thiết kế là bắt buộc")]
    [MaxLength(100, ErrorMessage = "Tên thiết kế không được vượt quá 100 ký tự")]
    [JsonPropertyName("name")]
    public string Name { get; set; } = string.Empty;

    [MaxLength(500, ErrorMessage = "Mô tả không được vượt quá 500 ký tự")]
    [JsonPropertyName("description")]
    public string? Description { get; set; }

    [Required(ErrorMessage = "ID sản phẩm là bắt buộc")]
    [JsonPropertyName("productId")]
    public int ProductId { get; set; }

    [Required(ErrorMessage = "Dữ liệu thiết kế là bắt buộc")]
    [JsonPropertyName("designSession")]
    public TShirtDesignSessionDto DesignSession { get; set; } = new();
}
