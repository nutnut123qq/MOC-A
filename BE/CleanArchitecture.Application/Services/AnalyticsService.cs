using CleanArchitecture.Application.DTOs;
using CleanArchitecture.Application.Interfaces;
using CleanArchitecture.Domain.Entities;
using CleanArchitecture.Domain.Interfaces;
using CleanArchitecture.Domain.Enums;

namespace CleanArchitecture.Application.Services;

public class AnalyticsService : IAnalyticsService
{
    private readonly IUserRepository _userRepository;
    private readonly IOrderRepository _orderRepository;
    private readonly IDesignRepository _designRepository;

    public AnalyticsService(
        IUserRepository userRepository,
        IOrderRepository orderRepository,
        IDesignRepository designRepository)
    {
        _userRepository = userRepository;
        _orderRepository = orderRepository;
        _designRepository = designRepository;
    }

    public async Task<AnalyticsOverviewDto> GetAnalyticsOverviewAsync(AnalyticsFilterDto? filter = null)
    {
        var dateRange = GetDateRange(filter);

        var overview = new AnalyticsOverviewDto
        {
            Revenue = await GetRevenueAnalyticsAsync(filter),
            Users = await GetUserAnalyticsAsync(filter),
            Orders = await GetOrderAnalyticsAsync(filter),
            Designs = await GetDesignAnalyticsAsync(filter),
            Payments = await GetPaymentAnalyticsAsync(filter)
        };

        return overview;
    }

    public async Task<RevenueAnalyticsDto> GetRevenueAnalyticsAsync(AnalyticsFilterDto? filter = null)
    {
        var dateRange = GetDateRange(filter);
        var orders = await _orderRepository.GetWithItemsAsync();
        var ordersList = orders.Where(o => o.PaymentStatus == PaymentStatus.Paid).ToList();

        var filteredOrders = ordersList.Where(o => o.CreatedAt >= dateRange.StartDate && o.CreatedAt <= dateRange.EndDate).ToList();
        var totalRevenue = filteredOrders.Sum(o => o.TotalAmount);

        var today = DateTime.Today;
        var todayRevenue = ordersList.Where(o => o.CreatedAt.Date == today && o.PaymentStatus == PaymentStatus.Paid)
            .Sum(o => o.TotalAmount);

        var thisWeekStart = today.AddDays(-(int)today.DayOfWeek);
        var thisWeekRevenue = ordersList.Where(o => o.CreatedAt >= thisWeekStart && o.CreatedAt <= today.AddDays(1))
            .Sum(o => o.TotalAmount);

        var thisMonthStart = new DateTime(today.Year, today.Month, 1);
        var thisMonthRevenue = ordersList.Where(o => o.CreatedAt >= thisMonthStart && o.CreatedAt <= today.AddDays(1))
            .Sum(o => o.TotalAmount);

        var lastMonthStart = thisMonthStart.AddMonths(-1);
        var lastMonthEnd = thisMonthStart.AddDays(-1);
        var lastMonthRevenue = ordersList.Where(o => o.CreatedAt >= lastMonthStart && o.CreatedAt <= lastMonthEnd)
            .Sum(o => o.TotalAmount);

        var growthPercentage = lastMonthRevenue > 0 
            ? ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 
            : 0;

        // Revenue by date
        var revenueByDate = filteredOrders
            .GroupBy(o => o.CreatedAt.Date)
            .Select(g => new RevenueByDateDto
            {
                Date = g.Key,
                Revenue = g.Sum(o => o.TotalAmount),
                OrderCount = g.Count()
            })
            .OrderBy(r => r.Date)
            .ToList();

        // Revenue by product
        var revenueByProduct = filteredOrders
            .SelectMany(o => o.OrderItems)
            .GroupBy(oi => new { oi.Product.Name, oi.Product.Type })
            .Select(g => new RevenueByProductDto
            {
                ProductName = g.Key.Name,
                ProductType = g.Key.Type,
                Revenue = g.Sum(oi => oi.TotalPrice),
                OrderCount = g.Count()
            })
            .OrderByDescending(r => r.Revenue)
            .ToList();

        // Calculate percentages
        foreach (var product in revenueByProduct)
        {
            product.Percentage = totalRevenue > 0 ? (product.Revenue / totalRevenue) * 100 : 0;
        }

        return new RevenueAnalyticsDto
        {
            TotalRevenue = totalRevenue,
            TodayRevenue = todayRevenue,
            ThisWeekRevenue = thisWeekRevenue,
            ThisMonthRevenue = thisMonthRevenue,
            LastMonthRevenue = lastMonthRevenue,
            GrowthPercentage = growthPercentage,
            RevenueByDate = revenueByDate,
            RevenueByProduct = revenueByProduct
        };
    }

