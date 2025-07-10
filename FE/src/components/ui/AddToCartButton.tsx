'use client';

import { useState, useEffect } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { AddToCartDto } from '@/types/order';

interface AddToCartButtonProps {
  designId: number;
  productId: number;
  sizeWidth: number;
  sizeHeight: number;
  disabled?: boolean;
  className?: string;
}

export default function AddToCartButton({
  designId,
  productId,
  sizeWidth,
  sizeHeight,
  disabled = false,
  className = ''
}: AddToCartButtonProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [isInCart, setIsInCart] = useState(false);
  const { addToCart, error, cartItems } = useCart();
  const { isAuthenticated } = useAuth();

  // Check if this design is already in cart
  useEffect(() => {
    if (cartItems && designId) {
      const isDesignInCart = cartItems.some(item => item.designId === designId);
      setIsInCart(isDesignInCart);
    }
  }, [cartItems, designId]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      alert('Vui lòng đăng nhập để thêm vào giỏ hàng');
      return;
    }

    if (!designId) {
      alert('Vui lòng lưu thiết kế trước khi thêm vào giỏ hàng');
      return;
    }

    try {
      setIsAdding(true);

      const addToCartData: AddToCartDto = {
        designId,
        productId,
        sizeWidth,
        sizeHeight,
        quantity: 1,
        specialInstructions: ''
      };

      await addToCart(addToCartData);
      setIsInCart(true);

    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Có lỗi xảy ra khi thêm vào giỏ hàng: ' + (error as Error).message);
    } finally {
      setIsAdding(false);
    }
  };

  // If already in cart, show green button
  if (isInCart) {
    return (
      <button
        className={`px-6 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors ${className}`}
        disabled
      >
        <span className="flex items-center space-x-2">
          <span>✅</span>
          <span>Đã thêm vào giỏ hàng</span>
        </span>
      </button>
    );
  }

  return (
    <button
      onClick={handleAddToCart}
      disabled={disabled || isAdding}
      className={`px-6 py-3 bg-amber-600 text-white rounded-xl font-medium hover:bg-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {isAdding ? (
        <span className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          <span>Đang thêm...</span>
        </span>
      ) : (
        <span className="flex items-center space-x-2">
          <span>🛒</span>
          <span>Thêm vào giỏ hàng</span>
        </span>
      )}
    </button>
  );
}
