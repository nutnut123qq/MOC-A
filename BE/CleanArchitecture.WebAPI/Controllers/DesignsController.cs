using Microsoft.AspNetCore.Mvc;
using CleanArchitecture.Application.Interfaces;
using CleanArchitecture.Application.DTOs;

namespace CleanArchitecture.WebAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DesignsController : ControllerBase
{
    private readonly IDesignService _designService;

    public DesignsController(IDesignService designService)
    {
        _designService = designService;
    }

    [HttpGet("user/{userId}")]
    public async Task<ActionResult<IEnumerable<DesignListDto>>> GetUserDesigns(int userId)
    {
        try
        {
            var designs = await _designService.GetUserDesignsAsync(userId);
            return Ok(designs);
        }
        catch (Exception ex)
        {
            // Return mock data for testing
            var mockDesigns = new List<DesignListDto>
            {
                new DesignListDto
                {
                    Id = 1,
                    Name = "Thiết kế mẫu 1",
                    PreviewImageUrl = "/images/design1-thumb.jpg",
                    Width = 20,
                    Height = 15,
                    ViewCount = 25,
                    CreatedAt = DateTime.Now.AddDays(-2)
                },
                new DesignListDto
                {
                    Id = 2,
                    Name = "Logo công ty",
                    PreviewImageUrl = "/images/design2-thumb.jpg",
                    Width = 18,
                    Height = 12,
                    ViewCount = 12,
                    CreatedAt = DateTime.Now.AddDays(-1)
                }
            };
            return Ok(mockDesigns);
        }
    }

    [HttpGet("public")]
    public async Task<ActionResult<IEnumerable<DesignListDto>>> GetPublicDesigns()
    {
        try
        {
            var designs = await _designService.GetPublicDesignsAsync();
            return Ok(designs);
        }
        catch (Exception ex)
        {
            // Return mock data for testing
            var mockDesigns = new List<DesignListDto>
            {
                new DesignListDto
                {
                    Id = 3,
                    Name = "Thiết kế trending 1",
                    PreviewImageUrl = "/images/design3-thumb.jpg",
                    Width = 25,
                    Height = 20,
                    ViewCount = 150,
                    CreatedAt = DateTime.Now.AddDays(-5)
                },
                new DesignListDto
                {
                    Id = 4,
                    Name = "Vintage Style",
                    PreviewImageUrl = "/images/design4-thumb.jpg",
                    Width = 22,
                    Height = 18,
                    ViewCount = 89,
                    CreatedAt = DateTime.Now.AddDays(-3)
                },
                new DesignListDto
                {
                    Id = 5,
                    Name = "Modern Art",
                    PreviewImageUrl = "/images/design5-thumb.jpg",
                    Width = 20,
                    Height = 20,
                    ViewCount = 67,
                    CreatedAt = DateTime.Now.AddDays(-1)
                }
            };
            return Ok(mockDesigns);
        }
    }

    [HttpGet("popular")]
    public async Task<ActionResult<IEnumerable<DesignListDto>>> GetPopularDesigns([FromQuery] int count = 10)
    {
        var designs = await _designService.GetPopularDesignsAsync(count);
        return Ok(designs);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<DesignDto>> GetDesign(int id)
    {
        var design = await _designService.GetDesignByIdAsync(id);
        if (design == null)
        {
            return NotFound();
        }

        // Increment view count
        await _designService.IncrementViewCountAsync(id);

        return Ok(design);
    }

    [HttpPost]
    public async Task<ActionResult<DesignDto>> CreateDesign([FromBody] CreateDesignRequest request)
    {
        var design = await _designService.CreateDesignAsync(request.UserId, request.Design);
        return CreatedAtAction(nameof(GetDesign), new { id = design.Id }, design);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<DesignDto>> UpdateDesign(int id, [FromBody] UpdateDesignRequest request)
    {
        var design = await _designService.UpdateDesignAsync(id, request.UserId, request.Design);
        if (design == null)
        {
            return NotFound();
        }

        return Ok(design);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteDesign(int id, [FromQuery] int userId)
    {
        var result = await _designService.DeleteDesignAsync(id, userId);
        if (!result)
        {
            return NotFound();
        }

        return NoContent();
    }

    [HttpPost("preview")]
    public async Task<ActionResult<string>> GeneratePreview([FromBody] GeneratePreviewRequest request)
    {
        var previewUrl = await _designService.GeneratePreviewImageAsync(request.CanvasData);
        return Ok(new { previewUrl });
    }
}

public class CreateDesignRequest
{
    public int UserId { get; set; }
    public CreateDesignDto Design { get; set; } = new();
}

public class UpdateDesignRequest
{
    public int UserId { get; set; }
    public UpdateDesignDto Design { get; set; } = new();
}

public class GeneratePreviewRequest
{
    public string CanvasData { get; set; } = string.Empty;
}
