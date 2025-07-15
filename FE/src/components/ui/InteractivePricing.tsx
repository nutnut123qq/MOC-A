'use client';

import { useState, useRef, useCallback } from 'react';

export default function InteractivePricing() {
  const [decalSize, setDecalSize] = useState(20); // Mặc định 20cm
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Tính giá theo công thức: size + 5 (nghìn đồng)
  const calculatePrice = (size: number) => {
    return (size + 5) * 1000;
  };

  // Format giá tiền
  const formatPrice = (price: number) => {
    return price.toLocaleString('vi-VN') + '₫';
  };

  // Tăng size (tối đa 28cm)
  const increaseSize = useCallback(() => {
    setDecalSize(prev => prev < 28 ? prev + 1 : prev);
  }, []);

  // Giảm size (tối thiểu 5cm)
  const decreaseSize = useCallback(() => {
    setDecalSize(prev => prev > 5 ? prev - 1 : prev);
  }, []);

  // Clear intervals
  const clearIntervals = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  // Start repeating action
  const startRepeating = useCallback((action: () => void) => {
    clearIntervals();

    // First action immediately
    action();

    // Start repeating after delay
    timeoutRef.current = setTimeout(() => {
      intervalRef.current = setInterval(action, 100); // Repeat every 100ms
    }, 500); // Start repeating after 500ms hold
  }, [clearIntervals]);

  // Stop repeating
  const stopRepeating = useCallback(() => {
    clearIntervals();
  }, [clearIntervals]);

  // Lấy label mô tả cho size
  const getSizeLabel = (size: number) => {
    if (size >= 5 && size <= 10) return 'Mini cute';
    if (size >= 11 && size <= 15) return 'Vừa xinh';
    if (size >= 16 && size <= 20) return 'Perfect size';
    if (size >= 21 && size <= 25) return 'Lớn đẹp';
    if (size >= 26 && size <= 28) return 'Siêu to';
    return 'Perfect size';
  };

  const currentPrice = calculatePrice(decalSize);
  const sizeLabel = getSizeLabel(decalSize);

  return (
    <div className="flex justify-center px-4">
      <div className="relative">
        {/* Main pricing card */}
        <div className="rounded-3xl p-6 md:p-8 text-center text-white transform scale-105 shadow-xl relative min-w-[280px] max-w-[320px] mx-auto" style={{background: `linear-gradient(to bottom right, #dc2626, #E21C34)`}}>

          {/* Size display với controls */}
          <div className="flex items-center justify-center space-x-3 md:space-x-4 mb-6">
            {/* Nút giảm */}
            <button
              onMouseDown={() => startRepeating(decreaseSize)}
              onMouseUp={stopRepeating}
              onMouseLeave={stopRepeating}
              onTouchStart={() => startRepeating(decreaseSize)}
              onTouchEnd={stopRepeating}
              disabled={decalSize <= 5}
              className="w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 disabled:bg-white/10 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center group hover:scale-110 active:scale-95 select-none"
            >
              <svg className="w-6 h-6 text-white group-disabled:text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Size hiển thị */}
            <div className="text-center min-w-[80px]">
              <div className="text-3xl md:text-4xl font-bold mb-1 transition-all duration-300 transform">
                {decalSize}cm
              </div>
              <div className="text-sm opacity-90">Decal Size</div>
            </div>

            {/* Nút tăng */}
            <button
              onMouseDown={() => startRepeating(increaseSize)}
              onMouseUp={stopRepeating}
              onMouseLeave={stopRepeating}
              onTouchStart={() => startRepeating(increaseSize)}
              onTouchEnd={stopRepeating}
              disabled={decalSize >= 28}
              className="w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 disabled:bg-white/10 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center group hover:scale-110 active:scale-95 select-none"
            >
              <svg className="w-6 h-6 text-white group-disabled:text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Giá hiển thị */}
          <div className="text-4xl md:text-5xl font-bold mb-4 transition-all duration-300 transform">
            {formatPrice(currentPrice)}
          </div>

          {/* Label mô tả */}
          <div className="text-sm bg-white/20 px-4 py-2 rounded-full transition-all duration-300 inline-block">
            {sizeLabel}
          </div>

          {/* Thông tin thêm */}
          <div className="mt-4 text-xs opacity-75">
            Nhấn mũi tên để thay đổi size
          </div>
        </div>

        {/* Range indicator */}
        <div className="mt-6 text-center">
          <div className="text-sm text-gray-600 mb-2">
            Khoảng size: 5cm - 28cm
          </div>
          <div className="w-full max-w-xs mx-auto">
            <div className="relative">
              <div className="h-2 bg-gray-200 rounded-full">
                <div
                  className="h-2 rounded-full transition-all duration-500 ease-out"
                  style={{
                    background: `linear-gradient(to right, #dc2626, #E21C34)`,
                    width: `${((decalSize - 5) / (28 - 5)) * 100}%`
                  }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>5cm</span>
                <span>28cm</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