    public async Task<UserAnalyticsDto> GetUserAnalyticsAsync(AnalyticsFilterDto? filter = null)
    {
        var dateRange = GetDateRange(filter);
        var users = (await _userRepository.GetAllAsync()).ToList();

        var totalUsers = users.Count;
        var activeUsers = users.Count(u => u.Status == UserStatus.Active);

        var today = DateTime.Today;
        var newUsersToday = users.Count(u => u.CreatedAt.Date == today);

        var thisWeekStart = today.AddDays(-(int)today.DayOfWeek);
        var newUsersThisWeek = users.Count(u => u.CreatedAt >= thisWeekStart);

        var thisMonthStart = new DateTime(today.Year, today.Month, 1);
        var newUsersThisMonth = users.Count(u => u.CreatedAt >= thisMonthStart);

        var lastMonthStart = thisMonthStart.AddMonths(-1);
        var lastMonthEnd = thisMonthStart.AddDays(-1);
        var newUsersLastMonth = users.Count(u => u.CreatedAt >= lastMonthStart && u.CreatedAt <= lastMonthEnd);

        var growthPercentage = newUsersLastMonth > 0 
            ? ((decimal)(newUsersThisMonth - newUsersLastMonth) / newUsersLastMonth) * 100 
            : 0;

        // User growth by date
        var userGrowthByDate = users
            .Where(u => u.CreatedAt >= dateRange.StartDate && u.CreatedAt <= dateRange.EndDate)
            .GroupBy(u => u.CreatedAt.Date)
            .Select(g => new UserGrowthDto
            {
                Date = g.Key,
                NewUsers = g.Count(),
                TotalUsers = users.Count(u => u.CreatedAt.Date <= g.Key)
            })
            .OrderBy(u => u.Date)
            .ToList();

        return new UserAnalyticsDto
        {
            TotalUsers = totalUsers,
            ActiveUsers = activeUsers,
            NewUsersToday = newUsersToday,
            NewUsersThisWeek = newUsersThisWeek,
            NewUsersThisMonth = newUsersThisMonth,
            GrowthPercentage = growthPercentage,
            UserGrowthByDate = userGrowthByDate,
            UserActivity = new List<UserActivityDto>() // Will implement later if needed
        };
    }

    public async Task<OrderAnalyticsDto> GetOrderAnalyticsAsync(AnalyticsFilterDto? filter = null)
    {
        var dateRange = GetDateRange(filter);
        var allOrders = await _orderRepository.GetAllAsync();
        var orders = allOrders.Where(o => o.CreatedAt >= dateRange.StartDate && o.CreatedAt <= dateRange.EndDate).ToList();

        var totalOrders = orders.Count;
        var pendingOrders = orders.Count(o => o.Status == OrderStatus.Pending);
        var completedOrders = orders.Count(o => o.Status == OrderStatus.Completed);
        var cancelledOrders = orders.Count(o => o.Status == OrderStatus.Cancelled);

        var completionRate = totalOrders > 0 ? ((decimal)completedOrders / totalOrders) * 100 : 0;
        var averageOrderValue = orders.Any() ? orders.Average(o => o.TotalAmount) : 0;

        // Status distribution
        var statusDistribution = orders
            .GroupBy(o => o.Status)
            .Select(g => new OrderStatusDistributionDto
            {
                Status = g.Key,
                StatusName = g.Key.ToString(),
                Count = g.Count(),
                Percentage = totalOrders > 0 ? ((decimal)g.Count() / totalOrders) * 100 : 0
            })
            .ToList();

        // Order trends
        var orderTrends = orders
            .GroupBy(o => o.CreatedAt.Date)
            .Select(g => new OrderTrendDto
            {
                Date = g.Key,
                OrderCount = g.Count(),
                TotalValue = g.Sum(o => o.TotalAmount)
            })
            .OrderBy(t => t.Date)
            .ToList();

        return new OrderAnalyticsDto
        {
            TotalOrders = totalOrders,
            PendingOrders = pendingOrders,
            CompletedOrders = completedOrders,
            CancelledOrders = cancelledOrders,
            CompletionRate = completionRate,
            AverageOrderValue = averageOrderValue,
            StatusDistribution = statusDistribution,
            OrderTrends = orderTrends
        };
    }

