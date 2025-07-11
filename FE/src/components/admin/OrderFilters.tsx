'use client';

import { OrderStatus } from '@/types/order';

interface StatusCounts {
  all: number;
  pending: number;
  confirmed: number;
  printing: number;
  shipping: number;
  completed: number;
}

interface OrderFiltersProps {
  statusFilter: OrderStatus | 'all';
  onStatusFilterChange: (status: OrderStatus | 'all') => void;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  dateFilter: 'today' | 'week' | 'month' | 'all';
  onDateFilterChange: (filter: 'today' | 'week' | 'month' | 'all') => void;
  statusCounts: StatusCounts;
  onRefresh: () => void;
}

export default function OrderFilters({
  statusFilter,
  onStatusFilterChange,
  searchQuery,
  onSearchQueryChange,
  dateFilter,
  onDateFilterChange,
  statusCounts,
  onRefresh
}: OrderFiltersProps) {
  const statusOptions = [
    { value: 'all', label: 'Tất cả', count: statusCounts.all, color: 'bg-gray-100 text-gray-800' },
    { value: OrderStatus.Pending, label: 'Chờ duyệt', count: statusCounts.pending, color: 'bg-yellow-100 text-yellow-800' },
    { value: OrderStatus.Confirmed, label: 'Đã duyệt', count: statusCounts.confirmed, color: 'bg-blue-100 text-blue-800' },
    { value: OrderStatus.Printing, label: 'Đang in', count: statusCounts.printing, color: 'bg-purple-100 text-purple-800' },
    { value: OrderStatus.Shipping, label: 'Đang giao', count: statusCounts.shipping, color: 'bg-orange-100 text-orange-800' },
    { value: OrderStatus.Completed, label: 'Hoàn thành', count: statusCounts.completed, color: 'bg-green-100 text-green-800' },
  ];

  const dateOptions = [
    { value: 'all', label: 'Tất cả thời gian' },
    { value: 'today', label: 'Hôm nay' },
    { value: 'week', label: '7 ngày qua' },
    { value: 'month', label: '30 ngày qua' },
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Bộ lọc đơn hàng</h2>
        <button
          onClick={onRefresh}
          className="flex items-center px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Làm mới
        </button>
      </div>

      {/* Status Filter Tabs */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Trạng thái đơn hàng
        </label>
        <div className="flex flex-wrap gap-2">
          {statusOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => onStatusFilterChange(option.value as OrderStatus | 'all')}
              className={`
                flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                ${statusFilter === option.value
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }
              `}
            >
              <span>{option.label}</span>
              <span className={`
                ml-2 px-2 py-0.5 rounded-full text-xs font-medium
                ${statusFilter === option.value
                  ? 'bg-white bg-opacity-20 text-white'
                  : option.color
                }
              `}>
                {option.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Search and Date Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Search */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tìm kiếm
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Mã đơn hàng, tên khách hàng, email..."
              value={searchQuery}
              onChange={(e) => onSearchQueryChange(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchQueryChange('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <svg className="h-4 w-4 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Date Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Thời gian
          </label>
          <select
            value={dateFilter}
            onChange={(e) => onDateFilterChange(e.target.value as 'today' | 'week' | 'month' | 'all')}
            className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
          >
            {dateOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Active Filters Summary */}
      {(statusFilter !== 'all' || searchQuery || dateFilter !== 'all') && (
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span>Bộ lọc đang áp dụng:</span>
            <div className="flex items-center space-x-2">
              {statusFilter !== 'all' && (
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-xs">
                  {statusOptions.find(opt => opt.value === statusFilter)?.label}
                </span>
              )}
              {searchQuery && (
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-md text-xs">
                  Tìm kiếm: "{searchQuery}"
                </span>
              )}
              {dateFilter !== 'all' && (
                <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-md text-xs">
                  {dateOptions.find(opt => opt.value === dateFilter)?.label}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={() => {
              onStatusFilterChange('all');
              onSearchQueryChange('');
              onDateFilterChange('all');
            }}
            className="text-sm text-red-600 hover:text-red-800 font-medium"
          >
            Xóa tất cả bộ lọc
          </button>
        </div>
      )}
    </div>
  );
}
