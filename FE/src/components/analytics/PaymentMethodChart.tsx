'use client';

import React from 'react';
import { PaymentMethodDistribution } from '@/types/analytics';

interface PaymentMethodChartProps {
  data: PaymentMethodDistribution[];
  title?: string;
}

const paymentMethodColors = {
  1: { bg: 'bg-blue-500', text: 'text-blue-600', name: 'PayOS' },
  2: { bg: 'bg-green-500', text: 'text-green-600', name: 'Ví điện tử' },
};

export default function PaymentMethodChart({ data, title = "Phân bố phương thức thanh toán" }: PaymentMethodChartProps) {
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0);
  const totalTransactions = data.reduce((sum, item) => sum + item.transactionCount, 0);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">{title}</h3>

      {/* Donut Chart */}
      <div className="flex items-center justify-center mb-6">
        <div className="relative w-48 h-48">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {data.map((item, index) => {
              const methodColor = paymentMethodColors[item.paymentMethod as keyof typeof paymentMethodColors] || paymentMethodColors[1];
              const percentage = item.percentage;
              const circumference = 2 * Math.PI * 30; // radius = 30
              const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;
              const strokeDashoffset = index === 0 ? 0 : -((data[0]?.percentage || 0) / 100) * circumference;

              return (
                <circle
                  key={index}
                  cx="50"
                  cy="50"
                  r="30"
                  fill="transparent"
                  stroke={methodColor.bg.replace('bg-', '').replace('-500', '')}
                  strokeWidth="8"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  className={methodColor.bg.replace('bg-', 'stroke-')}
                />
              );
            })}
          </svg>
          
          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-gray-900">
              {data.length}
            </span>
            <span className="text-sm text-gray-600">Phương thức</span>
          </div>
        </div>
      </div>

      {/* Legend and Details */}
      <div className="space-y-4">
        {data.map((item, index) => {
          const methodColor = paymentMethodColors[item.paymentMethod as keyof typeof paymentMethodColors] || paymentMethodColors[1];

          return (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <div className={`w-4 h-4 ${methodColor.bg} rounded-full mr-3`}></div>
                <div>
                  <div className="font-medium text-gray-900">{methodColor.name}</div>
                  <div className="text-sm text-gray-600">
                    {item.transactionCount} giao dịch
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-gray-900">
                  {formatCurrency(item.revenue)}
                </div>
                <div className={`text-sm font-medium ${methodColor.text}`}>
                  {item.percentage.toFixed(1)}%
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="mt-6 pt-4 border-t border-gray-200 space-y-2">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">Tổng doanh thu:</span>
          <span className="font-semibold text-gray-900">{formatCurrency(totalRevenue)}</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">Tổng giao dịch:</span>
          <span className="font-semibold text-gray-900">{totalTransactions.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}
