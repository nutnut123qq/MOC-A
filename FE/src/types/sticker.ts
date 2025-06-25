export interface Sticker {
  id: number;
  name: string;
  imageUrl: string;
  category: string;
  tags: string;
  isPremium: boolean;
  premiumPrice: number;
  isActive: boolean;
  usageCount: number;
  createdAt: string;
}

export interface StickerCategory {
  category: string;
  count: number;
  stickers: Sticker[];
}

export interface Font {
  id: number;
  name: string;
  fontFamily: string;
  fontFileUrl: string;
  category: string;
  isPremium: boolean;
  premiumPrice: number;
  isActive: boolean;
  usageCount: number;
  previewText: string;
  createdAt: string;
}
