'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem, AddToCartDto, UpdateCartItemDto } from '@/types/order';
import { useAuth } from './AuthContext';
import { apiClient } from '@/lib/api';

interface CartContextType {
  cartItems: CartItem[];
  cartCount: number;
  cartTotal: number;
  loading: boolean;
  error: string | null;
  addToCart: (item: AddToCartDto) => Promise<void>;
  updateCartItem: (cartItemId: number, update: UpdateCartItemDto) => Promise<void>;
  removeFromCart: (cartItemId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartCount, setCartCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, user } = useAuth();

  // Load cart when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      refreshCart();
    } else {
      // Clear cart when user logs out
      setCartItems([]);
      setCartCount(0);
      setCartTotal(0);
    }
  }, [isAuthenticated, user]);

  const refreshCart = async () => {
    if (!isAuthenticated) return;

    try {
      setLoading(true);
      setError(null);
      
      const [items, count, total] = await Promise.all([
        apiClient.getCart(),
        apiClient.getCartItemCount(),
        apiClient.getCartTotal()
      ]);

      setCartItems(items);
      setCartCount(count);
      setCartTotal(total);
    } catch (err) {
      console.error('Error loading cart:', err);
      setError('Không thể tải giỏ hàng');
      
      // Fallback to localStorage for offline support
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        try {
          const localCart = JSON.parse(savedCart);
          setCartItems(localCart);
          setCartCount(localCart.reduce((sum: number, item: CartItem) => sum + item.quantity, 0));
          setCartTotal(localCart.reduce((sum: number, item: CartItem) => sum + item.totalPrice, 0));
        } catch (parseError) {
          console.error('Error parsing local cart:', parseError);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (item: AddToCartDto) => {
    if (!isAuthenticated) {
      setError('Vui lòng đăng nhập để thêm vào giỏ hàng');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      await apiClient.addToCart(item);
      await refreshCart();
      
      // Also save to localStorage as backup
      localStorage.setItem('cart', JSON.stringify(cartItems));
    } catch (err: any) {
      console.error('Error adding to cart:', err);
      setError(err.message || 'Không thể thêm vào giỏ hàng');
    } finally {
      setLoading(false);
    }
  };

  const updateCartItem = async (cartItemId: number, update: UpdateCartItemDto) => {
    if (!isAuthenticated) return;

    try {
      setLoading(true);
      setError(null);
      
      await apiClient.updateCartItem(cartItemId, update);
      await refreshCart();

      localStorage.setItem('cart', JSON.stringify(cartItems));
    } catch (err: any) {
      console.error('Error updating cart item:', err);
      setError(err.message || 'Không thể cập nhật giỏ hàng');
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (cartItemId: number) => {
    if (!isAuthenticated) return;

    try {
      setLoading(true);
      setError(null);

      await apiClient.removeFromCart(cartItemId);
      await refreshCart();

      localStorage.setItem('cart', JSON.stringify(cartItems));
    } catch (err: any) {
      console.error('Error removing from cart:', err);
      setError(err.message || 'Không thể xóa khỏi giỏ hàng');
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    if (!isAuthenticated) {
      console.log('❌ Cannot clear cart: User not authenticated');
      return;
    }

    try {
      console.log('🔄 Starting cart clear process...');
      setLoading(true);
      setError(null);

      console.log('📡 Calling API to clear cart...');
      await apiClient.clearCart();

      console.log('🧹 Clearing local cart state...');
      setCartItems([]);
      setCartCount(0);
      setCartTotal(0);

      localStorage.removeItem('cart');
      console.log('✅ Cart cleared successfully');
    } catch (err: any) {
      console.error('❌ Error clearing cart:', err);
      setError(err.message || 'Không thể xóa giỏ hàng');
    } finally {
      setLoading(false);
    }
  };

  const value: CartContextType = {
    cartItems,
    cartCount,
    cartTotal,
    loading,
    error,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    refreshCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
