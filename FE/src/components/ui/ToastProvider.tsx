'use client';

import { useEffect, useState } from 'react';

// Simple toast provider without external dependencies
export default function ToastProvider() {
  const [toasts, setToasts] = useState<Array<{
    id: string;
    message: string;
    type: 'success' | 'error' | 'info';
  }>>([]);

  useEffect(() => {
    // Listen for custom toast events
    const handleToast = (event: CustomEvent) => {
      const { message, type = 'info' } = event.detail;
      const id = Date.now().toString();
      
      setToasts(prev => [...prev, { id, message, type }]);
      
      // Auto remove after 4 seconds
      setTimeout(() => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
      }, 4000);
    };

    window.addEventListener('show-toast', handleToast as EventListener);
    
    return () => {
      window.removeEventListener('show-toast', handleToast as EventListener);
    };
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`
            px-4 py-3 rounded-lg shadow-lg text-white text-sm font-medium
            transform transition-all duration-300 ease-in-out
            ${toast.type === 'success' ? 'bg-green-600' : 
              toast.type === 'error' ? 'bg-red-600' : 'bg-blue-600'}
          `}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
}

// Helper function to show toasts
export const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('show-toast', {
      detail: { message, type }
    }));
  }
};
