using CleanArchitecture.Application.DTOs;

namespace CleanArchitecture.Application.Interfaces;

public interface IAnalyticsService
{
    Task<AnalyticsOverviewDto> GetAnalyticsOverviewAsync(AnalyticsFilterDto? filter = null);
    Task<RevenueAnalyticsDto> GetRevenueAnalyticsAsync(AnalyticsFilterDto? filter = null);
    Task<UserAnalyticsDto> GetUserAnalyticsAsync(AnalyticsFilterDto? filter = null);
    Task<OrderAnalyticsDto> GetOrderAnalyticsAsync(AnalyticsFilterDto? filter = null);
    Task<DesignAnalyticsDto> GetDesignAnalyticsAsync(AnalyticsFilterDto? filter = null);
    Task<PaymentAnalyticsDto> GetPaymentAnalyticsAsync(AnalyticsFilterDto? filter = null);
}
