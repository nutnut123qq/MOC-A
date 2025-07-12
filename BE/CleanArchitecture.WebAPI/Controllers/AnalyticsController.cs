using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using CleanArchitecture.Application.Interfaces;
using CleanArchitecture.Application.DTOs;

namespace CleanArchitecture.WebAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")]
public class AnalyticsController : ControllerBase
{
    private readonly IAnalyticsService _analyticsService;
    private readonly ILogger<AnalyticsController> _logger;

    public AnalyticsController(IAnalyticsService analyticsService, ILogger<AnalyticsController> logger)
    {
        _analyticsService = analyticsService;
        _logger = logger;
    }

    [HttpGet("overview")]
    public async Task<ActionResult<AnalyticsOverviewDto>> GetAnalyticsOverview([FromQuery] AnalyticsFilterDto? filter = null)
    {
        try
        {
            var analytics = await _analyticsService.GetAnalyticsOverviewAsync(filter);
            return Ok(analytics);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting analytics overview");
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpGet("revenue")]
    public async Task<ActionResult<RevenueAnalyticsDto>> GetRevenueAnalytics([FromQuery] AnalyticsFilterDto? filter = null)
    {
        try
        {
            var analytics = await _analyticsService.GetRevenueAnalyticsAsync(filter);
            return Ok(analytics);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting revenue analytics");
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpGet("users")]
    public async Task<ActionResult<UserAnalyticsDto>> GetUserAnalytics([FromQuery] AnalyticsFilterDto? filter = null)
    {
        try
        {
            var analytics = await _analyticsService.GetUserAnalyticsAsync(filter);
            return Ok(analytics);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting user analytics");
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpGet("orders")]
    public async Task<ActionResult<OrderAnalyticsDto>> GetOrderAnalytics([FromQuery] AnalyticsFilterDto? filter = null)
    {
        try
        {
            var analytics = await _analyticsService.GetOrderAnalyticsAsync(filter);
            return Ok(analytics);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting order analytics");
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpGet("designs")]
    public async Task<ActionResult<DesignAnalyticsDto>> GetDesignAnalytics([FromQuery] AnalyticsFilterDto? filter = null)
    {
        try
        {
            var analytics = await _analyticsService.GetDesignAnalyticsAsync(filter);
            return Ok(analytics);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting design analytics");
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpGet("payments")]
    public async Task<ActionResult<PaymentAnalyticsDto>> GetPaymentAnalytics([FromQuery] AnalyticsFilterDto? filter = null)
    {
        try
        {
            var analytics = await _analyticsService.GetPaymentAnalyticsAsync(filter);
            return Ok(analytics);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting payment analytics");
            return StatusCode(500, "Internal server error");
        }
    }
}
