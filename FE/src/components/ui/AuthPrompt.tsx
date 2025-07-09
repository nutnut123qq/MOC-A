'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface AuthPromptProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  returnUrl: string;
}

export default function AuthPrompt({ isOpen, onClose, title, message, returnUrl }: AuthPromptProps) {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    }
  }, [isOpen]);

  const handleLogin = () => {
    router.push(`/auth/login?returnUrl=${encodeURIComponent(returnUrl)}`);
  };

  const handleRegister = () => {
    router.push(`/auth/register?returnUrl=${encodeURIComponent(returnUrl)}`);
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300); // Wait for animation to complete
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black transition-opacity duration-300 ${
          isVisible ? 'opacity-50' : 'opacity-0'
        }`}
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div 
          className={`relative bg-white rounded-lg shadow-xl max-w-md w-full transform transition-all duration-300 ${
            isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
          }`}
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                {title}
              </h3>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="flex-shrink-0">
                <svg className="w-8 h-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed">
                {message}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="px-6 py-4 border-t border-gray-200 flex space-x-3">
            <button
              onClick={handleLogin}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium text-sm"
            >
              Đăng Nhập
            </button>
            <button
              onClick={handleRegister}
              className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors font-medium text-sm"
            >
              Đăng Ký
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
