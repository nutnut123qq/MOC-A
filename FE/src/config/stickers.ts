// Sticker configuration based on actual folder structure
export interface StickerItem {
  id: string;
  name: string;
  url: string;
  category: string;
  tags?: string[];
}

export interface StickerCategory {
  id: string;
  name: string;
  icon: string; // SVG path string
  stickers: StickerItem[];
}

// Helper function to create sticker items
const createSticker = (category: string, filename: string): StickerItem => {
  const name = filename
    .replace('.png', '')
    .replace(/\s*\(\d+\)/, '') // Remove (1), (2), etc.
    .replace(/[-_]/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return {
    id: `${category}-${filename.replace('.png', '').replace(/\s/g, '-')}`,
    name,
    url: `/assets/stickers/${category}/${filename}`,
    category,
  };
};

// All stickers based on your folder structure
export const allStickers: StickerItem[] = [
  // Animal category
  createSticker('animal', 'carrot.png'),
  createSticker('animal', 'cat (1).png'),
  createSticker('animal', 'cat (2).png'),
  createSticker('animal', 'cat (3).png'),
  createSticker('animal', 'cat.png'),
  createSticker('animal', 'corgi (1).png'),
  createSticker('animal', 'corgi (2).png'),
  createSticker('animal', 'corgi (3).png'),
  createSticker('animal', 'corgi (4).png'),
  createSticker('animal', 'corgi.png'),
  createSticker('animal', 'cute.png'),
  createSticker('animal', 'dog.png'),
  createSticker('animal', 'frog (1).png'),
  createSticker('animal', 'frog (2).png'),
  createSticker('animal', 'frog (3).png'),
  createSticker('animal', 'frog (4).png'),
  createSticker('animal', 'frog (5).png'),
  createSticker('animal', 'frog.png'),
  createSticker('animal', 'happy.png'),
  createSticker('animal', 'rabbit.png'),
  createSticker('animal', 'writing.png'),

  // Food category
  createSticker('food', 'burger (1).png'),
  createSticker('food', 'burger.png'),
  createSticker('food', 'cherry.png'),
  createSticker('food', 'chicken.png'),
  createSticker('food', 'coffee-cup.png'),
  createSticker('food', 'cupcake.png'),
  createSticker('food', 'donut.png'),
  createSticker('food', 'drink.png'),
  createSticker('food', 'french-fries.png'),
  createSticker('food', 'fried-egg.png'),
  createSticker('food', 'juice.png'),
  createSticker('food', 'mug.png'),
  createSticker('food', 'noodles.png'),
  createSticker('food', 'pancake.png'),
  createSticker('food', 'pop-corn.png'),
  createSticker('food', 'sandwich.png'),
  createSticker('food', 'strawberry.png'),
  createSticker('food', 'turkey.png'),
  createSticker('food', 'vegetable.png'),
  createSticker('food', 'yummy.png'),

  // Love category
  createSticker('love', 'bubble-speech (1).png'),
  createSticker('love', 'bubble-speech.png'),
  createSticker('love', 'cat.png'),
  createSticker('love', 'chat-bubble.png'),
  createSticker('love', 'cloud.png'),
  createSticker('love', 'couple (1).png'),
  createSticker('love', 'couple.png'),
  createSticker('love', 'flower.png'),
  createSticker('love', 'for-you.png'),
  createSticker('love', 'heart (1).png'),
  createSticker('love', 'heart.png'),
  createSticker('love', 'i-love-you.png'),
  createSticker('love', 'love (1).png'),
  createSticker('love', 'love-badge.png'),
  createSticker('love', 'love-is-in-the-air.png'),
  createSticker('love', 'love-of-my-life.png'),
  createSticker('love', 'love-potion.png'),
  createSticker('love', 'love-you (1).png'),
  createSticker('love', 'love-you (2).png'),
  createSticker('love', 'love-you (3).png'),
  createSticker('love', 'love-you.png'),
  createSticker('love', 'love.png'),
  createSticker('love', 'sunshine.png'),
  createSticker('love', 'wedding.png'),

  // Nature category
  createSticker('nature', 'bee.png'),
  createSticker('nature', 'boot.png'),
  createSticker('nature', 'buterflies (1).png'),
  createSticker('nature', 'buterflies.png'),
  createSticker('nature', 'cactus.png'),
  createSticker('nature', 'chamomile.png'),
  createSticker('nature', 'eco-friendly.png'),
  createSticker('nature', 'flower (1).png'),
  createSticker('nature', 'flower.png'),
  createSticker('nature', 'flowers.png'),
  createSticker('nature', 'leaf (1).png'),
  createSticker('nature', 'leaf.png'),
  createSticker('nature', 'monstera.png'),
  createSticker('nature', 'mushroom.png'),
  createSticker('nature', 'planet-earth.png'),
  createSticker('nature', 'plant-pot.png'),
  createSticker('nature', 'plant.png'),
  createSticker('nature', 'rainbow.png'),
  createSticker('nature', 'shovel.png'),
  createSticker('nature', 'snowflakes.png'),
  createSticker('nature', 'summer.png'),
  createSticker('nature', 'tulips.png'),
  createSticker('nature', 'vase.png'),
  createSticker('nature', 'wreath.png'),
];

// Sticker categories with Vietnamese names and SVG icon paths
export const stickerCategories: StickerCategory[] = [
  {
    id: 'animal',
    name: 'Động Vật',
    icon: 'M14.828 14.828a4 4 0 01-5.656 0M9 10h1.01M15 10h1.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    stickers: allStickers.filter(sticker => sticker.category === 'animal')
  },
  {
    id: 'food',
    name: 'Đồ Ăn',
    icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
    stickers: allStickers.filter(sticker => sticker.category === 'food')
  },
  {
    id: 'love',
    name: 'Tình Yêu',
    icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
    stickers: allStickers.filter(sticker => sticker.category === 'love')
  },
  {
    id: 'nature',
    name: 'Thiên Nhiên',
    icon: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z',
    stickers: allStickers.filter(sticker => sticker.category === 'nature')
  }
];

// Helper functions
export const getStickersByCategory = (categoryId: string): StickerItem[] => {
  return allStickers.filter(sticker => sticker.category === categoryId);
};

export const searchStickers = (query: string): StickerItem[] => {
  const lowercaseQuery = query.toLowerCase();
  return allStickers.filter(sticker => 
    sticker.name.toLowerCase().includes(lowercaseQuery) ||
    sticker.category.toLowerCase().includes(lowercaseQuery)
  );
};
