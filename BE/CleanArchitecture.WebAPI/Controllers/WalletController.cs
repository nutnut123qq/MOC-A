using CleanArchitecture.Application.DTOs.Wallet;
using CleanArchitecture.Application.Interfaces;
using CleanArchitecture.WebAPI.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CleanArchitecture.WebAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class WalletController : ControllerBase
{
    private readonly IWalletService _walletService;
    private readonly ILogger<WalletController> _logger;

    public WalletController(IWalletService walletService, ILogger<WalletController> logger)
    {
        _walletService = walletService;
        _logger = logger;
    }

    [HttpGet]
    public async Task<ActionResult<WalletDto>> GetWallet()
    {
        try
        {
            var userId = User.GetUserId();
            var wallet = await _walletService.GetOrCreateWalletAsync(userId);
            return Ok(wallet);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting wallet for user {UserId}", User.GetUserId());
            return StatusCode(500, new { message = "Internal server error" });
        }
    }

    [HttpGet("balance")]
    public async Task<ActionResult<decimal>> GetBalance()
    {
        try
        {
            var userId = User.GetUserId();
            var balance = await _walletService.GetBalanceAsync(userId);
            return Ok(new { balance });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting balance for user {UserId}", User.GetUserId());
            return StatusCode(500, new { message = "Internal server error" });
        }
    }

    [HttpPost("pay")]
    public async Task<ActionResult> PayFromWallet([FromBody] PayFromWalletRequest request)
    {
        try
        {
            var userId = User.GetUserId();
            var success = await _walletService.PayFromWalletAsync(userId, request);
            
            if (success)
            {
                return Ok(new { message = "Payment successful" });
            }
            else
            {
                return BadRequest(new { message = "Insufficient balance or payment failed" });
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error processing wallet payment for user {UserId}", User.GetUserId());
            return StatusCode(500, new { message = "Internal server error" });
        }
    }

    [HttpGet("transactions")]
    public async Task<ActionResult<List<WalletTransactionDto>>> GetTransactionHistory([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
    {
        try
        {
            var userId = User.GetUserId();
            var transactions = await _walletService.GetTransactionHistoryAsync(userId, page, pageSize);
            return Ok(transactions);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting transaction history for user {UserId}", User.GetUserId());
            return StatusCode(500, new { message = "Internal server error" });
        }
    }



    [HttpGet("check-balance/{amount}")]
    public async Task<ActionResult<bool>> CheckSufficientBalance(decimal amount)
    {
        try
        {
            var userId = User.GetUserId();
            var hasSufficientBalance = await _walletService.HasSufficientBalanceAsync(userId, amount);
            return Ok(new { hasSufficientBalance });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error checking balance for user {UserId}", User.GetUserId());
            return StatusCode(500, new { message = "Internal server error" });
        }
    }
}
