using CleanArchitecture.Application.DTOs;
using CleanArchitecture.Application.DTOs.Auth;

namespace CleanArchitecture.Application.Interfaces;

public interface IUserService
{
    Task<IEnumerable<UserProfileDto>> GetAllUsersAsync();
    Task<UserProfileDto?> GetUserByIdAsync(int id);
    Task<UserProfileDto?> GetUserByEmailAsync(string email);
    Task<UserProfileDto> CreateUserAsync(CreateUserDto createUserDto);
    Task<UserProfileDto?> UpdateUserAsync(int id, UpdateUserDto updateUserDto);
    Task<UserProfileDto?> UpdateUserProfileAsync(int id, UpdateUserProfileDto updateUserProfileDto);
    Task<UserProfileDto?> UpdateUserRoleAsync(int id, int role);
    Task<bool> DeleteUserAsync(int id);
    Task<IEnumerable<UserProfileDto>> GetActiveUsersAsync();
}
