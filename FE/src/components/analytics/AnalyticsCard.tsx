'use client';

import React from 'react';

interface AnalyticsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'purple' | 'red' | 'yellow' | 'indigo';
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const colorClasses = {
  blue: {
    bg: 'bg-blue-50',
    icon: 'bg-blue-500',
    text: 'text-blue-600',
    trend: 'text-blue-600'
  },
  green: {
    bg: 'bg-green-50',
    icon: 'bg-green-500',
    text: 'text-green-600',
    trend: 'text-green-600'
  },
  purple: {
    bg: 'bg-purple-50',
    icon: 'bg-purple-500',
    text: 'text-purple-600',
    trend: 'text-purple-600'
  },
  red: {
    bg: 'bg-red-50',
    icon: 'bg-red-500',
    text: 'text-red-600',
    trend: 'text-red-600'
  },
  yellow: {
    bg: 'bg-yellow-50',
    icon: 'bg-yellow-500',
    text: 'text-yellow-600',
    trend: 'text-yellow-600'
  },
  indigo: {
    bg: 'bg-indigo-50',
    icon: 'bg-indigo-500',
    text: 'text-indigo-600',
    trend: 'text-indigo-600'
  }
};

export default function AnalyticsCard({ 
  title, 
  value, 
  subtitle, 
  icon, 
  color, 
  trend 
}: AnalyticsCardProps) {
  const colors = colorClasses[color];

  const formatValue = (val: string | number) => {
    if (typeof val === 'number') {
      if (val >= 1000000) {
        return `${(val / 1000000).toFixed(1)}M`;
      } else if (val >= 1000) {
        return `${(val / 1000).toFixed(1)}K`;
      }
      return val.toLocaleString();
    }
    return val;
  };

  return (
    <div className={`${colors.bg} rounded-lg p-6 border border-gray-200 hover:shadow-md transition-shadow`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mb-1">
            {formatValue(value)}
          </p>
          {subtitle && (
            <p className="text-sm text-gray-500">{subtitle}</p>
          )}
          {trend && (
            <div className="flex items-center mt-2">
              <svg 
                className={`w-4 h-4 mr-1 ${trend.isPositive ? 'text-green-500' : 'text-red-500'}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                {trend.isPositive ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17l9.2-9.2M17 17V7H7" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 7l-9.2 9.2M7 7v10h10" />
                )}
              </svg>
              <span className={`text-sm font-medium ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {Math.abs(trend.value).toFixed(1)}%
              </span>
              <span className="text-sm text-gray-500 ml-1">
                {trend.isPositive ? 'tăng' : 'giảm'}
              </span>
            </div>
          )}
        </div>
        <div className={`${colors.icon} p-3 rounded-lg`}>
          <div className="w-6 h-6 text-white">
            {icon}
          </div>
        </div>
      </div>
    </div>
  );
}
