using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using CleanArchitecture.Application.Interfaces;
using CleanArchitecture.Application.DTOs;
using CleanArchitecture.Application.DTOs.Auth;

namespace CleanArchitecture.WebAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly IUserService _userService;

    public UsersController(IUserService userService)
    {
        _userService = userService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<UserProfileDto>>> GetUsers()
    {
        var users = await _userService.GetAllUsersAsync();
        return Ok(users);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<UserProfileDto>> GetUser(int id)
    {
        var user = await _userService.GetUserByIdAsync(id);

        if (user == null)
        {
            return NotFound();
        }

        return Ok(user);
    }

    [HttpGet("active")]
    public async Task<ActionResult<IEnumerable<UserProfileDto>>> GetActiveUsers()
    {
        var users = await _userService.GetActiveUsersAsync();
        return Ok(users);
    }

    [HttpPost]
    public async Task<ActionResult<UserProfileDto>> PostUser(CreateUserDto createUserDto)
    {
        var user = await _userService.CreateUserAsync(createUserDto);
        return CreatedAtAction("GetUser", new { id = user.Id }, user);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> PutUser(int id, [FromBody] dynamic updateData)
    {
        try
        {
            // Check if this is a role update
            if (updateData.role != null)
            {
                int roleValue = (int)updateData.role;
                var user = await _userService.UpdateUserRoleAsync(id, roleValue);

                if (user == null)
                {
                    return NotFound();
                }

                return Ok(user);
            }

            // Handle other updates if needed
            return BadRequest("Invalid update data");
        }
        catch (Exception ex)
        {
            return BadRequest($"Error updating user: {ex.Message}");
        }
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteUser(int id)
    {
        var result = await _userService.DeleteUserAsync(id);

        if (!result)
        {
            return NotFound();
        }

        return NoContent();
    }
}
