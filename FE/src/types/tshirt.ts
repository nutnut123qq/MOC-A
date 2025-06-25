export interface TShirt {
  id: number;
  name: string;
  description: string;
  style: TShirtStyle;
  brand: string;
  basePrice: number;
  variants: TShirtVariant[];
  printAreas: PrintArea[];
  mockupTemplates: MockupTemplate[];
  specifications: TShirtSpecifications;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface TShirtVariant {
  id: string;
  color: string;
  colorName: string;
  colorHex: string;
  sizes: TShirtSize[];
  mockupUrls: {
    front: string;
    back: string;
    side?: string;
  };
  available: boolean;
  stock?: number;
}

export interface TShirtSize {
  size: string;
  name: string;
  available: boolean;
  price?: number;
  measurements?: SizeMeasurements;
}

export interface SizeMeasurements {
  chest: number; // in cm
  length: number; // in cm
  sleeve?: number; // in cm
}

export enum TShirtStyle {
  BASIC_TEE = 'basic_tee',
  PREMIUM_TEE = 'premium_tee',
  TANK_TOP = 'tank_top',
  LONG_SLEEVE = 'long_sleeve',
  HOODIE = 'hoodie',
  SWEATSHIRT = 'sweatshirt'
}

export interface PrintArea {
  id: string;
  name: 'front' | 'back';
  displayName: string;
  bounds: Rectangle;
  maxDimensions: Dimensions;
  guidelines: DesignGuidelines;
  printMethods: PrintMethod[];
}

export interface Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Dimensions {
  width: number;
  height: number;
}

export interface DesignGuidelines {
  safeArea: Rectangle;
  bleedArea?: Rectangle;
  recommendedDPI: number;
  maxFileSize: number; // in MB
  allowedFormats: string[];
  colorModes: string[]; // ['RGB', 'CMYK']
}

export enum PrintMethod {
  DTG = 'dtg', // Direct to Garment
  VINYL = 'vinyl', // Heat Transfer Vinyl
  SUBLIMATION = 'sublimation',
  SCREEN_PRINT = 'screen_print'
}

export interface MockupTemplate {
  id: string;
  name: string;
  printArea: 'front' | 'back';
  color: string;
  imageUrl: string;
  overlayCoordinates: OverlayCoordinates;
  perspective: 'flat' | 'folded' | 'hanging' | 'model';
}

export interface OverlayCoordinates {
  topLeft: Position2D;
  topRight: Position2D;
  bottomLeft: Position2D;
  bottomRight: Position2D;
  transform?: {
    perspective?: number;
    rotation?: number;
    scale?: number;
  };
}

export interface Position2D {
  x: number;
  y: number;
}

export interface TShirtSpecifications {
  material: string;
  weight: number; // in grams
  fit: 'slim' | 'regular' | 'relaxed' | 'oversized';
  neckline: 'crew' | 'v-neck' | 'scoop' | 'henley';
  sleeves: 'short' | 'long' | 'sleeveless' | 'three-quarter';
  care: string[];
  features: string[];
}

// API DTOs
export interface CreateTShirtDto {
  name: string;
  description: string;
  style: TShirtStyle;
  brand: string;
  basePrice: number;
  specifications: TShirtSpecifications;
}

export interface UpdateTShirtDto {
  name?: string;
  description?: string;
  basePrice?: number;
  specifications?: TShirtSpecifications;
  isActive?: boolean;
}

export interface TShirtListItem {
  id: number;
  name: string;
  style: TShirtStyle;
  brand: string;
  basePrice: number;
  previewImage: string;
  availableColors: number;
  availableSizes: number;
  isActive: boolean;
}

export interface TShirtFilter {
  style?: TShirtStyle[];
  brand?: string[];
  priceRange?: {
    min: number;
    max: number;
  };
  colors?: string[];
  sizes?: string[];
  isActive?: boolean;
}

export interface TShirtSearchParams {
  query?: string;
  filter?: TShirtFilter;
  sortBy?: 'name' | 'price' | 'popularity' | 'newest';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

// Common T-shirt data
export const COMMON_TSHIRT_SIZES = [
  { size: 'XS', name: 'Extra Small' },
  { size: 'S', name: 'Small' },
  { size: 'M', name: 'Medium' },
  { size: 'L', name: 'Large' },
  { size: 'XL', name: 'Extra Large' },
  { size: 'XXL', name: '2X Large' },
  { size: 'XXXL', name: '3X Large' }
];

export const COMMON_TSHIRT_COLORS = [
  { color: 'white', name: 'White', hex: '#FFFFFF' },
  { color: 'black', name: 'Black', hex: '#000000' },
  { color: 'gray', name: 'Gray', hex: '#808080' },
  { color: 'navy', name: 'Navy', hex: '#000080' },
  { color: 'red', name: 'Red', hex: '#FF0000' },
  { color: 'blue', name: 'Blue', hex: '#0000FF' },
  { color: 'green', name: 'Green', hex: '#008000' },
  { color: 'yellow', name: 'Yellow', hex: '#FFFF00' },
  { color: 'pink', name: 'Pink', hex: '#FFC0CB' },
  { color: 'purple', name: 'Purple', hex: '#800080' }
];
