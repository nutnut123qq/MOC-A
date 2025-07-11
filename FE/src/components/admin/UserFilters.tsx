'use client';

interface StatusCounts {
  all: number;
  admin: number;
  user: number;
}

interface UserFiltersProps {
  roleFilter: 'all' | 'user' | 'admin';
  onRoleFilterChange: (role: 'all' | 'user' | 'admin') => void;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  dateFilter: 'today' | 'week' | 'month' | 'all';
  onDateFilterChange: (filter: 'today' | 'week' | 'month' | 'all') => void;
  statusCounts: StatusCounts;
  onRefresh: () => void;
}

export default function UserFilters({
  roleFilter,
  onRoleFilterChange,
  searchQuery,
  onSearchQueryChange,
  dateFilter,
  onDateFilterChange,
  statusCounts,
  onRefresh
}: UserFiltersProps) {
  const roleOptions = [
    { value: 'all', label: 'Tất cả vai trò', count: statusCounts.all, color: 'bg-gray-100 text-gray-800' },
    { value: 'user', label: 'Người dùng', count: statusCounts.user, color: 'bg-blue-100 text-blue-800' },
    { value: 'admin', label: 'Quản trị viên', count: statusCounts.admin, color: 'bg-purple-100 text-purple-800' },
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
        <h2 className="text-lg font-semibold text-gray-900">Bộ lọc người dùng</h2>
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

      {/* Role Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Vai trò
        </label>
        <div className="flex flex-wrap gap-2">
          {roleOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => onRoleFilterChange(option.value as 'all' | 'user' | 'admin')}
              className={`
                flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                ${roleFilter === option.value
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }
              `}
            >
              <span>{option.label}</span>
              <span className={`
                ml-2 px-2 py-0.5 rounded-full text-xs font-medium
                ${roleFilter === option.value
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
              placeholder="Tên, email, số điện thoại..."
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
            Thời gian đăng ký
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
      {(roleFilter !== 'all' || searchQuery || dateFilter !== 'all') && (
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span>Bộ lọc đang áp dụng:</span>
            <div className="flex items-center space-x-2">
              {roleFilter !== 'all' && (
                <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-md text-xs">
                  {roleOptions.find(opt => opt.value === roleFilter)?.label}
                </span>
              )}
              {searchQuery && (
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-md text-xs">
                  Tìm kiếm: "{searchQuery}"
                </span>
              )}
              {dateFilter !== 'all' && (
                <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded-md text-xs">
                  {dateOptions.find(opt => opt.value === dateFilter)?.label}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={() => {
              onRoleFilterChange('all');
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
