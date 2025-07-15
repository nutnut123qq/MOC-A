export enum ProductType {
  Shirt = 1,
  Hat = 2,
  CanvasBag = 3
}

export enum ProductMode {
  COMBO = 'combo',      // Áo + Decal (149k)
  DECAL_ONLY = 'decal'  // Decal riêng (theo size)
}

export interface Product {
  id: number;
  name: string;
  type: ProductType;
  typeName: string;
  description: string;
  mockupImageUrl: string;
  basePrice: number;
  isActive: boolean;
  createdAt: string;
  mockups: Mockup[];
}

export interface Mockup {
  id: number;
  productId: number;
  name: string;
  imageUrl: string;
  overlayCoordinates: string;
  maxWidth: number;
  maxHeight: number;
  isDefault: boolean;
  sortOrder: number;
}

export interface MockupCoordinates {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface PriceCalculation {
  productId: number;
  width: number;
  height: number;
  price: number;
}
