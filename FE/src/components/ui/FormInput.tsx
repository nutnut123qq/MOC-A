'use client';

import React, { forwardRef } from 'react';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, helperText, leftIcon, rightIcon, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        
        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <div className="text-gray-400">
                {leftIcon}
              </div>
            </div>
          )}
          
          <input
            ref={ref}
            className={`
              w-full px-4 py-3 border border-gray-300 rounded-lg
              disabled:bg-gray-50 disabled:text-gray-500
              transition-colors duration-200
              ${leftIcon ? 'pl-10' : ''}
              ${rightIcon ? 'pr-10' : ''}
              ${error ? 'border-red-500' : ''}
              ${className}
            `}
            style={{
              ...(error ? {} : {
                '--tw-ring-color': '#E21C34',
                '--tw-border-opacity': '1'
              })
            }}
            onFocus={(e) => {
              if (!error) {
                e.target.style.borderColor = '#E21C34';
                e.target.style.boxShadow = '0 0 0 2px rgba(226, 28, 52, 0.2)';
              }
              if (props.onFocus) props.onFocus(e);
            }}
            onBlur={(e) => {
              if (!error) {
                e.target.style.borderColor = '#d1d5db';
                e.target.style.boxShadow = 'none';
              }
              if (props.onBlur) props.onBlur(e);
            }}
            {...props}
          />
          
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <div className="text-gray-400">
                {rightIcon}
              </div>
            </div>
          )}
        </div>
        
        {error && (
          <p className="mt-2 text-sm text-red-600">
            {error}
          </p>
        )}
        
        {helperText && !error && (
          <p className="mt-2 text-sm text-gray-500">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

FormInput.displayName = 'FormInput';

export default FormInput;
