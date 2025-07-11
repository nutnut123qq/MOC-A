'use client';

import { OrderStatus } from '@/types/order';

interface OrderProgressIndicatorProps {
  currentStatus: OrderStatus;
  size?: 'sm' | 'md' | 'lg';
}

export default function OrderProgressIndicator({ 
  currentStatus, 
  size = 'md' 
}: OrderProgressIndicatorProps) {
  const steps = [
    {
      status: OrderStatus.Pending,
      label: 'Chờ duyệt',
      icon: '⏳',
      description: 'Đơn hàng đang chờ xác nhận'
    },
    {
      status: OrderStatus.Confirmed,
      label: 'Đã duyệt',
      icon: '✅',
      description: 'Đơn hàng đã được xác nhận'
    },
    {
      status: OrderStatus.Printing,
      label: 'Đang in',
      icon: '🖨️',
      description: 'Đang thực hiện in decal'
    },
    {
      status: OrderStatus.Shipping,
      label: 'Đang giao',
      icon: '🚚',
      description: 'Đang giao hàng'
    },
    {
      status: OrderStatus.Completed,
      label: 'Hoàn thành',
      icon: '🎉',
      description: 'Đã giao hàng thành công'
    }
  ];

  // Handle cancelled status
  if (currentStatus === OrderStatus.Cancelled) {
    return (
      <div className="flex items-center justify-center p-4 bg-red-50 rounded-lg border border-red-200">
        <div className="text-center">
          <div className="text-2xl mb-2">❌</div>
          <div className="text-sm font-medium text-red-800">Đơn hàng đã bị hủy</div>
          <div className="text-xs text-red-600 mt-1">Đơn hàng không thể tiếp tục xử lý</div>
        </div>
      </div>
    );
  }

  const currentStepIndex = steps.findIndex(step => step.status === currentStatus);
  
  const sizeClasses = {
    sm: {
      container: 'py-3',
      step: 'w-8 h-8 text-xs',
      line: 'h-0.5',
      label: 'text-xs',
      description: 'text-xs'
    },
    md: {
      container: 'py-4',
      step: 'w-10 h-10 text-sm',
      line: 'h-1',
      label: 'text-sm',
      description: 'text-xs'
    },
    lg: {
      container: 'py-6',
      step: 'w-12 h-12 text-base',
      line: 'h-1',
      label: 'text-base',
      description: 'text-sm'
    }
  };

  const classes = sizeClasses[size];

  return (
    <div className={`bg-white rounded-lg border border-gray-200 ${classes.container} px-6`}>
      <div className="flex items-center justify-between relative">
        {steps.map((step, index) => {
          const isCompleted = index < currentStepIndex;
          const isCurrent = index === currentStepIndex;
          const isPending = index > currentStepIndex;

          return (
            <div key={step.status} className="flex flex-col items-center relative z-10">
              {/* Step Circle */}
              <div className={`
                ${classes.step} rounded-full flex items-center justify-center font-medium transition-all duration-300
                ${isCompleted 
                  ? 'bg-green-500 text-white shadow-lg' 
                  : isCurrent 
                    ? 'bg-blue-500 text-white shadow-lg animate-pulse' 
                    : 'bg-gray-200 text-gray-500'
                }
              `}>
                {isCompleted ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <span>{step.icon}</span>
                )}
              </div>

              {/* Step Label */}
              <div className={`mt-2 text-center ${classes.label} font-medium ${
                isCompleted || isCurrent ? 'text-gray-900' : 'text-gray-500'
              }`}>
                {step.label}
              </div>

              {/* Step Description */}
              <div className={`mt-1 text-center ${classes.description} text-gray-500 max-w-20`}>
                {step.description}
              </div>

              {/* Current Status Indicator */}
              {isCurrent && (
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping"></div>
                </div>
              )}
            </div>
          );
        })}

        {/* Progress Line */}
        <div className="absolute top-5 left-0 right-0 flex items-center z-0">
          <div className={`flex-1 ${classes.line} bg-gray-200 rounded-full overflow-hidden`}>
            <div 
              className={`h-full bg-gradient-to-r from-green-400 to-blue-500 transition-all duration-1000 ease-out`}
              style={{ 
                width: `${currentStepIndex > 0 ? (currentStepIndex / (steps.length - 1)) * 100 : 0}%` 
              }}
            ></div>
          </div>
        </div>
      </div>

      {/* Current Status Info */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-center">
          <div className="text-2xl mr-3">
            {steps[currentStepIndex]?.icon}
          </div>
          <div>
            <div className="font-medium text-blue-900">
              {steps[currentStepIndex]?.label}
            </div>
            <div className="text-sm text-blue-700 mt-1">
              {steps[currentStepIndex]?.description}
            </div>
          </div>
        </div>

        {/* Estimated Time */}
        <div className="mt-3 text-xs text-blue-600">
          {currentStatus === OrderStatus.Pending && "Thời gian xử lý: 1-2 giờ"}
          {currentStatus === OrderStatus.Confirmed && "Thời gian in: 2-4 giờ"}
          {currentStatus === OrderStatus.Printing && "Thời gian in: 1-2 giờ"}
          {currentStatus === OrderStatus.Shipping && "Thời gian giao hàng: 1-3 ngày"}
          {currentStatus === OrderStatus.Completed && "Đơn hàng đã hoàn thành!"}
        </div>
      </div>
    </div>
  );
}
