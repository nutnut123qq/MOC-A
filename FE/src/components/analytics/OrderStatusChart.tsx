'use client';

import React from 'react';
import { OrderStatusDistribution } from '@/types/analytics';

interface OrderStatusChartProps {
  data: OrderStatusDistribution[];
  title?: string;
}

const statusColors = {
  1: { bg: 'bg-yellow-500', text: 'text-yellow-600', name: 'Chờ xử lý' },
  2: { bg: 'bg-blue-500', text: 'text-blue-600', name: 'Đã xác nhận' },
  3: { bg: 'bg-purple-500', text: 'text-purple-600', name: 'Đang in' },
  4: { bg: 'bg-indigo-500', text: 'text-indigo-600', name: 'Đang giao' },
  5: { bg: 'bg-green-500', text: 'text-green-600', name: 'Hoàn thành' },
  6: { bg: 'bg-red-500', text: 'text-red-600', name: 'Đã hủy' },
};

export default function OrderStatusChart({ data, title = "Phân bố trạng thái đơn hàng" }: OrderStatusChartProps) {
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

  const total = data.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">{title}</h3>

      <div className="space-y-4">
        {data.map((item, index) => {
          const statusColor = statusColors[item.status as keyof typeof statusColors] || statusColors[1];
          const percentage = total > 0 ? (item.count / total) * 100 : 0;

          return (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center flex-1">
                <div className={`w-4 h-4 ${statusColor.bg} rounded-full mr-3`}></div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-900">
                      {statusColor.name}
                    </span>
                    <span className="text-sm text-gray-600">
                      {item.count} đơn
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`${statusColor.bg} h-2 rounded-full transition-all duration-300`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
                <div className="ml-4 text-right">
                  <span className={`text-sm font-semibold ${statusColor.text}`}>
                    {percentage.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">Tổng đơn hàng:</span>
          <span className="font-semibold text-gray-900">{total.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}
