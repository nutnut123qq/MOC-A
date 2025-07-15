import { TShirtSizeInfo, TShirtColorInfo, TShirtSizeType, TShirtColorType } from '@/types/tshirt-design';
import { ProductMode } from '@/types/product';

// Available T-shirt sizes
export const TSHIRT_SIZES: TShirtSizeInfo[] = [
  {
    id: 's',
    name: 'small',
    displayName: 'Small (S)',
  },
  {
    id: 'm',
    name: 'medium',
    displayName: 'Medium (M)',
  },
  {
    id: 'l',
    name: 'large',
    displayName: 'Large (L)',
  },
  {
    id: 'xl',
    name: 'extra-large',
    displayName: 'Extra Large (XL)',
  },
  {
    id: 'xxl',
    name: 'double-extra-large',
    displayName: 'Double XL (XXL)',
  },
];

// Available T-shirt colors
export const TSHIRT_COLORS: TShirtColorInfo[] = [
  {
    id: 'white',
    name: 'white',
    displayName: 'Trắng',
    hexCode: '#FFFFFF',
  },
  {
    id: 'black',
    name: 'black',
    displayName: 'Đen',
    hexCode: '#000000',
  },
  {
    id: 'beige',
    name: 'beige',
    displayName: 'Be',
    hexCode: '#F5F5DC',
  },
  {
    id: 'navi',
    name: 'navi',
    displayName: 'Xanh Navy',
    hexCode: '#000080',
  },
];

// Helper function to get T-shirt image path
export const getTShirtImagePath = (
  size: TShirtSizeType,
  color: TShirtColorType,
  view: 'front' | 'back'
): string => {
  const viewCode = view === 'front' ? 'f' : 'b';
  return `/images/áo vector/${size}/${size} ${viewCode} ${color}.png`;
};

// Helper function to get size info by id
export const getSizeInfo = (sizeId: TShirtSizeType): TShirtSizeInfo | undefined => {
  return TSHIRT_SIZES.find(size => size.id === sizeId);
};

// Helper function to get color info by id
export const getColorInfo = (colorId: TShirtColorType): TShirtColorInfo | undefined => {
  return TSHIRT_COLORS.find(color => color.id === colorId);
};

// Default values
export const DEFAULT_TSHIRT_SIZE: TShirtSizeType = 'l';
export const DEFAULT_TSHIRT_COLOR: TShirtColorType = 'white';
export const DEFAULT_PRODUCT_MODE: ProductMode = ProductMode.COMBO;
export const COMBO_PRICE = 149000; // 149k VND

// Pricing functions
export const calculateDecalPrice = (sizeCm: number): number => {
  // Formula: (size_cm + 5) * 1000 VND
  return (sizeCm + 5) * 1000;
};

export const getProductPrice = (productMode: ProductMode, decalSizeCm?: number): number => {
  if (productMode === ProductMode.COMBO) {
    return COMBO_PRICE;
  } else {
    // Decal only - calculate based on size
    const size = decalSizeCm || 20; // Default 20cm if not specified
    return calculateDecalPrice(size);
  }
};
