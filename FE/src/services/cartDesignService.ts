import { CartItem } from '@/types/order';
import { TShirtDesignSession } from '@/types/tshirt-design';
import { apiClient } from '@/lib/api';
import { designAPI } from '@/lib/design-api';
import { normalizeDesignSession, validateDesignSession, debugDesignSession } from '@/utils/designSessionNormalizer';

/**
 * Service để handle việc fetch design session data cho cart items
 */
export class CartDesignService {
  private static designSessionCache = new Map<number, TShirtDesignSession>();
  private static cacheExpiry = new Map<number, number>();
  private static readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  /**
   * Fetch design session data cho một cart item
   */
  static async getDesignSessionForCartItem(cartItem: CartItem): Promise<TShirtDesignSession | null> {
    try {
      // Check cache first
      const cached = this.getCachedDesignSession(cartItem.designId);
      if (cached) {
        console.log(`🎯 Using cached design session for cart item ${cartItem.id}:`, cached);
        return cached;
      }

      console.log(`🔍 Fetching design session for cart item ${cartItem.id}, designId: ${cartItem.designId}`);

      // Fetch from API
      const design = await designAPI.getDesign(cartItem.designId);
      console.log(`📦 Received design data for ${cartItem.designId}:`, design);

      if (design && design.designSession) {
        // Debug raw session data
        debugDesignSession(design.designSession, `Cart Item ${cartItem.id}`);

        // Normalize design session data
        const normalizedSession = normalizeDesignSession(design.designSession, cartItem.productId);

        // Validate normalized session
        if (validateDesignSession(normalizedSession)) {
          // Cache the result
          this.setCachedDesignSession(cartItem.designId, normalizedSession);
          return normalizedSession;
        }
      }
      }

      return null;
    } catch (error) {
      console.error(`❌ Error fetching design session for cart item ${cartItem.id}:`, error);
      return null;
    }
  }

  /**
   * Fetch design sessions cho multiple cart items
   */
  static async getDesignSessionsForCartItems(cartItems: CartItem[]): Promise<Map<number, TShirtDesignSession>> {
    const results = new Map<number, TShirtDesignSession>();

    // Process in batches to avoid overwhelming the API
    const batchSize = 3; // Reduced batch size for better performance
    for (let i = 0; i < cartItems.length; i += batchSize) {
      const batch = cartItems.slice(i, i + batchSize);

      const batchPromises = batch.map(async (item) => {
        try {
          const session = await this.getDesignSessionForCartItem(item);
          if (session) {
            results.set(item.designId, session);
          }
        } catch (error) {
          console.warn(`Failed to load design session for item ${item.id}:`, error);
          // Continue with other items even if one fails
        }
      });

      await Promise.allSettled(batchPromises); // Use allSettled to handle individual failures

      // Add small delay between batches to avoid rate limiting
      if (i + batchSize < cartItems.length) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    return results;
  }

  /**
   * Get cached design session
   */
  private static getCachedDesignSession(designId: number): TShirtDesignSession | null {
    const now = Date.now();
    const expiry = this.cacheExpiry.get(designId);
    
    if (expiry && now < expiry) {
      return this.designSessionCache.get(designId) || null;
    }

    // Remove expired cache
    this.designSessionCache.delete(designId);
    this.cacheExpiry.delete(designId);
    return null;
  }

  /**
   * Set cached design session
   */
  private static setCachedDesignSession(designId: number, session: TShirtDesignSession): void {
    const expiry = Date.now() + this.CACHE_DURATION;
    this.designSessionCache.set(designId, session);
    this.cacheExpiry.set(designId, expiry);
  }

  /**
   * Clear cache for specific design
   */
  static clearDesignSessionCache(designId?: number): void {
    if (designId) {
      this.designSessionCache.delete(designId);
      this.cacheExpiry.delete(designId);
    } else {
      // Clear all cache
      this.designSessionCache.clear();
      this.cacheExpiry.clear();
    }
  }

  /**
   * Preload design sessions for cart items (background loading)
   */
  static async preloadDesignSessions(cartItems: CartItem[]): Promise<void> {
    // Don't await this - let it run in background
    this.getDesignSessionsForCartItems(cartItems).catch(error => {
      console.warn('Background preload of design sessions failed:', error);
    });
  }
}

/**
 * Extended CartItem với design session data
 */
export interface CartItemWithDesign extends CartItem {
  designSession?: TShirtDesignSession;
  designSessionLoading?: boolean;
  designSessionError?: string;
}

/**
 * Hook để sử dụng cart items với design session data
 */
export function useCartItemsWithDesign(cartItems: CartItem[]) {
  const [itemsWithDesign, setItemsWithDesign] = React.useState<CartItemWithDesign[]>([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (cartItems.length === 0) {
      setItemsWithDesign([]);
      return;
    }

    // Initialize items with loading state
    const initialItems: CartItemWithDesign[] = cartItems.map(item => ({
      ...item,
      designSessionLoading: true
    }));
    setItemsWithDesign(initialItems);

    // Load design sessions
    const loadDesignSessions = async () => {
      setLoading(true);
      try {
        const designSessions = await CartDesignService.getDesignSessionsForCartItems(cartItems);
        
        const updatedItems: CartItemWithDesign[] = cartItems.map(item => ({
          ...item,
          designSession: designSessions.get(item.designId),
          designSessionLoading: false,
          designSessionError: designSessions.has(item.designId) ? undefined : 'Failed to load design'
        }));

        setItemsWithDesign(updatedItems);
      } catch (error) {
        console.error('Error loading design sessions:', error);
        
        // Set error state for all items
        const errorItems: CartItemWithDesign[] = cartItems.map(item => ({
          ...item,
          designSessionLoading: false,
          designSessionError: 'Failed to load design'
        }));
        setItemsWithDesign(errorItems);
      } finally {
        setLoading(false);
      }
    };

    loadDesignSessions();
  }, [cartItems]);

  return {
    itemsWithDesign,
    loading
  };
}

// Import React for the hook
import React from 'react';
