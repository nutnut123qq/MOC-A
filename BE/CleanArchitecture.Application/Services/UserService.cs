using CleanArchitecture.Application.DTOs;
using CleanArchitecture.Application.DTOs.Auth;
using CleanArchitecture.Application.Interfaces;
using CleanArchitecture.Domain.Entities;
using CleanArchitecture.Domain.Interfaces;

namespace CleanArchitecture.Application.Services;

public class UserService : IUserService
{
    private readonly IUserRepository _userRepository;

    public UserService(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    public async Task<IEnumerable<UserProfileDto>> GetAllUsersAsync()
    {
        var users = await _userRepository.GetAllAsync();
        return users.Select(MapToUserProfileDto);
    }

    public async Task<UserProfileDto?> GetUserByIdAsync(int id)
    {
        var user = await _userRepository.GetByIdAsync(id);
        return user != null ? MapToUserProfileDto(user) : null;
    }

    public async Task<UserProfileDto?> GetUserByEmailAsync(string email)
    {
        var user = await _userRepository.GetByEmailAsync(email);
        return user != null ? MapToUserProfileDto(user) : null;
    }

    public async Task<UserProfileDto> CreateUserAsync(CreateUserDto createUserDto)
    {
        var user = new User
        {
            FirstName = createUserDto.FirstName,
            LastName = createUserDto.LastName,
            Email = createUserDto.Email,
            PasswordHash = HashPassword(createUserDto.Password), // In real app, use proper hashing
            Status = Domain.Enums.UserStatus.Active,
            CreatedAt = DateTime.UtcNow
        };

        var createdUser = await _userRepository.AddAsync(user);
        return MapToUserProfileDto(createdUser);
    }

    public async Task<UserProfileDto?> UpdateUserAsync(int id, UpdateUserDto updateUserDto)
    {
        var user = await _userRepository.GetByIdAsync(id);
        if (user == null) return null;

        user.FirstName = updateUserDto.FirstName;
        user.LastName = updateUserDto.LastName;
        user.Email = updateUserDto.Email;
        user.Status = updateUserDto.IsActive ? Domain.Enums.UserStatus.Active : Domain.Enums.UserStatus.Inactive;
        user.UpdatedAt = DateTime.UtcNow;

        await _userRepository.UpdateAsync(user);
        return MapToUserProfileDto(user);
    }

    public async Task<UserProfileDto?> UpdateUserRoleAsync(int id, int role)
    {
        var user = await _userRepository.GetByIdAsync(id);
        if (user == null) return null;

        user.Role = (Domain.Enums.UserRole)role;
        user.UpdatedAt = DateTime.UtcNow;

        await _userRepository.UpdateAsync(user);
        return MapToUserProfileDto(user);
    }

    public async Task<bool> DeleteUserAsync(int id)
    {
        var user = await _userRepository.GetByIdAsync(id);
        if (user == null) return false;

        await _userRepository.DeleteAsync(user);
        return true;
    }

    public async Task<IEnumerable<UserProfileDto>> GetActiveUsersAsync()
    {
        var users = await _userRepository.GetActiveUsersAsync();
        return users.Select(MapToUserProfileDto);
    }

    private static UserProfileDto MapToUserProfileDto(User user)
    {
        return new UserProfileDto
        {
            Id = user.Id,
            Email = user.Email,
            FirstName = user.FirstName,
            LastName = user.LastName,
            FullName = user.FullName,
            PhoneNumber = user.PhoneNumber,
            DateOfBirth = user.DateOfBirth,
            Gender = user.Gender,
            AvatarUrl = user.AvatarUrl,
            Role = user.Role,
            Status = user.Status,
            CreatedAt = user.CreatedAt,
            LastLoginAt = user.LastLoginAt,
            IsAdmin = user.IsAdmin
        };
    }

    private static string HashPassword(string password)
    {
        // In a real application, use BCrypt or similar
        return Convert.ToBase64String(System.Text.Encoding.UTF8.GetBytes(password));
    }
}
