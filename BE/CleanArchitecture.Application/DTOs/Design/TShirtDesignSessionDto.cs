using System.Text.Json.Serialization;

namespace CleanArchitecture.Application.DTOs.Design;

public class TShirtDesignSessionDto
{
    [JsonPropertyName("selectedSize")]
    public string SelectedSize { get; set; } = "M";

    [JsonPropertyName("selectedColor")]
    public string SelectedColor { get; set; } = "white";

    [JsonPropertyName("designLayers")]
    public List<DesignLayerDto> DesignLayers { get; set; } = new();
}

public class DesignLayerDto
{
    [JsonPropertyName("id")]
    public string Id { get; set; } = string.Empty;

    [JsonPropertyName("type")]
    public string Type { get; set; } = string.Empty; // text, image, shape

    [JsonPropertyName("printArea")]
    public string PrintArea { get; set; } = "front"; // front, back

    [JsonPropertyName("position")]
    public PositionDto Position { get; set; } = new();

    [JsonPropertyName("style")]
    public StyleDto? Style { get; set; } // Style properties (width, height, etc.)

    [JsonPropertyName("transform")]
    public TransformDto? Transform { get; set; } // Transform properties (rotation, scale, etc.)

    [JsonPropertyName("data")]
    public object Data { get; set; } = new(); // Layer-specific data (legacy)

    [JsonPropertyName("content")]
    public object? Content { get; set; } // New content field for temp files

    [JsonPropertyName("locked")]
    public bool Locked { get; set; } = false;

    [JsonPropertyName("visible")]
    public bool Visible { get; set; } = true;
}

public class PositionDto
{
    [JsonPropertyName("x")]
    public double X { get; set; }

    [JsonPropertyName("y")]
    public double Y { get; set; }
}

public class StyleDto
{
    [JsonPropertyName("width")]
    public double Width { get; set; }

    [JsonPropertyName("height")]
    public double Height { get; set; }

    [JsonPropertyName("fontSize")]
    public string? FontSize { get; set; }

    [JsonPropertyName("fontFamily")]
    public string? FontFamily { get; set; }

    [JsonPropertyName("color")]
    public string? Color { get; set; }

    [JsonPropertyName("backgroundColor")]
    public string? BackgroundColor { get; set; }

    [JsonPropertyName("opacity")]
    public double Opacity { get; set; } = 1.0;
}

public class TransformDto
{
    [JsonPropertyName("rotation")]
    public double Rotation { get; set; }

    [JsonPropertyName("scaleX")]
    public double ScaleX { get; set; } = 1.0;

    [JsonPropertyName("scaleY")]
    public double ScaleY { get; set; } = 1.0;

    [JsonPropertyName("skewX")]
    public double SkewX { get; set; } = 0.0;

    [JsonPropertyName("skewY")]
    public double SkewY { get; set; } = 0.0;
}
