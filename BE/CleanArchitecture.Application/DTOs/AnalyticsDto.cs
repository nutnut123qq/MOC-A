using CleanArchitecture.Domain.Entities;

namespace CleanArchitecture.Application.DTOs;

public class AnalyticsOverviewDto
{
    public RevenueAnalyticsDto Revenue { get; set; } = new();
    public UserAnalyticsDto Users { get; set; } = new();
    public OrderAnalyticsDto Orders { get; set; } = new();
    public DesignAnalyticsDto Designs { get; set; } = new();
    public PaymentAnalyticsDto Payments { get; set; } = new();
}

public class RevenueAnalyticsDto
{
    public decimal TotalRevenue { get; set; }
    public decimal TodayRevenue { get; set; }
    public decimal ThisWeekRevenue { get; set; }
    public decimal ThisMonthRevenue { get; set; }
    public decimal LastMonthRevenue { get; set; }
    public decimal GrowthPercentage { get; set; }
    public List<RevenueByDateDto> RevenueByDate { get; set; } = new();
    public List<RevenueByProductDto> RevenueByProduct { get; set; } = new();
}

public class RevenueByDateDto
{
    public DateTime Date { get; set; }
    public decimal Revenue { get; set; }
    public int OrderCount { get; set; }
}

public class RevenueByProductDto
{
    public string ProductName { get; set; } = string.Empty;
    public ProductType ProductType { get; set; }
    public decimal Revenue { get; set; }
    public int OrderCount { get; set; }
    public decimal Percentage { get; set; }
}

public class UserAnalyticsDto
{
    public int TotalUsers { get; set; }
    public int ActiveUsers { get; set; }
    public int NewUsersToday { get; set; }
    public int NewUsersThisWeek { get; set; }
    public int NewUsersThisMonth { get; set; }
    public decimal GrowthPercentage { get; set; }
    public List<UserGrowthDto> UserGrowthByDate { get; set; } = new();
    public List<UserActivityDto> UserActivity { get; set; } = new();
}

public class UserGrowthDto
{
    public DateTime Date { get; set; }
    public int NewUsers { get; set; }
    public int TotalUsers { get; set; }
}

public class UserActivityDto
{
    public DateTime Date { get; set; }
    public int ActiveUsers { get; set; }
    public int LoginCount { get; set; }
}

public class OrderAnalyticsDto
{
    public int TotalOrders { get; set; }
    public int PendingOrders { get; set; }
    public int CompletedOrders { get; set; }
    public int CancelledOrders { get; set; }
    public decimal CompletionRate { get; set; }
    public decimal AverageOrderValue { get; set; }
    public List<OrderStatusDistributionDto> StatusDistribution { get; set; } = new();
    public List<OrderTrendDto> OrderTrends { get; set; } = new();
}

public class OrderStatusDistributionDto
{
    public OrderStatus Status { get; set; }
    public string StatusName { get; set; } = string.Empty;
    public int Count { get; set; }
    public decimal Percentage { get; set; }
}

public class OrderTrendDto
{
    public DateTime Date { get; set; }
    public int OrderCount { get; set; }
    public decimal TotalValue { get; set; }
}

public class DesignAnalyticsDto
{
    public int TotalDesigns { get; set; }
    public int DesignsToday { get; set; }
    public int DesignsThisWeek { get; set; }
    public int DesignsThisMonth { get; set; }
    public decimal AverageDesignsPerUser { get; set; }
    public List<DesignTrendDto> DesignTrends { get; set; } = new();
    public List<PopularDesignDto> PopularDesigns { get; set; } = new();
}

public class DesignTrendDto
{
    public DateTime Date { get; set; }
    public int DesignCount { get; set; }
}

public class PopularDesignDto
{
    public int DesignId { get; set; }
    public string DesignName { get; set; } = string.Empty;
    public string PreviewUrl { get; set; } = string.Empty;
    public int OrderCount { get; set; }
    public decimal Revenue { get; set; }
}

public class PaymentAnalyticsDto
{
    public decimal TotalPayOSRevenue { get; set; }
    public decimal TotalWalletRevenue { get; set; }
    public int PayOSTransactionCount { get; set; }
    public int WalletTransactionCount { get; set; }
    public decimal PayOSSuccessRate { get; set; }
    public decimal WalletSuccessRate { get; set; }
    public List<PaymentMethodDistributionDto> PaymentMethodDistribution { get; set; } = new();
}

public class PaymentMethodDistributionDto
{
    public PaymentMethod PaymentMethod { get; set; }
    public string MethodName { get; set; } = string.Empty;
    public decimal Revenue { get; set; }
    public int TransactionCount { get; set; }
    public decimal Percentage { get; set; }
}

public class AnalyticsFilterDto
{
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public string? Period { get; set; } = "30days"; // 7days, 30days, 90days, 1year
}
