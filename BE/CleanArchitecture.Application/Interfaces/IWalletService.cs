using CleanArchitecture.Application.DTOs.Wallet;
using CleanArchitecture.Domain.Entities;

namespace CleanArchitecture.Application.Interfaces;

public interface IWalletService
{
    Task<WalletDto> GetOrCreateWalletAsync(int userId);
    Task<decimal> GetBalanceAsync(int userId);
    Task<bool> PayFromWalletAsync(int userId, PayFromWalletRequest request);
    Task<List<WalletTransactionDto>> GetTransactionHistoryAsync(int userId, int page = 1, int pageSize = 20);
    
    // PayOS integration methods
    Task<WalletTransaction> CreateTopUpTransactionAsync(int userId, decimal amount, string payOSOrderCode);
    Task CompleteTopUpTransactionAsync(string payOSOrderCode, string payOSTransactionId);
    Task FailTopUpTransactionAsync(string payOSOrderCode, string reason);
    Task<WalletTransaction?> GetTransactionByPayOSOrderCodeAsync(string payOSOrderCode);
    
    // Internal transaction methods
    Task<WalletTransaction> CreateTransactionAsync(int walletId, CreateWalletTransactionRequest request);
    Task<bool> HasSufficientBalanceAsync(int userId, decimal amount);
}
