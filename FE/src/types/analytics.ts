export interface AnalyticsOverview {
  revenue: RevenueAnalytics;
  users: UserAnalytics;
  orders: OrderAnalytics;
  designs: DesignAnalytics;
  payments: PaymentAnalytics;
}

export interface RevenueAnalytics {
  totalRevenue: number;
  todayRevenue: number;
  thisWeekRevenue: number;
  thisMonthRevenue: number;
  lastMonthRevenue: number;
  growthPercentage: number;
  revenueByDate: RevenueByDate[];
  revenueByProduct: RevenueByProduct[];
}

export interface RevenueByDate {
  date: string;
  revenue: number;
  orderCount: number;
}

export interface RevenueByProduct {
  productName: string;
  productType: number;
  revenue: number;
  orderCount: number;
  percentage: number;
}

export interface UserAnalytics {
  totalUsers: number;
  activeUsers: number;
  newUsersToday: number;
  newUsersThisWeek: number;
  newUsersThisMonth: number;
  growthPercentage: number;
  userGrowthByDate: UserGrowthByDate[];
  userActivity: UserActivity[];
}

export interface UserGrowthByDate {
  date: string;
  newUsers: number;
  totalUsers: number;
}

export interface UserActivity {
  date: string;
  activeUsers: number;
  loginCount: number;
}

export interface OrderAnalytics {
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  completionRate: number;
  averageOrderValue: number;
  statusDistribution: OrderStatusDistribution[];
  orderTrends: OrderTrend[];
}

export interface OrderStatusDistribution {
  status: number;
  statusName: string;
  count: number;
  percentage: number;
}

export interface OrderTrend {
  date: string;
  orderCount: number;
  totalValue: number;
}

export interface DesignAnalytics {
  totalDesigns: number;
  designsToday: number;
  designsThisWeek: number;
  designsThisMonth: number;
  averageDesignsPerUser: number;
  designTrends: DesignTrend[];
  popularDesigns: PopularDesign[];
}

export interface DesignTrend {
  date: string;
  designCount: number;
}

export interface PopularDesign {
  designId: number;
  designName: string;
  previewUrl: string;
  orderCount: number;
  revenue: number;
}

export interface PaymentAnalytics {
  totalPayOSRevenue: number;
  totalWalletRevenue: number;
  payOSTransactionCount: number;
  walletTransactionCount: number;
  payOSSuccessRate: number;
  walletSuccessRate: number;
  paymentMethodDistribution: PaymentMethodDistribution[];
}

export interface PaymentMethodDistribution {
  paymentMethod: number;
  methodName: string;
  revenue: number;
  transactionCount: number;
  percentage: number;
}

export interface AnalyticsFilter {
  startDate?: string;
  endDate?: string;
  period?: '7days' | '30days' | '90days' | '1year';
}
