using CleanArchitecture.Application.DTOs.Wallet;
using CleanArchitecture.Application.Interfaces;
using CleanArchitecture.Domain.Entities;
using CleanArchitecture.Domain.Enums;
using CleanArchitecture.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace CleanArchitecture.Infrastructure.Services;

public class WalletService : IWalletService
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<WalletService> _logger;

    public WalletService(ApplicationDbContext context, ILogger<WalletService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<WalletDto> GetOrCreateWalletAsync(int userId)
    {
        var wallet = await _context.Wallets
            .FirstOrDefaultAsync(w => w.UserId == userId);

        if (wallet == null)
        {
            wallet = new Wallet
            {
                UserId = userId,
                Balance = 0,
                Currency = "VND",
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };

            _context.Wallets.Add(wallet);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Created new wallet for user {UserId}", userId);
        }

        return new WalletDto
        {
            Id = wallet.Id,
            UserId = wallet.UserId,
            Balance = wallet.Balance,
            Currency = wallet.Currency,
            IsActive = wallet.IsActive,
            LastTransactionAt = wallet.LastTransactionAt,
            CreatedAt = wallet.CreatedAt
        };
    }

    public async Task<decimal> GetBalanceAsync(int userId)
    {
        var wallet = await GetOrCreateWalletAsync(userId);
        return wallet.Balance;
    }

    public async Task<bool> PayFromWalletAsync(int userId, PayFromWalletRequest request)
    {
        using var transaction = await _context.Database.BeginTransactionAsync();
        try
        {
            var wallet = await _context.Wallets
                .FirstOrDefaultAsync(w => w.UserId == userId);

            if (wallet == null || wallet.Balance < request.Amount)
            {
                return false;
            }

            var balanceBefore = wallet.Balance;
            wallet.Balance -= request.Amount;
            wallet.LastTransactionAt = DateTime.UtcNow;
            wallet.UpdatedAt = DateTime.UtcNow;

            var walletTransaction = new WalletTransaction
            {
                WalletId = wallet.Id,
                OrderId = request.OrderId,
                TransactionType = "PAYMENT",
                Amount = -request.Amount, // Negative for payment
                BalanceBefore = balanceBefore,
                BalanceAfter = wallet.Balance,
                Description = request.Description,
                Status = TransactionStatus.Completed,
                CompletedAt = DateTime.UtcNow,
                CreatedAt = DateTime.UtcNow
            };

            _context.WalletTransactions.Add(walletTransaction);
            await _context.SaveChangesAsync();
            await transaction.CommitAsync();

            _logger.LogInformation("Payment from wallet completed. User: {UserId}, Amount: {Amount}, Order: {OrderId}", 
                userId, request.Amount, request.OrderId);

            return true;
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
            _logger.LogError(ex, "Error processing wallet payment for user {UserId}", userId);
            throw;
        }
    }

    public async Task<List<WalletTransactionDto>> GetTransactionHistoryAsync(int userId, int page = 1, int pageSize = 20)
    {
        var wallet = await _context.Wallets
            .FirstOrDefaultAsync(w => w.UserId == userId);

        if (wallet == null)
        {
            return new List<WalletTransactionDto>();
        }

        var transactions = await _context.WalletTransactions
            .Where(t => t.WalletId == wallet.Id)
            .OrderByDescending(t => t.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(t => new WalletTransactionDto
            {
                Id = t.Id,
                WalletId = t.WalletId,
                OrderId = t.OrderId,
                TransactionType = t.TransactionType,
                Amount = t.Amount,
                BalanceBefore = t.BalanceBefore,
                BalanceAfter = t.BalanceAfter,
                Description = t.Description,
                PayOSOrderCode = t.PayOSOrderCode,
                PayOSTransactionId = t.PayOSTransactionId,
                Status = t.Status,
                CompletedAt = t.CompletedAt,
                FailureReason = t.FailureReason,
                CreatedAt = t.CreatedAt
            })
            .ToListAsync();

        return transactions;
    }

    public async Task<WalletTransaction> CreateTopUpTransactionAsync(int userId, decimal amount, string payOSOrderCode)
    {
        var wallet = await GetOrCreateWalletAsync(userId);

        var transaction = new WalletTransaction
        {
            WalletId = wallet.Id,
            TransactionType = "TOPUP",
            Amount = amount,
            BalanceBefore = wallet.Balance,
            BalanceAfter = wallet.Balance, // Will be updated when completed
            Description = $"Nạp tiền vào ví qua PayOS",
            PayOSOrderCode = payOSOrderCode,
            Status = TransactionStatus.Pending,
            CreatedAt = DateTime.UtcNow
        };

        _context.WalletTransactions.Add(transaction);
        await _context.SaveChangesAsync();

        return transaction;
    }

    public async Task CompleteTopUpTransactionAsync(string payOSOrderCode, string payOSTransactionId)
    {
        _logger.LogInformation("🔄 Starting CompleteTopUpTransactionAsync for PayOSOrderCode: {PayOSOrderCode}", payOSOrderCode);

        using var transaction = await _context.Database.BeginTransactionAsync();
        try
        {
            var walletTransaction = await _context.WalletTransactions
                .Include(t => t.Wallet)
                .FirstOrDefaultAsync(t => t.PayOSOrderCode == payOSOrderCode);

            if (walletTransaction == null)
            {
                _logger.LogError("❌ Transaction not found for PayOSOrderCode: {PayOSOrderCode}", payOSOrderCode);
                throw new ArgumentException("Transaction not found");
            }

            _logger.LogInformation("💰 Found transaction {TransactionId}, Amount: {Amount}, Current Status: {Status}",
                walletTransaction.Id, walletTransaction.Amount, walletTransaction.Status);

            // Check if transaction is already completed to prevent double processing
            if (walletTransaction.Status == TransactionStatus.Completed)
            {
                _logger.LogWarning("⚠️ Transaction {TransactionId} is already completed. Skipping processing.", walletTransaction.Id);
                await transaction.CommitAsync();
                return;
            }

            var wallet = walletTransaction.Wallet;
            var oldBalance = wallet.Balance;

            wallet.Balance += walletTransaction.Amount;
            wallet.LastTransactionAt = DateTime.UtcNow;
            wallet.UpdatedAt = DateTime.UtcNow;

            walletTransaction.BalanceAfter = wallet.Balance;
            walletTransaction.PayOSTransactionId = payOSTransactionId;
            walletTransaction.Status = TransactionStatus.Completed;
            walletTransaction.CompletedAt = DateTime.UtcNow;
            walletTransaction.UpdatedAt = DateTime.UtcNow;

            _logger.LogInformation("💰 Updating wallet balance: {OldBalance} + {Amount} = {NewBalance}",
                oldBalance, walletTransaction.Amount, wallet.Balance);

            await _context.SaveChangesAsync();
            await transaction.CommitAsync();

            _logger.LogInformation("✅ Top-up transaction completed successfully. PayOS Order Code: {OrderCode}, Amount: {Amount}, New Balance: {Balance}",
                payOSOrderCode, walletTransaction.Amount, wallet.Balance);
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
            _logger.LogError(ex, "❌ Error completing top-up transaction for PayOS order code: {OrderCode}", payOSOrderCode);
            throw;
        }
    }

    public async Task FailTopUpTransactionAsync(string payOSOrderCode, string reason)
    {
        var walletTransaction = await _context.WalletTransactions
            .FirstOrDefaultAsync(t => t.PayOSOrderCode == payOSOrderCode);

        if (walletTransaction != null)
        {
            walletTransaction.Status = TransactionStatus.Failed;
            walletTransaction.FailureReason = reason;
            walletTransaction.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            _logger.LogWarning("Top-up transaction failed. PayOS Order Code: {OrderCode}, Reason: {Reason}", 
                payOSOrderCode, reason);
        }
    }

    public async Task<WalletTransaction?> GetTransactionByPayOSOrderCodeAsync(string payOSOrderCode)
    {
        _logger.LogInformation("🔍 Searching for wallet transaction with PayOSOrderCode: {PayOSOrderCode}", payOSOrderCode);

        var transaction = await _context.WalletTransactions
            .Include(t => t.Wallet)
            .FirstOrDefaultAsync(t => t.PayOSOrderCode == payOSOrderCode);

        if (transaction != null)
        {
            _logger.LogInformation("✅ Found wallet transaction {TransactionId} with status {Status}", transaction.Id, transaction.Status);
        }
        else
        {
            _logger.LogWarning("⚠️ No wallet transaction found with PayOSOrderCode: {PayOSOrderCode}", payOSOrderCode);
        }

        return transaction;
    }

    public async Task<WalletTransaction> CreateTransactionAsync(int walletId, CreateWalletTransactionRequest request)
    {
        var wallet = await _context.Wallets.FindAsync(walletId);
        if (wallet == null)
        {
            throw new ArgumentException("Wallet not found");
        }

        var transaction = new WalletTransaction
        {
            WalletId = walletId,
            OrderId = request.OrderId,
            TransactionType = request.TransactionType,
            Amount = request.Amount,
            BalanceBefore = wallet.Balance,
            BalanceAfter = wallet.Balance + request.Amount,
            Description = request.Description,
            Status = TransactionStatus.Pending,
            CreatedAt = DateTime.UtcNow
        };

        _context.WalletTransactions.Add(transaction);
        await _context.SaveChangesAsync();

        return transaction;
    }

    public async Task<bool> HasSufficientBalanceAsync(int userId, decimal amount)
    {
        var balance = await GetBalanceAsync(userId);
        return balance >= amount;
    }
}
