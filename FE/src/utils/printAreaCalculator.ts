import { Rectangle } from '@/types/tshirt-design';

// Print area bounds cho từng size áo
// Dựa trên kích thước thực tế của áo để tạo trải nghiệm trực quan
export const PRINT_AREA_BOUNDS_BY_SIZE = {
  // Size S - Nhỏ nhất
  S: {
    front: { x: 135, y: 165, width: 120, height: 150 },
    back: { x: 136, y: 145, width: 118, height: 148 }
  },
  // Size M - Trung bình (baseline)
  M: {
    front: { x: 128, y: 155, width: 138, height: 171 },
    back: { x: 129, y: 135, width: 131, height: 165 }
  },
  // Size L - Lớn hơn
  L: {
    front: { x: 120, y: 145, width: 155, height: 190 },
    back: { x: 121, y: 125, width: 148, height: 185 }
  },
  // Size XL - Rất lớn
  XL: {
    front: { x: 112, y: 135, width: 170, height: 210 },
    back: { x: 113, y: 115, width: 163, height: 205 }
  },
  // Size XXL - Cực lớn
  XXL: {
    front: { x: 105, y: 125, width: 185, height: 230 },
    back: { x: 106, y: 105, width: 178, height: 225 }
  }
};

// Map để handle các variant của size names
const SIZE_ALIASES: Record<string, keyof typeof PRINT_AREA_BOUNDS_BY_SIZE> = {
  'S': 'S',
  'M': 'M',
  'L': 'L',
  'XL': 'XL',
  'XXL': 'XXL',
  // Lowercase variants
  's': 'S',
  'm': 'M',
  'l': 'L',
  'xl': 'XL',
  'xxl': 'XXL',
  // Other variants
  'small': 'S',
  'medium': 'M',
  'large': 'L',
  'extra-large': 'XL',
  'extra-extra-large': 'XXL'
};

/**
 * Lấy print area bounds dựa trên size áo và view (front/back)
 */
export function getPrintAreaBounds(size: string, view: 'front' | 'back'): Rectangle {
  // Sử dụng SIZE_ALIASES để map size name
  const mappedSize = SIZE_ALIASES[size] || SIZE_ALIASES[size.toUpperCase()] || 'M';



  // Lấy size data
  const sizeData = PRINT_AREA_BOUNDS_BY_SIZE[mappedSize];

  const result = sizeData[view];
  return result;
}

/**
 * Lấy max dimensions dựa trên print area bounds
 */
export function getMaxDimensions(size: string, view: 'front' | 'back'): { width: number; height: number } {
  const bounds = getPrintAreaBounds(size, view);
  return {
    width: bounds.width,
    height: bounds.height
  };
}

/**
 * Lấy safe area (vùng an toàn) dựa trên print area bounds
 * Safe area nhỏ hơn print area khoảng 5px mỗi bên
 */
export function getSafeArea(size: string, view: 'front' | 'back'): Rectangle {
  const bounds = getPrintAreaBounds(size, view);
  const margin = 5;
  
  return {
    x: bounds.x + margin,
    y: bounds.y + margin,
    width: bounds.width - (margin * 2),
    height: bounds.height - (margin * 2)
  };
}

/**
 * Kiểm tra xem một size có hợp lệ không
 */
export function isValidSize(size: string): boolean {
  const normalizedSize = size.toUpperCase();
  return normalizedSize in PRINT_AREA_BOUNDS_BY_SIZE;
}

/**
 * Lấy danh sách tất cả các size có sẵn
 */
export function getAvailableSizes(): string[] {
  return Object.keys(PRINT_AREA_BOUNDS_BY_SIZE);
}
