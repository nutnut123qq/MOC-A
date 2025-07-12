'use client';

import React, { useState } from 'react';
import { AnalyticsFilter } from '@/types/analytics';

interface DateRangePickerProps {
  filter: AnalyticsFilter;
  onFilterChange: (filter: AnalyticsFilter) => void;
}

const periodOptions = [
  { value: '7days', label: '7 ngày qua' },
  { value: '30days', label: '30 ngày qua' },
  { value: '90days', label: '90 ngày qua' },
  { value: '1year', label: '1 năm qua' },
];

export default function DateRangePicker({ filter, onFilterChange }: DateRangePickerProps) {
  const [isCustomRange, setIsCustomRange] = useState(false);

  const handlePeriodChange = (period: string) => {
    if (period === 'custom') {
      setIsCustomRange(true);
      onFilterChange({ ...filter, period: undefined });
    } else {
      setIsCustomRange(false);
      onFilterChange({ 
        ...filter, 
        period: period as AnalyticsFilter['period'],
        startDate: undefined,
        endDate: undefined
      });
    }
  };

  const handleDateChange = (field: 'startDate' | 'endDate', value: string) => {
    onFilterChange({
      ...filter,
      [field]: value,
      period: undefined
    });
  };

  const formatDateForInput = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const today = new Date();
  const maxDate = formatDateForInput(today);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-2">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="text-sm font-medium text-gray-700">Khoảng thời gian:</span>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          {/* Period Selection */}
          <div className="flex flex-wrap gap-2">
            {periodOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handlePeriodChange(option.value)}
                className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                  filter.period === option.value && !isCustomRange
                    ? 'bg-blue-100 text-blue-700 border border-blue-300'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
                }`}
              >
                {option.label}
              </button>
            ))}
            <button
              onClick={() => handlePeriodChange('custom')}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                isCustomRange
                  ? 'bg-blue-100 text-blue-700 border border-blue-300'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
              }`}
            >
              Tùy chọn
            </button>
          </div>

          {/* Custom Date Range */}
          {isCustomRange && (
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-2">
                <label className="text-sm text-gray-600">Từ:</label>
                <input
                  type="date"
                  value={filter.startDate || ''}
                  onChange={(e) => handleDateChange('startDate', e.target.value)}
                  max={maxDate}
                  className="px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex items-center space-x-2">
                <label className="text-sm text-gray-600">Đến:</label>
                <input
                  type="date"
                  value={filter.endDate || ''}
                  onChange={(e) => handleDateChange('endDate', e.target.value)}
                  max={maxDate}
                  min={filter.startDate}
                  className="px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Current Selection Display */}
      <div className="mt-3 pt-3 border-t border-gray-100">
        <div className="text-xs text-gray-500">
          {isCustomRange && filter.startDate && filter.endDate ? (
            <>Từ {new Date(filter.startDate).toLocaleDateString('vi-VN')} đến {new Date(filter.endDate).toLocaleDateString('vi-VN')}</>
          ) : (
            <>Hiển thị dữ liệu {periodOptions.find(p => p.value === filter.period)?.label || '30 ngày qua'}</>
          )}
        </div>
      </div>
    </div>
  );
}
