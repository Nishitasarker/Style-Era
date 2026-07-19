export interface UserMock {
  _id: string;
  username: string;
  email: string;
  passwordHash: string;
  ageGroup: 'child' | 'young' | 'old';
  stylePreferences: string[];
  createdAt: Date;
}

export interface ItemMock {
  _id: string;
  name: string;
  description: string;
  category: 'child' | 'young' | 'old';
  price: number;
  imageUrl: string;
  tags: string[];
  styleAttributes: {
    color?: string;
    material?: string;
    vibe?: string;
  };
  createdBy?: string;
  createdAt: Date;
}

export const usersMockStore: UserMock[] = [];
export const itemsMockStore: ItemMock[] = [
  // Child Items
  {
    _id: 'seed-child-1',
    name: 'Aqua Twirl Cotton Dress',
    description: 'A vibrant teal cotton dress with smooth micro-prints and a beautiful waist-bow. Highly breathable and perfect for active play.',
    category: 'child',
    price: 28,
    imageUrl: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&q=80&w=600',
    tags: ['cotton', 'casual', 'teal', 'breathable'],
    styleAttributes: { color: 'Teal', material: 'Cotton', vibe: 'Playful Chic' },
    createdAt: new Date(),
  },
  {
    _id: 'seed-child-2',
    name: 'Sunshine Daisy Denim Dungarees',
    description: 'Cute stretch denim dungarees paired with a soft yellow floral t-shirt. Sturdy and adorable.',
    category: 'child',
    price: 34,
    imageUrl: 'https://images.unsplash.com/photo-1519457431-44ccd64a579b?auto=format&fit=crop&q=80&w=600',
    tags: ['denim', 'dungaree', 'yellow', 'casual'],
    styleAttributes: { color: 'Blue & Yellow', material: 'Denim & Cotton', vibe: 'Active Sweet' },
    createdAt: new Date(),
  },
  {
    _id: 'seed-child-3',
    name: 'Pastel Cloud Princess Gown',
    description: 'A dreamlike lilac tutu dress with fluffy tulle layers, glitter accents, and a soft inner satin lining for comfort during parties.',
    category: 'child',
    price: 45,
    imageUrl: 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&q=80&w=600',
    tags: ['tulle', 'party', 'lilac', 'princess'],
    styleAttributes: { color: 'Lilac', material: 'Tulle & Satin', vibe: 'Fairytale Princess' },
    createdAt: new Date(),
  },

  // Young Items
  {
    _id: 'seed-young-1',
    name: 'Emerald Satin Slip Dress',
    description: 'A stunning dark teal cowl-neck satin slip dress that drapes beautifully. It features adjustable spaghetti straps and a side slit for a premium, elegant evening look.',
    category: 'young',
    price: 89,
    imageUrl: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&q=80&w=600',
    tags: ['satin', 'teal', 'evening', 'minimalist'],
    styleAttributes: { color: 'Emerald Teal', material: 'Satin Silk', vibe: 'Elegant Glamour' },
    createdAt: new Date(),
  },
  {
    _id: 'seed-young-2',
    name: 'Cyberpunk Aqua Bomber & Skirt',
    description: 'A futuristic fashion coordinate set featuring a cropped aqua cyan puffer bomber jacket and a high-waisted black utility pleated cargo skirt.',
    category: 'young',
    price: 120,
    imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=600',
    tags: ['bomber', 'cyan', 'cyberpunk', 'streetwear'],
    styleAttributes: { color: 'Aqua Cyan & Black', material: 'Nylon & Canvas', vibe: 'Futuristic Streetwear' },
    createdAt: new Date(),
  },
  {
    _id: 'seed-young-3',
    name: 'Bohemian Breeze Maxi Dress',
    description: 'A flowing cream-colored maxi dress with intricate hand-embroidered turquoise details and a tassel tie waist. Perfect for beach and summer outings.',
    category: 'young',
    price: 75,
    imageUrl: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=600',
    tags: ['boho', 'maxi', 'cream', 'embroidered'],
    styleAttributes: { color: 'Cream & Turquoise', material: 'Linen', vibe: 'Bohemian Chic' },
    createdAt: new Date(),
  },
  {
    _id: 'seed-young-4',
    name: 'Minimalist Ivory Trench Set',
    description: 'A tailored duster trench coat in structured ivory linen, paired with coordinating high-waisted wide-leg trousers for a sharp boss-lady vibe.',
    category: 'young',
    price: 150,
    imageUrl: 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&q=80&w=600',
    tags: ['trench', 'ivory', 'minimalist', 'tailored'],
    styleAttributes: { color: 'Ivory White', material: 'Linen Blend', vibe: 'Minimalist Corporate' },
    createdAt: new Date(),
  },

  // Old (Elderly) Items
  {
    _id: 'seed-old-1',
    name: 'Cobalt Indigo Linen Kaftan',
    description: 'A breathable, highly stylish indigo linen kaftan adorned with silver thread embroidery. Offers unmatched comfort and simple elegance.',
    category: 'old',
    price: 95,
    imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=600',
    tags: ['linen', 'kaftan', 'blue', 'embroidery'],
    styleAttributes: { color: 'Cobalt Blue', material: 'Pure Linen', vibe: 'Comfort Elegance' },
    createdAt: new Date(),
  },
  {
    _id: 'seed-old-2',
    name: 'Classic Cashmere Cardigan Ensemble',
    description: 'A warm and plush dark charcoal grey cashmere cardigan sweater set with fine pearl-embellished buttons, paired with soft wool straight trousers.',
    category: 'old',
    price: 180,
    imageUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=600',
    tags: ['cashmere', 'cardigan', 'charcoal', 'luxury'],
    styleAttributes: { color: 'Charcoal Grey', material: 'Cashmere Wool', vibe: 'Timeless Luxury' },
    createdAt: new Date(),
  },
  {
    _id: 'seed-old-3',
    name: 'Teal Raw Silk Kimono Coat',
    description: 'A luxurious structured throw-on kimono jacket in deep royal teal. Handcrafted from textured raw silk, it brings refinement to any simple ensemble.',
    category: 'old',
    price: 135,
    imageUrl: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&q=80&w=600',
    tags: ['silk', 'kimono', 'teal', 'luxurious'],
    styleAttributes: { color: 'Teal Cyan', material: 'Raw Silk', vibe: 'Sophisticated Statement' },
    createdAt: new Date(),
  },
  {
    _id: 'seed-old-4',
    name: 'Sage Grace Pleated Coordinate Set',
    description: 'A sophisticated daily coordinates set featuring a micro-pleated tunic top and coordinating loose wide-leg trousers in a calming sage green hue.',
    category: 'old',
    price: 110,
    imageUrl: 'https://images.unsplash.com/photo-1551854838-212c50b4c184?auto=format&fit=crop&q=80&w=600',
    tags: ['pleated', 'sage-green', 'coordinates', 'graceful'],
    styleAttributes: { color: 'Sage Green', material: 'Polyester Silk', vibe: 'Graceful Simplicity' },
    createdAt: new Date(),
  }
];
