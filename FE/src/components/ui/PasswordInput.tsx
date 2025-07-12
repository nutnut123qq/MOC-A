'use client';

import React, { useState, forwardRef } from 'react';
import FormInput from './FormInput';

interface PasswordInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
  helperText?: string;
  showStrengthIndicator?: boolean;
}

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ label, error, helperText, showStrengthIndicator = false, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const [strength, setStrength] = useState(0);

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };

    const calculatePasswordStrength = (password: string): number => {
      let score = 0;
      if (password.length >= 8) score++;
      if (/[a-z]/.test(password)) score++;
      if (/[A-Z]/.test(password)) score++;
      if (/\d/.test(password)) score++;
      if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) score++;
      return score;
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const password = e.target.value;
      if (showStrengthIndicator) {
        setStrength(calculatePasswordStrength(password));
      }
      if (props.onChange) {
        props.onChange(e);
      }
    };

    const getStrengthColor = (score: number): string => {
      if (score <= 1) return 'bg-red-500';
      if (score <= 2) return 'bg-red-400';
      if (score <= 3) return 'bg-yellow-500';
      if (score <= 4) return 'bg-green-400';
      return 'bg-green-500';
    };

    const getStrengthText = (score: number): string => {
      if (score <= 1) return 'Rất yếu';
      if (score <= 2) return 'Yếu';
      if (score <= 3) return 'Trung bình';
      if (score <= 4) return 'Mạnh';
      return 'Rất mạnh';
    };

    return (
      <div className="w-full">
        <FormInput
          ref={ref}
          type={showPassword ? 'text' : 'password'}
          label={label}
          error={error}
          helperText={!showStrengthIndicator ? helperText : undefined}
          rightIcon={
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              {showPassword ? (
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          }
          {...props}
          onChange={handlePasswordChange}
        />

        {showStrengthIndicator && props.value && (
          <div className="mt-2">
            <div className="flex items-center space-x-2">
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor(strength)}`}
                  style={{ width: `${(strength / 5) * 100}%` }}
                />
              </div>
              <span className="text-sm text-gray-600 min-w-[80px]">
                {getStrengthText(strength)}
              </span>
            </div>
            {helperText && (
              <p className="mt-1 text-sm text-gray-500">
                {helperText}
              </p>
            )}
          </div>
        )}
      </div>
    );
  }
);

PasswordInput.displayName = 'PasswordInput';

export default PasswordInput;