    public async Task<DesignAnalyticsDto> GetDesignAnalyticsAsync(AnalyticsFilterDto? filter = null)
    {
        var dateRange = GetDateRange(filter);
        var allDesigns = await _designRepository.GetAllAsync();
        var designs = allDesigns.Where(d => d.CreatedAt >= dateRange.StartDate && d.CreatedAt <= dateRange.EndDate).ToList();

        var totalDesigns = designs.Count;
        var today = DateTime.Today;
        var designsToday = designs.Count(d => d.CreatedAt.Date == today);

        var thisWeekStart = today.AddDays(-(int)today.DayOfWeek);
        var designsThisWeek = designs.Count(d => d.CreatedAt >= thisWeekStart);

        var thisMonthStart = new DateTime(today.Year, today.Month, 1);
        var designsThisMonth = designs.Count(d => d.CreatedAt >= thisMonthStart);

        var allUsers = await _userRepository.GetAllAsync();
        var totalUsers = allUsers.Count();
        var averageDesignsPerUser = totalUsers > 0 ? (decimal)totalDesigns / totalUsers : 0;

        // Design trends
        var designTrends = designs
            .GroupBy(d => d.CreatedAt.Date)
            .Select(g => new DesignTrendDto
            {
                Date = g.Key,
                DesignCount = g.Count()
            })
            .OrderBy(t => t.Date)
            .ToList();

        return new DesignAnalyticsDto
        {
            TotalDesigns = totalDesigns,
            DesignsToday = designsToday,
            DesignsThisWeek = designsThisWeek,
            DesignsThisMonth = designsThisMonth,
            AverageDesignsPerUser = averageDesignsPerUser,
            DesignTrends = designTrends,
            PopularDesigns = new List<PopularDesignDto>() // Will implement later
        };
    }

    public async Task<PaymentAnalyticsDto> GetPaymentAnalyticsAsync(AnalyticsFilterDto? filter = null)
    {
        var dateRange = GetDateRange(filter);
        var allOrders = await _orderRepository.GetAllAsync();
        var orders = allOrders.Where(o => o.CreatedAt >= dateRange.StartDate && o.CreatedAt <= dateRange.EndDate).ToList();

        var payOSOrders = orders.Where(o => o.PaymentMethod == PaymentMethod.PayOS).ToList();
        var walletOrders = orders.Where(o => o.PaymentMethod == PaymentMethod.Wallet).ToList();

        var totalPayOSRevenue = payOSOrders.Where(o => o.PaymentStatus == PaymentStatus.Paid).Sum(o => o.TotalAmount);
        var totalWalletRevenue = walletOrders.Where(o => o.PaymentStatus == PaymentStatus.Paid).Sum(o => o.TotalAmount);

        var payOSSuccessRate = payOSOrders.Any() 
            ? ((decimal)payOSOrders.Count(o => o.PaymentStatus == PaymentStatus.Paid) / payOSOrders.Count) * 100 
            : 0;

        var walletSuccessRate = walletOrders.Any() 
            ? ((decimal)walletOrders.Count(o => o.PaymentStatus == PaymentStatus.Paid) / walletOrders.Count) * 100 
            : 0;

        var totalRevenue = totalPayOSRevenue + totalWalletRevenue;

        var paymentMethodDistribution = new List<PaymentMethodDistributionDto>
        {
            new PaymentMethodDistributionDto
            {
                PaymentMethod = PaymentMethod.PayOS,
                MethodName = "PayOS",
                Revenue = totalPayOSRevenue,
                TransactionCount = payOSOrders.Count(o => o.PaymentStatus == PaymentStatus.Paid),
                Percentage = totalRevenue > 0 ? (totalPayOSRevenue / totalRevenue) * 100 : 0
            },
            new PaymentMethodDistributionDto
            {
                PaymentMethod = PaymentMethod.Wallet,
                MethodName = "Wallet",
                Revenue = totalWalletRevenue,
                TransactionCount = walletOrders.Count(o => o.PaymentStatus == PaymentStatus.Paid),
                Percentage = totalRevenue > 0 ? (totalWalletRevenue / totalRevenue) * 100 : 0
            }
        };

        return new PaymentAnalyticsDto
        {
            TotalPayOSRevenue = totalPayOSRevenue,
            TotalWalletRevenue = totalWalletRevenue,
            PayOSTransactionCount = payOSOrders.Count(o => o.PaymentStatus == PaymentStatus.Paid),
            WalletTransactionCount = walletOrders.Count(o => o.PaymentStatus == PaymentStatus.Paid),
            PayOSSuccessRate = payOSSuccessRate,
            WalletSuccessRate = walletSuccessRate,
            PaymentMethodDistribution = paymentMethodDistribution
        };
    }

    private (DateTime StartDate, DateTime EndDate) GetDateRange(AnalyticsFilterDto? filter)
    {
        if (filter?.StartDate.HasValue == true && filter?.EndDate.HasValue == true)
        {
            return (filter.StartDate.Value, filter.EndDate.Value);
        }

        var endDate = DateTime.Today.AddDays(1); // Include today
        var startDate = filter?.Period switch
        {
            "7days" => endDate.AddDays(-7),
            "90days" => endDate.AddDays(-90),
            "1year" => endDate.AddYears(-1),
            _ => endDate.AddDays(-30) // Default 30 days
        };

        return (startDate, endDate);
    }
}
