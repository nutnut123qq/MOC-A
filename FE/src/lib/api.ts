import { User, CreateUserDto, UpdateUserDto } from '@/types/user';
import { Design, DesignListItem, CreateDesignDto, UpdateDesignDto } from '@/types/design';
import { Product, PriceCalculation } from '@/types/product';
import { Order, CreateOrderDto, OrderStatus, OrderStatusHistory } from '@/types/order';
import { Sticker, StickerCategory, Font } from '@/types/sticker';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5168';

class ApiClient {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    // Get token from localStorage using correct key
    const token = localStorage.getItem('accessToken');

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options?.headers,
      },
      ...options,
    };

    const response = await fetch(url, config);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Handle empty responses (like 204 No Content)
    const contentType = response.headers.get('content-type');
    if (response.status === 204 || !contentType?.includes('application/json')) {
      return null;
    }

    return response.json();
  }

  // User endpoints
  async getUsers(): Promise<User[]> {
    return this.request<User[]>('/api/users');
  }

  async getUserById(id: number): Promise<User> {
    return this.request<User>(`/api/users/${id}`);
  }

  async getActiveUsers(): Promise<User[]> {
    return this.request<User[]>('/api/users/active');
  }

  async createUser(userData: CreateUserDto): Promise<User> {
    return this.request<User>('/api/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async updateUser(id: number, userData: UpdateUserDto): Promise<User> {
    return this.request<User>(`/api/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async deleteUser(id: number): Promise<void> {
    await this.request<void>(`/api/users/${id}`, {
      method: 'DELETE',
    });
  }

  // Design endpoints
  async getUserDesigns(userId: number): Promise<DesignListItem[]> {
    return this.request<DesignListItem[]>(`/api/designs/user/${userId}`);
  }

  async getPublicDesigns(): Promise<DesignListItem[]> {
    return this.request<DesignListItem[]>('/api/designs/public');
  }

  async getPopularDesigns(count: number = 10): Promise<DesignListItem[]> {
    return this.request<DesignListItem[]>(`/api/designs/popular?count=${count}`);
  }

  async getDesignById(id: number): Promise<Design> {
    return this.request<Design>(`/api/designs/${id}`);
  }

  async createDesign(userId: number, designData: CreateDesignDto): Promise<Design> {
    return this.request<Design>('/api/designs', {
      method: 'POST',
      body: JSON.stringify({ userId, design: designData }),
    });
  }

  async updateDesign(id: number, userId: number, designData: UpdateDesignDto): Promise<Design> {
    return this.request<Design>(`/api/designs/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ userId, design: designData }),
    });
  }

  async deleteDesign(id: number, userId: number): Promise<void> {
    await this.request<void>(`/api/designs/${id}?userId=${userId}`, {
      method: 'DELETE',
    });
  }

  async generatePreview(canvasData: string): Promise<{ previewUrl: string }> {
    return this.request<{ previewUrl: string }>('/api/designs/preview', {
      method: 'POST',
      body: JSON.stringify({ canvasData }),
    });
  }

  // Product endpoints
  async getProducts(): Promise<Product[]> {
    return this.request<Product[]>('/api/products');
  }

  async getProductById(id: number): Promise<Product> {
    return this.request<Product>(`/api/products/${id}`);
  }

  async calculatePrice(productId: number, width: number, height: number): Promise<PriceCalculation> {
    return this.request<PriceCalculation>('/api/products/calculate-price', {
      method: 'POST',
      body: JSON.stringify({ productId, width, height }),
    });
  }

  // Order endpoints
  async createOrder(userId: number, orderData: CreateOrderDto): Promise<Order> {
    return this.request<Order>('/api/orders', {
      method: 'POST',
      body: JSON.stringify({ userId, ...orderData }),
    });
  }

  async getUserOrders(userId: number): Promise<Order[]> {
    return this.request<Order[]>(`/api/orders/user/${userId}`);
  }

  async getOrderById(id: number): Promise<Order> {
    return this.request<Order>(`/api/orders/${id}`);
  }

  // Cart endpoints
  async getCart(): Promise<CartItem[]> {
    return this.request<CartItem[]>('/api/cart');
  }

  async addToCart(addToCartDto: AddToCartDto): Promise<CartItem> {
    return this.request<CartItem>('/api/cart/add', {
      method: 'POST',
      body: JSON.stringify(addToCartDto),
    });
  }

  async updateCartItem(cartItemId: number, updateCartItemDto: UpdateCartItemDto): Promise<CartItem> {
    return this.request<CartItem>(`/api/cart/${cartItemId}`, {
      method: 'PUT',
      body: JSON.stringify(updateCartItemDto),
    });
  }

  async removeFromCart(cartItemId: number): Promise<void> {
    return this.request<void>(`/api/cart/${cartItemId}`, {
      method: 'DELETE',
    });
  }

  async clearCart(): Promise<void> {
    return this.request<void>('/api/cart/clear', {
      method: 'DELETE',
    });
  }

  async getCartItemCount(): Promise<number> {
    return this.request<number>('/api/cart/count');
  }

  async getCartTotal(): Promise<number> {
    return this.request<number>('/api/cart/total');
  }

  // Order endpoints (updated)
  async getMyOrders(): Promise<Order[]> {
    return this.request<Order[]>('/api/orders/my');
  }

  async createOrderFromCart(orderData: CreateOrderDto): Promise<Order> {
    return this.request<Order>('/api/orders/from-cart', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  async cancelOrder(orderId: number): Promise<void> {
    return this.request<void>(`/api/orders/${orderId}/cancel`, {
      method: 'POST',
    });
  }

  async updateOrderStatus(orderId: number, status: OrderStatus): Promise<Order> {
    return this.request<Order>(`/api/orders/${orderId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  async getOrderStatusHistory(orderId: number): Promise<OrderStatusHistory[]> {
    return this.request<OrderStatusHistory[]>(`/api/orders/${orderId}/status-history`);
  }

  // Sticker endpoints
  async getStickers(): Promise<Sticker[]> {
    return this.request<Sticker[]>('/api/stickers');
  }

  async getStickersByCategory(category: string): Promise<Sticker[]> {
    return this.request<Sticker[]>(`/api/stickers/category/${category}`);
  }

  async searchStickers(searchTerm: string): Promise<Sticker[]> {
    return this.request<Sticker[]>(`/api/stickers/search?q=${encodeURIComponent(searchTerm)}`);
  }

  async getStickerCategories(): Promise<StickerCategory[]> {
    return this.request<StickerCategory[]>('/api/stickers/categories');
  }

  // Font endpoints
  async getFonts(): Promise<Font[]> {
    return this.request<Font[]>('/api/fonts');
  }

  async getFontsByCategory(category: string): Promise<Font[]> {
    return this.request<Font[]>(`/api/fonts/category/${category}`);
  }
}

export const apiClient = new ApiClient();
export const api = apiClient;
