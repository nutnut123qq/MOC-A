using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using CleanArchitecture.Application.Interfaces;
using CleanArchitecture.Application.DTOs.Design;
using CleanArchitecture.Infrastructure.Data;
using System.Security.Claims;

namespace CleanArchitecture.WebAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class DesignsController : ControllerBase
{
    private readonly IDesignService _designService;
    private readonly ApplicationDbContext _context;

    public DesignsController(IDesignService designService, ApplicationDbContext context)
    {
        _designService = designService;
        _context = context;
    }

    private int GetCurrentUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return int.TryParse(userIdClaim, out var userId) ? userId : 0;
    }

    [HttpGet("test")]
    public IActionResult TestEndpoint()
    {
        return Ok(new { message = "Designs controller is working!", timestamp = DateTime.Now });
    }

    [HttpPost("seed-products")]
    public async Task<IActionResult> SeedProducts()
    {
        try
        {
            await CleanArchitecture.Infrastructure.Data.DataSeeder.SeedAsync(_context);
            return Ok(new { message = "Products seeded successfully!" });
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Error seeding products: {ex.Message}");
        }
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<DesignDto>>> GetMyDesigns()
    {
        try
        {
            var userId = GetCurrentUserId();
            Console.WriteLine($"GetMyDesigns called for user: {userId}");

            if (userId == 0)
                return Unauthorized("User not authenticated");

            var designs = await _designService.GetUserDesignsAsync(userId);
            Console.WriteLine($"Found {designs.Count()} designs for user {userId}");
            return Ok(designs);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error in GetMyDesigns: {ex.Message}");
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<DesignDto>> GetDesign(int id)
    {
        try
        {
            var userId = GetCurrentUserId();
            if (userId == 0)
                return Unauthorized("User not authenticated");

            var design = await _designService.GetDesignByIdAsync(id, userId);
            if (design == null)
            {
                return NotFound("Design not found or access denied");
            }

            return Ok(design);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }

    [HttpPost]
    public async Task<ActionResult<DesignDto>> CreateDesign([FromBody] CreateDesignDto createDesignDto)
    {
        try
        {
            Console.WriteLine($"CreateDesign called with data: {System.Text.Json.JsonSerializer.Serialize(createDesignDto)}");

            var userId = GetCurrentUserId();
            Console.WriteLine($"Current user ID: {userId}");

            if (userId == 0)
                return Unauthorized("User not authenticated");

            var design = await _designService.CreateDesignAsync(userId, createDesignDto);
            Console.WriteLine($"Design created successfully with ID: {design.Id}");

            return CreatedAtAction(nameof(GetDesign), new { id = design.Id }, design);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error creating design: {ex.Message}");
            Console.WriteLine($"Stack trace: {ex.StackTrace}");
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<DesignDto>> UpdateDesign(int id, [FromBody] UpdateDesignDto updateDesignDto)
    {
        try
        {
            var userId = GetCurrentUserId();
            if (userId == 0)
                return Unauthorized("User not authenticated");

            var design = await _designService.UpdateDesignAsync(id, userId, updateDesignDto);
            if (design == null)
            {
                return NotFound("Design not found or access denied");
            }

            return Ok(design);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteDesign(int id)
    {
        try
        {
            var userId = GetCurrentUserId();
            if (userId == 0)
                return Unauthorized("User not authenticated");

            var result = await _designService.DeleteDesignAsync(id, userId);
            if (!result)
            {
                return NotFound("Design not found or access denied");
            }

            return NoContent();
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }

    [HttpPost("{id}/clone")]
    public async Task<ActionResult<DesignDto>> CloneDesign(int id, [FromBody] CloneDesignRequest request)
    {
        try
        {
            var userId = GetCurrentUserId();
            if (userId == 0)
                return Unauthorized("User not authenticated");

            var design = await _designService.CloneDesignAsync(id, userId, request.NewName);
            return CreatedAtAction(nameof(GetDesign), new { id = design.Id }, design);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }
}

public class CloneDesignRequest
{
    public string NewName { get; set; } = string.Empty;
}
