'use client';

import React, { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

/**
 * Error boundary specifically for cart design preview components
 */
export class CartPreviewErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Cart preview error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
          <span className="text-2xl">👕</span>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * HOC wrapper for easier usage
 */
export function withCartPreviewErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode
) {
  return function WrappedComponent(props: P) {
    return (
      <CartPreviewErrorBoundary fallback={fallback}>
        <Component {...props} />
      </CartPreviewErrorBoundary>
    );
  };
}
