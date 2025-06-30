'use client';

import React, { useState, useEffect } from 'react';
import { storageManager } from '@/utils/storageManager';

export default function StorageDebug() {
  const [stats, setStats] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const updateStats = () => {
      setStats(storageManager.getStorageStats());
    };

    updateStats();
    const interval = setInterval(updateStats, 2000); // Update every 2 seconds

    return () => clearInterval(interval);
  }, []);

  if (!stats) return null;

  const { usage, sessionCount, isNearLimit } = stats;

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className={`fixed bottom-4 right-4 z-50 p-3 rounded-full shadow-lg transition-colors ${
          isNearLimit 
            ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse' 
            : 'bg-blue-500 hover:bg-blue-600 text-white'
        }`}
        title="Storage Debug Info"
      >
        💾
      </button>

      {/* Debug Panel */}
      {isVisible && (
        <div className="fixed bottom-20 right-4 z-50 bg-white border border-gray-200 rounded-lg shadow-xl p-4 w-80">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900">Storage Debug</h3>
            <button
              onClick={() => setIsVisible(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          {/* Usage Stats */}
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm">
                <span>Storage Used:</span>
                <span className={usage.percentage > 80 ? 'text-red-600 font-semibold' : 'text-gray-600'}>
                  {usage.percentage.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                <div
                  className={`h-2 rounded-full transition-all ${
                    usage.percentage > 90 ? 'bg-red-500' :
                    usage.percentage > 80 ? 'bg-yellow-500' :
                    'bg-green-500'
                  }`}
                  style={{ width: `${Math.min(usage.percentage, 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>{(usage.used / 1024 / 1024).toFixed(2)}MB used</span>
                <span>{(usage.available / 1024 / 1024).toFixed(2)}MB free</span>
              </div>
            </div>

            <div className="text-sm">
              <span className="text-gray-600">Design Sessions: </span>
              <span className="font-semibold">{sessionCount}</span>
            </div>

            {isNearLimit && (
              <div className="bg-yellow-50 border border-yellow-200 rounded p-2">
                <p className="text-yellow-800 text-xs">
                  ⚠️ Storage is nearly full! Old sessions will be automatically cleaned.
                </p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="mt-4 space-y-2">
            <button
              onClick={() => {
                storageManager.cleanOldSessions(1);
                setStats(storageManager.getStorageStats());
              }}
              className="w-full px-3 py-2 text-sm bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors"
            >
              Clean Old Sessions
            </button>
            
            <button
              onClick={() => {
                if (confirm('Are you sure? This will delete all saved designs.')) {
                  storageManager.clearAll();
                  setStats(storageManager.getStorageStats());
                }
              }}
              className="w-full px-3 py-2 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            >
              Clear All Data
            </button>
          </div>

          {/* Technical Details */}
          <details className="mt-3">
            <summary className="text-xs text-gray-500 cursor-pointer">Technical Details</summary>
            <div className="mt-2 text-xs text-gray-600 space-y-1">
              <div>Max Size: {(stats.maxSize / 1024 / 1024).toFixed(1)}MB</div>
              <div>Used: {usage.used.toLocaleString()} bytes</div>
              <div>Available: {usage.available.toLocaleString()} bytes</div>
              <div>Sessions: {sessionCount}</div>
            </div>
          </details>
        </div>
      )}
    </>
  );
}

// Hook to show storage warnings
export function useStorageWarning() {
  useEffect(() => {
    const checkStorage = () => {
      const stats = storageManager.getStorageStats();
      
      if (stats.usage.percentage > 90) {
        console.warn('🚨 Storage is critically full!', stats);
      } else if (stats.usage.percentage > 80) {
        console.warn('⚠️ Storage is getting full', stats);
      }
    };

    checkStorage();
    const interval = setInterval(checkStorage, 10000); // Check every 10 seconds

    return () => clearInterval(interval);
  }, []);
}
