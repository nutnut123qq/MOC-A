'use client';

import React from 'react';
import { RevenueByDate } from '@/types/analytics';

interface RevenueChartProps {
  data: RevenueByDate[];
  title?: string;
  height?: number;
}

export default function RevenueChart({ data, title = "Doanh thu theo ngày", height = 300 }: RevenueChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
        <div className="flex items-center justify-center h-64 text-gray-500">
          Không có dữ liệu để hiển thị
        </div>
      </div>
    );
  }

  const maxRevenue = Math.max(...data.map(d => d.revenue));
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
            Doanh thu
          </div>
        </div>
      </div>

      <div className="relative" style={{ height: `${height}px` }}>
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500 pr-2">
          <span>{formatCurrency(maxRevenue)}</span>
          <span>{formatCurrency(maxRevenue * 0.75)}</span>
          <span>{formatCurrency(maxRevenue * 0.5)}</span>
          <span>{formatCurrency(maxRevenue * 0.25)}</span>
          <span>0</span>
        </div>

        {/* Chart area */}
        <div className="ml-16 h-full relative">
          {/* Grid lines */}
          <div className="absolute inset-0">
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => (
              <div
                key={index}
                className="absolute w-full border-t border-gray-100"
                style={{ top: `${ratio * 100}%` }}
              />
            ))}
          </div>

          {/* Bars */}
          <div className="flex items-end justify-between h-full pt-2 pb-8">
            {data.map((item, index) => {
              const barHeight = (item.revenue / maxRevenue) * (height - 40);
              return (
                <div key={index} className="flex flex-col items-center group relative">
                  {/* Tooltip */}
                  <div className="absolute bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10">
                    <div>{formatDate(item.date)}</div>
                    <div>{formatCurrency(item.revenue)}</div>
                    <div>{item.orderCount} đơn hàng</div>
                  </div>
                  
                  {/* Bar */}
                  <div
                    className="bg-blue-500 hover:bg-blue-600 transition-colors rounded-t w-8 cursor-pointer"
                    style={{ height: `${barHeight}px` }}
                  />
                  
                  {/* X-axis label */}
                  <span className="text-xs text-gray-500 mt-2 transform -rotate-45 origin-top-left">
                    {formatDate(item.date)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
