import { Product, Category, User, Coupon, Promotion } from './types';

export const SEED_USERS: Omit<User, 'id'>[] & { passwordHash: string }[] = [
  {
    email: 'admin@ecom.com',
    name: 'Aravind Sharma',
    phone: '9876543210',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    emailVerifiedAt: new Date().toISOString(),
    preferences: { marketingEmails: true },
    passwordHash: '$argon2id$v=19$m=65536,t=3,p=4$KnzP4/QCYXUIuCZ/c1s0nA$RjCiWu80ZBU/3qHc+KQaG+D2jikefIhxaiyRhfv2gkY', // hashed 'admin123'
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  } as any,
  {
    email: 'customer@ecom.com',
    name: 'Rahul Varma',
    phone: '9876543211',
    role: 'customer',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    emailVerifiedAt: new Date().toISOString(),
    preferences: { marketingEmails: false },
    passwordHash: '$argon2id$v=19$m=65536,t=3,p=4$F3SCSbc83X1v7/4wx8im7g$olCplMko5hdzyJst6HGwdzHtT2W4ATnmOB/0YdU9N84', // hashed 'customer123'
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  } as any,
];

export const SEED_CATEGORIES: Category[] = [
  {
    id: 'cat_electronics',
    name: 'Electronics',
    slug: 'electronics',
    description: 'Computers, smartphones, and professional gear.',
    image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&q=80&w=600',
    active: true,
    sortOrder: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'cat_audio',
    name: 'Audio & Acoustics',
    slug: 'audio',
    description: 'Studio monitors, noise-cancelling headphones, and audio interfaces.',
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&q=80&w=600',
    parentId: 'cat_electronics',
    active: true,
    sortOrder: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'cat_phones',
    name: 'Smartphones & Tablets',
    slug: 'smartphones',
    description: 'Flagship mobile devices and high-resolution tablet computers.',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=600',
    parentId: 'cat_electronics',
    active: true,
    sortOrder: 3,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'cat_wearables',
    name: 'Wearables',
    slug: 'wearables',
    description: 'Smart watches and fitness trackers.',
    image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&q=80&w=600',
    parentId: 'cat_electronics',
    active: true,
    sortOrder: 4,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'cat_home',
    name: 'Home & Living',
    slug: 'home-living',
    description: 'Minimalist furniture, smart home accessories, and ambient lighting.',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=600',
    active: true,
    sortOrder: 5,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'cat_laptops',
    name: 'Laptops',
    slug: 'laptops',
    description: 'High-performance gaming, coding, and productivity laptops.',
    image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&q=80&w=600',
    parentId: 'cat_electronics',
    active: true,
    sortOrder: 6,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'cat_lifestyle',
    name: 'Lifestyle & Accessories',
    slug: 'lifestyle-accessories',
    description: 'Musical instruments, personal care, lunch boxes, and everyday items.',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=600',
    active: true,
    sortOrder: 7,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'cat_cosmetics',
    name: 'Beauty & Cosmetics',
    slug: 'cosmetics',
    description: 'Premium skincare, makeup, facewash, and grooming products.',
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=600',
    parentId: 'cat_lifestyle',
    active: true,
    sortOrder: 8,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'cat_music',
    name: 'Musical Instruments',
    slug: 'musical-instruments',
    description: 'Acoustic and electric guitars, accessories, and gear.',
    image: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&q=80&w=600',
    parentId: 'cat_lifestyle',
    active: true,
    sortOrder: 9,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'cat_kitchen',
    name: 'Kitchen & Dining',
    slug: 'kitchen-dining',
    description: 'Insulated lunch boxes, glass containers, and kitchen accessories.',
    image: 'https://images.unsplash.com/photo-1544982503-9f984c14501a?auto=format&fit=crop&q=80&w=600',
    parentId: 'cat_lifestyle',
    active: true,
    sortOrder: 10,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'cat_sports_fitness',
    name: 'Sports & Fitness',
    slug: 'sports-fitness',
    description: 'High-quality yoga mats, dumbbells, gym accessories, and sportswear.',
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=600',
    active: true,
    sortOrder: 11,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'cat_automotive',
    name: 'Automotive',
    slug: 'automotive',
    description: 'Car phone holders, seat covers, chargers, and cleaning kits.',
    image: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&q=80&w=600',
    active: true,
    sortOrder: 12,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'cat_travel',
    name: 'Travel & Luggage',
    slug: 'travel-luggage',
    description: 'Travel backpacks, suitcases, neck pillows, and organizers.',
    image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&q=80&w=600',
    active: true,
    sortOrder: 13,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'cat_fashion',
    name: 'Fashion & Wardrobe',
    slug: 'fashion-wardrobe',
    description: 'Trendy women\'s kurtis, sarees, men\'s shirts, sneakers, and handbags.',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=600',
    active: true,
    sortOrder: 14,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'cat_home_decor',
    name: 'Home & Décor',
    slug: 'home-decor',
    description: 'Elegant wall mirrors, clocks, photo frames, and decorative curtains.',
    image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=600',
    active: true,
    sortOrder: 15,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'cat_oral_care',
    name: 'Oral Care',
    slug: 'oral-care',
    description: 'Electric toothbrushes, high-grade mouthwashes, and dental floss.',
    image: 'https://images.unsplash.com/photo-1606811971618-4486d14f3f99?auto=format&fit=crop&q=80&w=600',
    active: true,
    sortOrder: 16,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'cat_home_essentials',
    name: 'Home Essentials',
    slug: 'home-essentials',
    description: 'Cleaning supplies, mops, organizers, and storage boxes.',
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=600',
    active: true,
    sortOrder: 17,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'cat_grocery',
    name: 'Grocery & Daily Needs',
    slug: 'grocery-daily-needs',
    description: 'Daily essentials including basmati rice, dal, tea, coffee, and dry fruits.',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=600',
    active: true,
    sortOrder: 18,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'cat_furniture_bedding',
    name: 'Furniture & Bedding',
    slug: 'furniture-bedding',
    description: 'Comfortable mattresses, study tables, bedsheets, and wardrobes.',
    image: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&q=80&w=600',
    active: true,
    sortOrder: 19,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'cat_kids_baby',
    name: 'Kids & Baby Care',
    slug: 'kids-baby',
    description: 'Soft baby clothes, diapers, educational toys, and safety accessories.',
    image: 'https://images.unsplash.com/photo-1515488042361-404e9250afef?auto=format&fit=crop&q=80&w=600',
    active: true,
    sortOrder: 20,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

const staticProducts: Product[] = [
  {
    id: 'prod_macbook',
    title: 'AuraBook Pro 14"',
    slug: 'aurabook-pro-14',
    sku: 'AURB-14-M3',
    brand: 'Aura',
    categoryId: 'cat_electronics',
    description: 'Designed for professionals who demand pure power and visual precision. Features the all-new Aura Silicon M3 chip, a breathtaking 120Hz Liquid OLED display, and a sleek bead-blasted aluminum chassis. Enjoy up to 22 hours of silent operation, dual studio-grade mics, and a six-speaker spatial audio system that floats sound around you.',
    specs: {
      Processor: 'Aura M3 Octa-Core Chip',
      Memory: '16GB Unified RAM',
      Storage: '512GB NVMe PCIe 4.0 SSD',
      Display: '14.2" Liquid OLED (3024 x 1964, 120Hz ProMotion)',
      Battery: 'Up to 22 hours wireless web streaming',
      Ports: '3x Thunderbolt 4 (USB-C), HDMI, SDXC slot, 3.5mm headphone jack',
      OS: 'AuraOS Catalina',
    },
    images: [
      {
        publicId: 'aurabook-main',
        url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800',
        alt: 'AuraBook Pro 14 space grey finish',
        sortOrder: 1,
      },
      {
        publicId: 'aurabook-side',
        url: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&q=80&w=800',
        alt: 'Slim side-profile view of AuraBook Pro',
        sortOrder: 2,
      },
    ],
    pricePaise: 14990000, // Rs. 1,49,900
    compareAtPaise: 16490000, // Rs. 1,64,900
    stock: 25,
    variants: [
      { id: 'v_mac_16_512', label: '16GB RAM / 512GB SSD', sku: 'AURB-14-M3-16-512', priceDeltaPaise: 0, stock: 15 },
      { id: 'v_mac_32_1tb', label: '32GB RAM / 1TB SSD', sku: 'AURB-14-M3-32-1TB', priceDeltaPaise: 2800000, stock: 10 },
    ],
    tags: ['laptop', 'aura', 'professional', 'premium', 'm3'],
    ratingSummary: { averageRating: 4.8, totalReviews: 48 },
    status: 'published',
    seo: { title: 'AuraBook Pro 14 - Next-Gen Silicon M3 Laptop', description: 'Buy AuraBook Pro 14 with M3 chip, Liquid OLED display, and up to 22 hours of battery life. In stock now.' },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod_headphones',
    title: 'SoundWave ANC-90 Studio',
    slug: 'soundwave-anc90-studio',
    sku: 'SW-ANC90-ST',
    brand: 'SoundWave',
    categoryId: 'cat_audio',
    description: 'Immerse yourself in high-fidelity sound, tailored precisely to your ear. The ANC-90 Studio features active hybrid noise cancellation, high-res audio certification, and custom-tuned 40mm biocellulose drivers. Crafted with plush memory foam earcups covered in breathable vegan leather for long-lasting, fatigue-free comfort.',
    specs: {
      Driver: '40mm Biocellulose Dynamic Drivers',
      Connectivity: 'Bluetooth 5.3 & 3.5mm Wired option',
      Codec: 'LDAC, AAC, SBC',
      'Battery Life': 'Up to 45 hours (ANC Off) / 32 hours (ANC On)',
      'Noise Cancelling': 'Hybrid Active Noise Cancellation (up to 42dB reduction)',
      Weight: '260g',
    },
    images: [
      {
        publicId: 'headphones-main',
        url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800',
        alt: 'SoundWave ANC-90 studio headphones black edition',
        sortOrder: 1,
      },
      {
        publicId: 'headphones-lifestyle',
        url: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&q=80&w=800',
        alt: 'Premium headphones on wooden table background',
        sortOrder: 2,
      },
    ],
    pricePaise: 1899900, // Rs. 18,999
    compareAtPaise: 2499900, // Rs. 24,999
    stock: 50,
    variants: [
      { id: 'v_hp_black', label: 'Matte Black', sku: 'SW-ANC90-ST-BLK', priceDeltaPaise: 0, stock: 35 },
      { id: 'v_hp_silver', label: 'Silver Mist', sku: 'SW-ANC90-ST-SLV', priceDeltaPaise: 100000, stock: 15 },
    ],
    tags: ['audio', 'headphones', 'anc', 'noise-cancelling', 'music'],
    ratingSummary: { averageRating: 4.6, totalReviews: 120 },
    status: 'published',
    seo: { title: 'SoundWave ANC-90 Studio Active Noise Cancelling Headphones', description: 'Experience pure acoustic clarity with SoundWave ANC-90 studio headphones. Buy online at best price.' },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod_phone',
    title: 'Infinity X20 Pro',
    slug: 'infinity-x20-pro',
    sku: 'INF-X20P',
    brand: 'Infinity',
    categoryId: 'cat_phones',
    description: 'Reimagine photography and processing power. Equipped with a triple-lens 108MP cinematic camera array, the ultra-fast Titan-X octa-core processor, and a gorgeous 6.7" QHD+ dynamic AMOLED panel with variable 1-120Hz refresh rates. Features standard IP68 water resistance and rapid 65W charging.',
    specs: {
      Display: '6.7" Dynamic AMOLED 2X, QHD+, 120Hz, HDR10+',
      RearCamera: '108MP Main (OIS) + 48MP Telephoto + 12MP Ultra-wide',
      FrontCamera: '32MP Dual-pixel selfie camera',
      Processor: 'Titan-X 4nm Octa-Core SoC',
      Battery: '5000mAh with 65W fast-charging capability',
      Waterproofing: 'IP68 Certified',
    },
    images: [
      {
        publicId: 'phone-main',
        url: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&q=80&w=800',
        alt: 'Infinity X20 Pro smartphone showing front and rear profile',
        sortOrder: 1,
      },
    ],
    pricePaise: 7999900, // Rs. 79,999
    compareAtPaise: 8999900, // Rs. 89,999
    stock: 40,
    variants: [
      { id: 'v_ph_128', label: '8GB RAM / 128GB Storage', sku: 'INF-X20P-128', priceDeltaPaise: 0, stock: 25 },
      { id: 'v_ph_256', label: '12GB RAM / 256GB Storage', sku: 'INF-X20P-256', priceDeltaPaise: 800000, stock: 15 },
    ],
    tags: ['mobile', 'smartphone', 'camera', 'infinity', 'android'],
    ratingSummary: { averageRating: 4.4, totalReviews: 89 },
    status: 'published',
    seo: { title: 'Infinity X20 Pro Flagship Smartphone', description: 'Experience the 108MP cinematic camera on the Infinity X20 Pro. Free delivery nationwide.' },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod_watch',
    title: 'AuraBand Active 3',
    slug: 'auraband-active-3',
    sku: 'AURA-W3',
    brand: 'Aura',
    categoryId: 'cat_wearables',
    description: 'Your ultimate wellness and companion watch. Track your runs, analyze sleep stages, monitor continuous blood-oxygen and heart rate levels. A minimalist bezel-less OLED display and ultra-light titanium case provide elegance and comfort throughout the day and night.',
    specs: {
      Sensors: 'Heart rate, SpO2, Accelerometer, Gyroscope, Barometric altimeter',
      Battery: 'Up to 14 days in typical usage mode',
      WaterResistance: '50m Swimproof (5 ATM)',
      Case: '42mm Aerospace Titanium',
      Compatibility: 'AuraOS, Android 8.0+, iOS 14.0+',
    },
    images: [
      {
        publicId: 'watch-main',
        url: 'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?auto=format&fit=crop&q=80&w=800',
        alt: 'AuraBand Active 3 smart watch showing high-contrast face',
        sortOrder: 1,
      },
    ],
    pricePaise: 1499900, // Rs. 14,999
    compareAtPaise: 1999900, // Rs. 19,999
    stock: 0, // out of stock to demonstrate stock boundaries
    variants: [],
    tags: ['watch', 'wearable', 'smartwatch', 'aura', 'fitness'],
    ratingSummary: { averageRating: 4.2, totalReviews: 34 },
    status: 'published',
    seo: { title: 'AuraBand Active 3 Wellness Smart Watch', description: 'Monitor heart rate, sleep quality, and workouts with the premium AuraBand Active 3. Buy now.' },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod_lamp',
    title: 'Lumina Minimalist Desk Lamp',
    slug: 'lumina-minimalist-desk-lamp',
    sku: 'LUM-LAMP-MN',
    brand: 'Lumina',
    categoryId: 'cat_home',
    description: 'Transform your desk setup with warm, diffused lighting. Crafted from sand-blasted anodized aluminum, the Lumina lamp features step-less rotary dimming, dual color temperature modes (3000K/4500K), and a flicker-free panel that reduces eye fatigue during long coding/reading sessions.',
    specs: {
      Material: 'Bead-blasted Anodized Aluminum',
      Brightness: 'Step-less dimming up to 600 lumens',
      Power: 'USB-C powered (10W max consumption)',
      LightSource: 'Flicker-free high-CRI LED matrix',
      Life: '50,000 hours',
    },
    images: [
      {
        publicId: 'lamp-main',
        url: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=800',
        alt: 'Lumina minimalist desk lamp illuminated in dark studio',
        sortOrder: 1,
      },
    ],
    pricePaise: 449900, // Rs. 4,499
    compareAtPaise: 599900, // Rs. 5,999
    stock: 12,
    variants: [],
    tags: ['home', 'lamp', 'minimalist', 'interior', 'desk'],
    ratingSummary: { averageRating: 4.7, totalReviews: 22 },
    status: 'published',
    seo: { title: 'Lumina Minimalist Desk Lamp - Flicker-Free Dimming', description: 'Sleek, step-less rotary dimming desk lamp. USB-C powered. Elevate your workspace.' },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod_lenovo_loq',
    title: 'Lenovo LOQ 15 Gaming Laptop',
    slug: 'lenovo-loq-15',
    sku: 'LEN-LOQ-15-I5',
    brand: 'Lenovo',
    categoryId: 'cat_laptops',
    description: 'Dominate the gaming arena with the Lenovo LOQ 15. Powered by an Intel Core i5 12th Gen processor and NVIDIA GeForce RTX 3050 graphics, it delivers smooth framerates and reliable performance. Features a high-speed 144Hz FHD display and signature LOQ thermal engineering to stay cool during intense gaming sessions.',
    specs: {
      Processor: 'Intel Core i5-12450H (8 Cores, up to 4.40 GHz)',
      Graphics: 'NVIDIA GeForce RTX 3050 4GB GDDR6',
      Memory: '16GB DDR5 4800MHz RAM',
      Storage: '512GB PCIe Gen4 NVMe M.2 SSD',
      Display: '15.6" FHD (1920x1080) IPS 144Hz, 350 nits',
      OS: 'Windows 11 Home',
    },
    images: [
      {
        publicId: 'loq-main',
        url: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&q=80&w=800',
        alt: 'Lenovo LOQ gaming laptop open on desk',
        sortOrder: 1,
      },
    ],
    pricePaise: 6599000, // Rs. 65,990
    compareAtPaise: 7999000,
    stock: 18,
    variants: [
      { id: 'v_loq_16_512', label: '16GB RAM / 512GB SSD', sku: 'LEN-LOQ-15-16-512', priceDeltaPaise: 0, stock: 10 },
      { id: 'v_loq_24_1tb', label: '24GB RAM / 1TB SSD', sku: 'LEN-LOQ-15-24-1TB', priceDeltaPaise: 800000, stock: 8 },
    ],
    tags: ['laptop', 'gaming', 'lenovo', 'rtx', 'windows'],
    ratingSummary: { averageRating: 4.5, totalReviews: 32 },
    status: 'published',
    seo: { title: 'Lenovo LOQ 15 Gaming Laptop - RTX 3050', description: 'Experience immersive gaming with Lenovo LOQ 15, Intel Core i5, RTX 3050 and 144Hz display.' },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod_asus_tuf',
    title: 'ASUS TUF Gaming A15',
    slug: 'asus-tuf-gaming-a15',
    sku: 'ASU-TUF-A15-R7',
    brand: 'ASUS',
    categoryId: 'cat_laptops',
    description: 'Engineered for serious gaming and real-world durability. The ASUS TUF Gaming A15 is a feature-packed Windows 11 gaming laptop built to lead you to victory. Powered by an AMD Ryzen 7 processor and a GeForce RTX 4050 GPU, action-packed gameplay is fast, fluid, and fully saturates speedy 144Hz displays.',
    specs: {
      Processor: 'AMD Ryzen 7 7735HS (8 Cores, up to 4.75 GHz)',
      Graphics: 'NVIDIA GeForce RTX 4050 6GB GDDR6',
      Memory: '16GB DDR5 5600MHz RAM',
      Storage: '512GB M.2 NVMe PCIe 4.0 SSD',
      Display: '15.6" FHD 144Hz, 100% sRGB Adaptive-Sync',
      OS: 'Windows 11 Home',
    },
    images: [
      {
        publicId: 'asus-tuf-main',
        url: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&q=80&w=800',
        alt: 'ASUS TUF Gaming laptop chassis view',
        sortOrder: 1,
      },
    ],
    pricePaise: 7999000, // Rs. 79,990
    compareAtPaise: 9499000,
    stock: 12,
    variants: [],
    tags: ['laptop', 'gaming', 'asus', 'tuf', 'rtx', 'windows'],
    ratingSummary: { averageRating: 4.6, totalReviews: 24 },
    status: 'published',
    seo: { title: 'ASUS TUF Gaming A15 - RTX 4050 Gaming Laptop', description: 'Dominate games with ASUS TUF A15 featuring Ryzen 7, RTX 4050 graphics and 144Hz screen.' },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod_hp_victus',
    title: 'HP Victus 16 Laptop',
    slug: 'hp-victus-16',
    sku: 'HP-VIC-16-R5',
    brand: 'HP',
    categoryId: 'cat_laptops',
    description: 'The HP Victus 16-inch Laptop is built for peak PC gaming. This sleek machine features an AMD Ryzen 5 processor and NVIDIA GeForce RTX 3050 graphics. Its design is as impressive as its hardware, with a high-resolution, fast refresh display, all-around thermal management, and an integrated OMEN Gaming Hub.',
    specs: {
      Processor: 'AMD Ryzen 5 5600H (6 Cores, up to 4.20 GHz)',
      Graphics: 'NVIDIA GeForce RTX 3050 4GB GDDR6',
      Memory: '8GB DDR4 3200MHz RAM',
      Storage: '512GB PCIe NVMe M.2 SSD',
      Display: '16.1" FHD (1920x1080) IPS 144Hz, micro-edge',
      OS: 'Windows 11 Home',
    },
    images: [
      {
        publicId: 'victus-main',
        url: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&q=80&w=800',
        alt: 'HP Victus laptop front profile',
        sortOrder: 1,
      },
    ],
    pricePaise: 5499000, // Rs. 54,990
    compareAtPaise: 6899000,
    stock: 15,
    variants: [
      { id: 'v_victus_8gb', label: '8GB RAM / 512GB SSD', sku: 'HP-VIC-16-8-512', priceDeltaPaise: 0, stock: 5 },
      { id: 'v_victus_16gb', label: '16GB RAM / 512GB SSD', sku: 'HP-VIC-16-16-512', priceDeltaPaise: 400000, stock: 10 },
    ],
    tags: ['laptop', 'gaming', 'hp', 'victus', 'windows'],
    ratingSummary: { averageRating: 4.3, totalReviews: 18 },
    status: 'published',
    seo: { title: 'HP Victus 16 Gaming Laptop', description: 'Unlock true power with HP Victus 16 featuring Ryzen 5, RTX 3050 and OMEN Hub integration.' },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod_macbook_air_m2',
    title: 'Apple MacBook Air 13" (M2)',
    slug: 'macbook-air-13-m2',
    sku: 'APL-MBA-M2-8-256',
    brand: 'Apple',
    categoryId: 'cat_laptops',
    description: 'Strikingly thin and fast, the redesigned MacBook Air features the next-generation M2 chip. Inside a remarkably durable, silent fanless aluminum enclosure, you get exceptional speed and power efficiency, a beautiful Liquid Retina display, 1080p FaceTime HD camera, and up to 18 hours of battery life.',
    specs: {
      Processor: 'Apple M2 8-core CPU, 8-core GPU',
      Memory: '8GB Unified Memory',
      Storage: '256GB SSD Storage',
      Display: '13.6" Liquid Retina display with True Tone',
      OS: 'macOS Sonoma',
    },
    images: [
      {
        publicId: 'mba-m2-main',
        url: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&q=80&w=800',
        alt: 'Apple MacBook Air M2 Space Grey',
        sortOrder: 1,
      },
    ],
    pricePaise: 8990000, // Rs. 89,900
    compareAtPaise: 9990000,
    stock: 20,
    variants: [
      { id: 'v_mba_m2_8_256', label: '8GB RAM / 256GB SSD', sku: 'APL-MBA-M2-8-256', priceDeltaPaise: 0, stock: 15 },
      { id: 'v_mba_m2_16_512', label: '16GB RAM / 512GB SSD', sku: 'APL-MBA-M2-16-512', priceDeltaPaise: 1000000, stock: 5 },
    ],
    tags: ['laptop', 'apple', 'macbook', 'm2', 'macos', 'premium'],
    ratingSummary: { averageRating: 4.8, totalReviews: 56 },
    status: 'published',
    seo: { title: 'Apple MacBook Air 13-inch M2', description: 'Thin, fast, fanless. Purchase the latest Apple MacBook Air M2 now.' },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod_iphone_15',
    title: 'Apple iPhone 15',
    slug: 'apple-iphone-15',
    sku: 'APL-IPH15-128',
    brand: 'Apple',
    categoryId: 'cat_phones',
    description: 'iPhone 15 brings you the Dynamic Island, a 48MP Main camera, and USB-C, all in a durable color-infused glass and aluminum design. Powered by the incredibly fast A16 Bionic chip, it supports dual-pixel autofocus and stunning next-generation portraits.',
    specs: {
      Display: '6.1" Super Retina XDR OLED display',
      RearCamera: '48MP Main + 12MP Ultra Wide',
      FrontCamera: '12MP TrueDepth camera',
      Processor: 'A16 Bionic chip',
      Connector: 'USB-C',
      OS: 'iOS 17',
    },
    images: [
      {
        publicId: 'iph15-main',
        url: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&q=80&w=800',
        alt: 'Apple iPhone 15 back panel view',
        sortOrder: 1,
      },
    ],
    pricePaise: 7199900, // Rs. 71,999
    compareAtPaise: 7990000,
    stock: 25,
    variants: [
      { id: 'v_iph15_128', label: '128GB Storage', sku: 'APL-IPH15-128', priceDeltaPaise: 0, stock: 15 },
      { id: 'v_iph15_256', label: '256GB Storage', sku: 'APL-IPH15-256', priceDeltaPaise: 1000000, stock: 10 },
    ],
    tags: ['mobile', 'smartphone', 'iphone', 'apple', 'ios', 'camera'],
    ratingSummary: { averageRating: 4.7, totalReviews: 44 },
    status: 'published',
    seo: { title: 'Apple iPhone 15 128GB/256GB', description: 'Experience iPhone 15 with Dynamic Island, A16 Bionic chip, and 48MP camera.' },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod_iphone_14',
    title: 'Apple iPhone 14',
    slug: 'apple-iphone-14',
    sku: 'APL-IPH14-128',
    brand: 'Apple',
    categoryId: 'cat_phones',
    description: 'iPhone 14 features a dual-camera system for stunning photos in low light, crash detection, and the longest battery life yet. Driven by the A15 Bionic chip with a 5-core GPU, it delivers smooth performance for gaming and AR.',
    specs: {
      Display: '6.1" Super Retina XDR OLED',
      RearCamera: '12MP Main + 12MP Ultra Wide',
      FrontCamera: '12MP TrueDepth',
      Processor: 'A15 Bionic chip',
      OS: 'iOS 16',
    },
    images: [
      {
        publicId: 'iph14-main',
        url: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&q=80&w=800',
        alt: 'Apple iPhone 14 in hand',
        sortOrder: 1,
      },
    ],
    pricePaise: 5999900, // Rs. 59,999
    compareAtPaise: 6990000,
    stock: 30,
    variants: [],
    tags: ['mobile', 'smartphone', 'iphone', 'apple', 'ios'],
    ratingSummary: { averageRating: 4.5, totalReviews: 50 },
    status: 'published',
    seo: { title: 'Apple iPhone 14 - Dual Camera and A15 Bionic', description: 'Get the Apple iPhone 14 with advanced dual camera system and crash detection.' },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod_samsung_s23fe',
    title: 'Samsung Galaxy S23 FE',
    slug: 'samsung-galaxy-s23fe',
    sku: 'SAM-S23FE-128',
    brand: 'Samsung',
    categoryId: 'cat_phones',
    description: 'Experience epic shots and seamless performance. The Galaxy S23 FE features a 50MP high-resolution camera, nightography for clear low-light shots, and a vibrant 120Hz Dynamic AMOLED display. Powered by an advanced octa-core processor, it makes multitasking a breeze.',
    specs: {
      Display: '6.4" Dynamic AMOLED 2X, 120Hz',
      RearCamera: '50MP Main + 12MP Ultra Wide + 8MP Telephoto',
      Processor: 'Exynos 2200 4nm Octa-core',
      Battery: '4500mAh with 25W charging',
      Waterproofing: 'IP68',
      OS: 'Android 13 (One UI)',
    },
    images: [
      {
        publicId: 's23fe-main',
        url: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&q=80&w=800',
        alt: 'Samsung Galaxy phone design',
        sortOrder: 1,
      },
    ],
    pricePaise: 4999900, // Rs. 49,999
    compareAtPaise: 5999900,
    stock: 22,
    variants: [],
    tags: ['mobile', 'smartphone', 'samsung', 'android', 'galaxy'],
    ratingSummary: { averageRating: 4.4, totalReviews: 29 },
    status: 'published',
    seo: { title: 'Samsung Galaxy S23 FE 5G', description: 'Capture epic photos with the 50MP camera on Galaxy S23 FE. Order online now.' },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod_oneplus_nord_ce4',
    title: 'OnePlus Nord CE 4 5G',
    slug: 'oneplus-nord-ce4',
    sku: '1PL-NCE4-128',
    brand: 'OnePlus',
    categoryId: 'cat_phones',
    description: 'Fast, smooth, and ultra-durable. The OnePlus Nord CE 4 features a 50MP Sony LYT-600 camera with OIS, 100W SUPERVOOC fast charging that goes from 1-100% in 29 minutes, and a massive 5500mAh battery. The Snapdragon 7 Gen 3 processor ensures snappy multitasking.',
    specs: {
      Display: '6.7" Fluid AMOLED, 120Hz, HDR10+',
      RearCamera: '50MP Sony OIS Main + 8MP Ultra Wide',
      FrontCamera: '16MP Selfie',
      Processor: 'Snapdragon 7 Gen 3',
      Charging: '100W SUPERVOOC (Charger in box)',
      OS: 'OxygenOS based on Android 14',
    },
    images: [
      {
        publicId: 'nordce4-main',
        url: 'https://images.unsplash.com/photo-1565630916779-e303be97b6f5?auto=format&fit=crop&q=80&w=800',
        alt: 'OnePlus sleek phone back',
        sortOrder: 1,
      },
    ],
    pricePaise: 2499900, // Rs. 24,999
    compareAtPaise: 2799900,
    stock: 40,
    variants: [],
    tags: ['mobile', 'smartphone', 'oneplus', 'android', 'nord'],
    ratingSummary: { averageRating: 4.4, totalReviews: 19 },
    status: 'published',
    seo: { title: 'OnePlus Nord CE 4 - 100W SuperVOOC', description: 'Get the OnePlus Nord CE 4 with 100W fast charging and Sony LYT-600 OIS camera.' },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod_redmi_13pro',
    title: 'Redmi Note 13 Pro 5G',
    slug: 'redmi-note-13-pro',
    sku: 'RED-N13P-256',
    brand: 'Redmi',
    categoryId: 'cat_phones',
    description: 'Capture ultimate clarity with a flagship 200MP camera featuring OIS. The Redmi Note 13 Pro features a stunning 1.5K 120Hz AMOLED curved display, Snapdragon 7s Gen 2 processor, and 67W Turbo Charge with a 5100mAh battery. Built with Gorilla Glass Victus for extra durability.',
    specs: {
      Display: '6.67" 1.5K 120Hz AMOLED',
      RearCamera: '200MP Main + 8MP Wide + 2MP Macro',
      Processor: 'Snapdragon 7s Gen 2',
      Battery: '5100mAh with 67W charger',
      OS: 'MIUI based on Android 13',
    },
    images: [
      {
        publicId: 'redmi13p-main',
        url: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&q=80&w=800',
        alt: 'Redmi phone view',
        sortOrder: 1,
      },
    ],
    pricePaise: 2599900, // Rs. 25,999
    compareAtPaise: 2999900,
    stock: 35,
    variants: [],
    tags: ['mobile', 'smartphone', 'redmi', 'xiaomi', 'android', 'camera'],
    ratingSummary: { averageRating: 4.5, totalReviews: 12 },
    status: 'published',
    seo: { title: 'Redmi Note 13 Pro 5G - 200MP OIS Camera', description: 'Explore details with the 200MP camera on Redmi Note 13 Pro. Order now.' },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod_milton_lunchbox',
    title: 'Milton Thermosteel Lunch Box',
    slug: 'milton-thermosteel-lunch-box',
    sku: 'MIL-THERM-LB',
    brand: 'Milton',
    categoryId: 'cat_kitchen',
    description: 'Carry your home-cooked meals in style and keep them hot for hours. The Milton Thermosteel lunch box contains 3 stainless steel leak-proof containers inside an insulated carrier bag. Made from high-quality food-grade steel, it is rust-free and extremely durable.',
    specs: {
      Containers: '3 Stainless Steel Containers (300ml each)',
      Insulation: 'Double-walled vacuum insulation',
      CarryBag: 'Premium insulated fabric bag included',
      Material: '18/8 Food Grade Stainless Steel',
    },
    images: [
      {
        publicId: 'milton-lunch-main',
        url: 'https://images.unsplash.com/photo-1606857521015-7f9fcf423740?auto=format&fit=crop&q=80&w=800',
        alt: 'Stainless steel food containers set',
        sortOrder: 1,
      },
    ],
    pricePaise: 129900, // Rs. 1,299
    compareAtPaise: 159900,
    stock: 150,
    variants: [],
    tags: ['lunchbox', 'milton', 'kitchen', 'accessories'],
    ratingSummary: { averageRating: 4.2, totalReviews: 8 },
    status: 'published',
    seo: { title: 'Milton Thermosteel Insulated Lunch Box', description: 'Keep your meals hot with Milton Thermosteel 3-container lunch box. Best price online.' },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod_borosil_lunchbox',
    title: 'Borosil Glass Lunch Box (Set of 3)',
    slug: 'borosil-glass-lunch-box',
    sku: 'BOR-GLASS-LB',
    brand: 'Borosil',
    categoryId: 'cat_kitchen',
    description: 'High quality borosilicate glass containers that are safe for oven, microwave, dishwasher, and freezer. The set of 3 comes with airtight, leak-proof silicone seal lids, ideal for carrying gravy, curries, and salads without any spill worries.',
    specs: {
      Material: '100% Borosilicate Glass',
      Containers: '3 Rectangular Containers (400ml each)',
      Lids: 'BPA-free plastic lids with silicone seals',
      HeatResistance: 'Up to 400°C (without lid)',
    },
    images: [
      {
        publicId: 'borosil-lunch-main',
        url: 'https://images.unsplash.com/photo-1544982503-9f984c14501a?auto=format&fit=crop&q=80&w=800',
        alt: 'Glass containers with food items',
        sortOrder: 1,
      },
    ],
    pricePaise: 99900, // Rs. 999
    compareAtPaise: 139900,
    stock: 120,
    variants: [],
    tags: ['lunchbox', 'borosil', 'kitchen', 'glass'],
    ratingSummary: { averageRating: 4.6, totalReviews: 15 },
    status: 'published',
    seo: { title: 'Borosil Glass Lunch Box - Set of 3', description: 'Microwave and oven safe Borosil glass containers with airtight lids. Pack of 3.' },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod_yamaha_guitar',
    title: 'Yamaha F310 Acoustic Guitar',
    slug: 'yamaha-f310-guitar',
    sku: 'YAM-F310-NAT',
    brand: 'Yamaha',
    categoryId: 'cat_music',
    description: 'The Yamaha F310 offers outstanding quality and value. The spruce top and meranti back and sides produce a warm, well-balanced sound with quick response. It is highly recommended for beginners and intermediate players seeking a reliable steel-string guitar.',
    specs: {
      BodyShape: 'Traditional Western Dreadnought',
      TopMaterial: 'Spruce',
      BackSides: 'Meranti',
      NeckMaterial: 'Locally Sourced Tonewood',
      Fingerboard: 'Rosewood',
      Strings: '6 Steel Strings',
    },
    images: [
      {
        publicId: 'yamaha-guitar-main',
        url: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&q=80&w=800',
        alt: 'Acoustic guitar standing against wall',
        sortOrder: 1,
      },
    ],
    pricePaise: 949000, // Rs. 9,490
    compareAtPaise: 1050000,
    stock: 15,
    variants: [
      { id: 'v_yam_natural', label: 'Natural Spruce', sku: 'YAM-F310-NAT', priceDeltaPaise: 0, stock: 10 },
      { id: 'v_yam_tobacco', label: 'Tobacco Brown Sunburst', sku: 'YAM-F310-TBS', priceDeltaPaise: 50000, stock: 5 },
    ],
    tags: ['guitar', 'yamaha', 'acoustic', 'music', 'instruments'],
    ratingSummary: { averageRating: 4.8, totalReviews: 67 },
    status: 'published',
    seo: { title: 'Yamaha F310 Acoustic Dreadnought Guitar', description: 'Buy natural finish Yamaha F310 acoustic guitar. Trusted sound for players.' },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod_kadence_guitar',
    title: 'Kadence Frontier Acoustic Guitar',
    slug: 'kadence-frontier-guitar',
    sku: 'KAD-FRNT-BLK',
    brand: 'Kadence',
    categoryId: 'cat_music',
    description: 'Unleash your inner musician with the Kadence Frontier. Features a durable spruce body and rosewood fretboard for clear high notes and deep resonance. Perfect size for easy carrying, featuring a sleek cutaway design for comfortable upper fret access.',
    specs: {
      Size: '40-inch Acoustic Guitar',
      BodyMaterial: 'Spruce / Linden Wood',
      Fretboard: 'Rosewood',
      Finish: 'High Gloss Matte',
    },
    images: [
      {
        publicId: 'kadence-guitar-main',
        url: 'https://images.unsplash.com/photo-1550985616-10810253b84d?auto=format&fit=crop&q=80&w=800',
        alt: 'Black acoustic guitar',
        sortOrder: 1,
      },
    ],
    pricePaise: 499900, // Rs. 4,999
    compareAtPaise: 650000,
    stock: 25,
    variants: [],
    tags: ['guitar', 'kadence', 'acoustic', 'music'],
    ratingSummary: { averageRating: 4.2, totalReviews: 41 },
    status: 'published',
    seo: { title: 'Kadence Frontier 40" Acoustic Guitar - Black', description: 'Stylish black Kadence Frontier guitar with strap, picks and bag accessories.' },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod_cetaphil_wash',
    title: 'Cetaphil Gentle Skin Cleanser (250ml)',
    slug: 'cetaphil-gentle-skin-cleanser',
    sku: 'CET-WASH-250',
    brand: 'Cetaphil',
    categoryId: 'cat_cosmetics',
    description: 'Recommended by dermatologists for dry, sensitive skin. Cetaphil Gentle Skin Cleanser actively hydrates as it cleanses. It uses Micellar Technology to remove dirt, makeup, and impurities while preserving the skin\'s natural moisture barrier.',
    specs: {
      Volume: '250 ml',
      SkinType: 'Sensitive, Dry, and Normal',
      PHBalanced: 'Yes',
      SoapFree: 'Yes',
    },
    images: [
      {
        publicId: 'cetaphil-wash-main',
        url: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=800',
        alt: 'Skincare bottle on solid background',
        sortOrder: 1,
      },
    ],
    pricePaise: 39900, // Rs. 399
    compareAtPaise: 45000,
    stock: 300,
    variants: [],
    tags: ['facewash', 'cetaphil', 'skincare', 'cosmetics'],
    ratingSummary: { averageRating: 4.7, totalReviews: 128 },
    status: 'published',
    seo: { title: 'Cetaphil Gentle Skin Cleanser 250ml', description: 'Cleanse and soothe your dry, sensitive skin daily with Cetaphil skin cleanser.' },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod_maybelline_foundation',
    title: 'Maybelline Fit Me Matte Foundation',
    slug: 'maybelline-fit-me-foundation',
    sku: 'MAY-FITM-FND',
    brand: 'Maybelline',
    categoryId: 'cat_cosmetics',
    description: 'Fit Me Matte + Poreless Foundation is designed for normal to oily skin. Its micro-powders absorb shine and blur pores, giving you a natural, seamless matte finish. Available in various skin-matching shades.',
    specs: {
      Volume: '30 ml',
      Finish: 'Natural Matte',
      SPF: 'SPF 22',
      Coverage: 'Medium to Full buildable',
    },
    images: [
      {
        publicId: 'maybelline-foundation-main',
        url: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=800',
        alt: 'Makeup items set',
        sortOrder: 1,
      },
    ],
    pricePaise: 45000, // Rs. 450
    compareAtPaise: 59900,
    stock: 150,
    variants: [
      { id: 'v_may_115', label: 'Shade 115 - Ivory', sku: 'MAY-FITM-FND-115', priceDeltaPaise: 0, stock: 50 },
      { id: 'v_may_128', label: 'Shade 128 - Warm Nude', sku: 'MAY-FITM-FND-128', priceDeltaPaise: 0, stock: 50 },
      { id: 'v_may_220', label: 'Shade 220 - Natural Beige', sku: 'MAY-FITM-FND-220', priceDeltaPaise: 0, stock: 50 },
    ],
    tags: ['makeup', 'foundation', 'maybelline', 'cosmetics'],
    ratingSummary: { averageRating: 4.4, totalReviews: 92 },
    status: 'published',
    seo: { title: 'Maybelline Fit Me Matte + Poreless Foundation', description: 'Get a natural matte finish with Maybelline Fit Me. Controls shine, blurs pores.' },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod_mamaearth_shampoo',
    title: 'Mamaearth Onion Shampoo (250ml)',
    slug: 'mamaearth-onion-shampoo',
    sku: 'MAM-ONN-SHM',
    brand: 'Mamaearth',
    categoryId: 'cat_cosmetics',
    description: 'Reduce hair fall and accelerate hair growth with the goodness of onion. Enriched with Onion Seed Oil and Plant Keratin, this shampoo gently cleanses the hair and scalp, strengthens roots, and makes hair soft, smooth, and frizz-free.',
    specs: {
      Volume: '250 ml',
      KeyIngredients: 'Onion Seed Oil, Plant Keratin',
      SulphateFree: 'Yes',
      ParabenFree: 'Yes',
    },
    images: [
      {
        publicId: 'mamaearth-shampoo-main',
        url: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&q=80&w=800',
        alt: 'Cosmetic shampoo bottles',
        sortOrder: 1,
      },
    ],
    pricePaise: 34900, // Rs. 349
    compareAtPaise: 39900,
    stock: 200,
    variants: [],
    tags: ['shampoo', 'mamaearth', 'haircare', 'cosmetics'],
    ratingSummary: { averageRating: 4.3, totalReviews: 53 },
    status: 'published',
    seo: { title: 'Mamaearth Onion Shampoo for Hair Fall Control', description: 'Strengthen your hair roots and prevent fall with natural Onion shampoo from Mamaearth.' },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod_lakme_lipstick',
    title: 'Lakme Absolute Matte Liquid Lipstick',
    slug: 'lakme-absolute-lipstick',
    sku: 'LAK-ABSM-LIP',
    brand: 'Lakme',
    categoryId: 'cat_cosmetics',
    description: 'Lakme Absolute Matte Melt Liquid Lipstick is a velvet matte formula that delivers rich, intense color pay-off in a single stroke. Feather-light texture feels weightless and comfortable on lips, lasting up to 16 hours without transfer.',
    specs: {
      Volume: '6 ml',
      Finish: 'Velvet Matte',
      Duration: 'Up to 16 Hours',
    },
    images: [
      {
        publicId: 'lakme-lipstick-main',
        url: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&q=80&w=800',
        alt: 'Lipstick tube packaging',
        sortOrder: 1,
      },
    ],
    pricePaise: 65000, // Rs. 650
    compareAtPaise: 79900,
    stock: 180,
    variants: [
      { id: 'v_lak_red', label: 'Firestarter Red', sku: 'LAK-ABSM-LIP-RED', priceDeltaPaise: 0, stock: 90 },
      { id: 'v_lak_pink', label: 'Mild Mauve', sku: 'LAK-ABSM-LIP-PNK', priceDeltaPaise: 0, stock: 90 },
    ],
    tags: ['makeup', 'lipstick', 'lakme', 'cosmetics'],
    ratingSummary: { averageRating: 4.5, totalReviews: 38 },
    status: 'published',
    seo: { title: 'Lakme Absolute Matte Melt Liquid Lipstick', description: 'Shop Lakme Absolute Velvet Matte liquid lipstick. Lightweight 16-hour long-wear.' },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

interface ProductTemplate {
  name: string;
  brands: string[];
  priceRange: [number, number];
  images: string[];
  specs: Record<string, string[]>;
  description: string;
  tags: string[];
  categoryId: string;
}

const TEMPLATES: ProductTemplate[] = [
  {
    categoryId: 'cat_sports_fitness',
    name: 'All-Purpose Yoga Mat',
    brands: ['Boldfit', 'Kore', 'Vifitkit', 'BalanceFrom', 'Solimo'],
    priceRange: [499, 1499],
    images: ['https://images.unsplash.com/photo-1592432678016-e910b452f9a2?auto=format&fit=crop&q=80&w=600'],
    specs: {
      'Material': ['High-Density EVA Foam', 'Eco-friendly TPE', 'Natural Rubber'],
      'Thickness': ['6mm', '8mm', '10mm'],
      'Features': ['Anti-skid texture, carry strap included', 'Double-sided non-slip, sweat resistant']
    },
    description: 'Perfect for home workouts, yoga, pilates, and stretching. Features dual-sided non-slip surfaces to prevent injuries and provide stable support.',
    tags: ['yoga-mat', 'fitness', 'workout', 'sports']
  },
  {
    categoryId: 'cat_sports_fitness',
    name: 'PVC Hex Dumbbells Set',
    brands: ['Lifelong', 'Kore', 'Cockatoo', 'AmazonBasics'],
    priceRange: [799, 2999],
    images: ['https://images.unsplash.com/photo-1638536532686-d610adfc8e5c?auto=format&fit=crop&q=80&w=600'],
    specs: {
      'Weight': ['5 Kg (2.5 Kg x 2)', '10 Kg (5 Kg x 2)', '15 Kg (7.5 Kg x 2)'],
      'Material': ['PVC filled with concrete', 'Steel core with neoprene coating'],
      'Grip': ['Ergonomic non-slip handle', 'Contoured chrome grip']
    },
    description: 'Build strength and tone muscle with this premium dumbbell set. The hexagonal shape prevents rolling and enables easy storage.',
    tags: ['dumbbells', 'strength-training', 'gym', 'fitness']
  },
  {
    categoryId: 'cat_sports_fitness',
    name: 'Latex Resistance Loop Bands',
    brands: ['Boldfit', 'Slovic', 'Vifitkit', 'Kore'],
    priceRange: [299, 999],
    images: ['https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=600'],
    specs: {
      'Levels': ['Set of 5 (Light to XX-Heavy)', 'Set of 3 (Heavy resistance)'],
      'Material': ['100% Natural Latex', 'High-quality fabric blend']
    },
    description: 'Versatile fitness bands ideal for glute activation, leg workouts, physical therapy, and upper body stretching.',
    tags: ['resistance-bands', 'stretching', 'home-workout']
  },
  {
    categoryId: 'cat_sports_fitness',
    name: 'Duffel Gym Bag',
    brands: ['Nivia', 'Nike', 'Puma', 'Adidas', 'Safari'],
    priceRange: [599, 1999],
    images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=600'],
    specs: {
      'Capacity': ['30L', '40L', '25L'],
      'Material': ['Water-resistant Polyester', 'Durable Nylon Ripstop'],
      'Compartments': ['Shoe compartment + wet pocket', 'Main storage + key organizer']
    },
    description: 'Keep your gym gear organized. Features a dedicated ventilated shoe compartment and water-resistant fabric.',
    tags: ['gym-bag', 'duffel', 'travel', 'sports']
  },
  {
    categoryId: 'cat_sports_fitness',
    name: 'Running Sports Shoes',
    brands: ['Adidas', 'Puma', 'Nike', 'Reebok', 'Asics'],
    priceRange: [1499, 4999],
    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=600'],
    specs: {
      'Sole': ['Phylon Midsole with Rubber Outsole', 'EVA Cushioning with Grip Studs'],
      'Upper': ['Breathable mesh fabric', 'Knit mesh with TPU overlays'],
      'Closure': ['Lace-up closure', 'Slip-on style with laces']
    },
    description: 'Designed for daily jogging and intense gym sessions. The breathable mesh keeping your feet cool, while the padded sole offers maximum impact absorption.',
    tags: ['shoes', 'running', 'footwear', 'sneakers']
  },
  {
    categoryId: 'cat_sports_fitness',
    name: 'Activewear Dry-Fit T-Shirt',
    brands: ['Nike', 'Adidas', 'Puma', 'Under Armour', 'HRX'],
    priceRange: [499, 1499],
    images: ['https://images.unsplash.com/photo-1518310383802-640c2de311b2?auto=format&fit=crop&q=80&w=600'],
    specs: {
      'Fabric': ['100% Dry-Fit Polyester', 'Polyester-Spandex stretch blend'],
      'Fit': ['Regular Fit', 'Slim compression fit'],
      'Wash Care': ['Machine wash cold', 'Hand wash recommended']
    },
    description: 'Stay dry and comfortable during workouts. Moisture-wicking technology absorbs sweat, and 4-way stretch fabric ensures maximum mobility.',
    tags: ['sportswear', 'tshirt', 'activewear', 'clothing']
  },
  {
    categoryId: 'cat_sports_fitness',
    name: 'Smart Fitness Tracker Band',
    brands: ['Fitbit', 'Mi', 'Noise', 'OnePlus', 'realme'],
    priceRange: [1999, 8999],
    images: ['https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?auto=format&fit=crop&q=80&w=600'],
    specs: {
      'Display': ['1.62" AMOLED Touch Display', '1.47" TFT Color Screen'],
      'Battery Life': ['Up to 14 days on single charge', 'Up to 7 days with AOD'],
      'Sensors': ['SpO2 Oxygen, Heart Rate, Sleep Tracker', 'GPS, Pedometer, Calorie counter']
    },
    description: 'Track your health metrics 24/7. Monitoring heart rate, blood oxygen levels, deep sleep patterns, and 100+ sports modes.',
    tags: ['fitness-tracker', 'smartwatch', 'wearables', 'electronics']
  },
  {
    categoryId: 'cat_sports_fitness',
    name: 'Leather Gym Gloves',
    brands: ['Kore', 'Nivia', 'Boldfit', 'USI'],
    priceRange: [199, 599],
    images: ['https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=600'],
    specs: {
      'Material': ['Genuine leather with padded palm', 'Synthetic fabric with silicone grip'],
      'Wrist Support': ['12-inch adjustable strap', 'Elastic pull-tab wristwrap']
    },
    description: 'Protective gym gloves with built-in wrist support wraps. Avoid calluses and maintain a solid grip on barbells.',
    tags: ['gym-gloves', 'weightlifting', 'accessories']
  },
  {
    categoryId: 'cat_automotive',
    name: 'Dashboard Car Phone Mount',
    brands: ['Portronics', 'Spigen', 'Elago', 'Mi', 'Tarkan'],
    priceRange: [299, 1299],
    images: ['https://images.unsplash.com/photo-1586444248902-2f64eddc13df?auto=format&fit=crop&q=80&w=600'],
    specs: {
      'Mounting Type': ['Suction cup + Gel pad dashboard mount', 'Air vent clamp clip'],
      'Rotation': ['360 degree adjustable ball joint', '180 degree extendable arm']
    },
    description: 'Keep your smartphone secured during bumpy rides. Adjustable grips fits all phone sizes and allows easy 360-degree rotation.',
    tags: ['phone-holder', 'car-mount', 'accessories']
  },
  {
    categoryId: 'cat_automotive',
    name: 'Car Cleaning Gel & Polish Kit',
    brands: ['3M', 'Wavex', 'Turtle Wax', 'Formula 1'],
    priceRange: [399, 1999],
    images: ['https://images.unsplash.com/photo-1607860108855-64cac2078bd2?auto=format&fit=crop&q=80&w=600'],
    specs: {
      'Contents': ['Shampoo, Liquid Wax, Glass Cleaner, 2x Microfiber', 'Polish spray + Dashboard cleaner'],
      'Volume': ['500ml each bottle', '250ml spray bottles']
    },
    description: 'All-in-one car grooming kit for a showroom-like shine. Includes premium car shampoo, dashboard polish, and plush microfiber cloths.',
    tags: ['cleaning-kit', 'car-wash', 'polish']
  },
  {
    categoryId: 'cat_automotive',
    name: 'Premium Leatherette Car Seat Covers',
    brands: ['Auto Trends', 'Lusso Gear', 'Sparco', 'Elegant'],
    priceRange: [1999, 7999],
    images: ['https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=600'],
    specs: {
      'Material': ['PU Leatherette with memory foam padding', 'Breathable mesh fabric'],
      'Fit': ['Universal fit for 5-seater hatchbacks/sedans', 'Custom fit contours']
    },
    description: 'Upgrade your car interior with water-resistant leatherette seat protectors. Easy wipe-to-clean design protects from spills.',
    tags: ['seat-covers', 'interior', 'car-decor']
  },
  {
    categoryId: 'cat_automotive',
    name: 'Dual Port Fast Car Charger',
    brands: ['Anker', 'Mi', 'Portronics', 'Belkin', 'Ambrane'],
    priceRange: [399, 1499],
    images: ['https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&q=80&w=600'],
    specs: {
      'Output Ports': ['Dual USB-A (QC 3.0)', 'USB-C Power Delivery + USB-A QuickCharge'],
      'Max Output': ['36W total output', '45W high-speed charging']
    },
    description: 'Super-speed charging on the road. Features smart IC to auto-detect device requirements and prevent overheating.',
    tags: ['car-charger', 'fast-charging', 'accessories']
  },
  {
    categoryId: 'cat_automotive',
    name: 'Universal Bike Mobile Holder',
    brands: ['Bobo', 'Spigen', 'Portronics', 'Tarkan'],
    priceRange: [499, 1499],
    images: ['https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&q=80&w=600'],
    specs: {
      'Material': ['Reinforced ABS with steel screws', 'Silicon padding anti-vibration'],
      'Clamp Diameter': ['Fits handlebars 22mm - 32mm', 'Mirror mount option included']
    },
    description: 'Ultra-secure jaw grip bicycle/motorcycle phone mount. Keeps your navigation visible and secure through any terrain.',
    tags: ['bike-holder', 'mobile-mount', 'motorcycle']
  },
  {
    categoryId: 'cat_travel',
    name: 'Waterproof Travel Backpack',
    brands: ['Mokobara', 'Safari', 'Skybags', 'American Tourister', 'Wildcraft'],
    priceRange: [1499, 4999],
    images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=600'],
    specs: {
      'Capacity': ['35 Litres', '45 Litres', '30 Litres with laptop sleeve'],
      'Material': ['Water-repellent Polyester', 'Ballistic nylon fabric'],
      'Laptop Size': ['Up to 15.6 inch laptop', 'Up to 17 inch gaming laptop']
    },
    description: 'Perfect companion for weekend getaways and office commutes. Built with breathable mesh shoulder straps and a hidden anti-theft pocket.',
    tags: ['travel-backpack', 'luggage', 'bags']
  },
  {
    categoryId: 'cat_travel',
    name: 'Hard Shell Suitcase Trolley',
    brands: ['American Tourister', 'Skybags', 'Mokobara', 'Safari', 'VIP'],
    priceRange: [2999, 9999],
    images: ['https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?auto=format&fit=crop&q=80&w=600'],
    specs: {
      'Material': ['Polycarbonate shell scratch-resistant', 'ABS lightweight material'],
      'Wheels': ['8-wheel 360 degree spinners', '4-wheel multidirectional spinners'],
      'Lock': ['TSA approved combination lock', 'Standard numbered combination lock']
    },
    description: 'Travel light and secure with this impact-resistant hard shell spinner suitcase. Expandable design provides 15% extra packing capacity.',
    tags: ['trolley', 'suitcase', 'travel-bag']
  },
  {
    categoryId: 'cat_travel',
    name: 'Compression Packing Cubes Set',
    brands: ['House of Quirk', 'Tripped', 'Travel Gear', 'Mokobara'],
    priceRange: [499, 1499],
    images: ['https://images.unsplash.com/photo-1527853787696-f7be74f2e39a?auto=format&fit=crop&q=80&w=600'],
    specs: {
      'Pieces': ['6-piece set (3 cubes + 3 pouches)', '4-piece compression set'],
      'Material': ['Waterproof ripstop nylon + mesh window', 'Polyester fabric with dual zippers']
    },
    description: 'Maximize luggage space. Categorize shirts, pants, underwear, and laundry easily in separate compact cubes.',
    tags: ['packing-cubes', 'travel-organizer', 'packing']
  },
  {
    categoryId: 'cat_travel',
    name: 'Memory Foam Travel Neck Pillow',
    brands: ['Traya', 'Cabeau', 'Travel Blue', 'Solimo'],
    priceRange: [399, 1999],
    images: ['https://images.unsplash.com/photo-1569051138597-d5da0b86b4e3?auto=format&fit=crop&q=80&w=600'],
    specs: {
      'Material': ['High-density memory foam core', 'Breathable velvet washable cover'],
      'Ergonomics': ['360 degree head support hump', 'Flat-back design to prevent neck push']
    },
    description: 'Ergonomic neck pillow for flights and long road trips. Provides optimal support to prevent neck strain and muscle stiffness.',
    tags: ['neck-pillow', 'travel-pillow', 'comfort']
  },
  {
    categoryId: 'cat_travel',
    name: 'Stainless Steel Travel Flask',
    brands: ['Milton', 'Cello', 'Borosil', 'Milton Thermosteel'],
    priceRange: [499, 1499],
    images: ['https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&q=80&w=600'],
    specs: {
      'Capacity': ['1000 ml', '750 ml', '500 ml'],
      'Insulation': ['24 hours hot / cold double-walled', '18 hours cold vacuum insulated']
    },
    description: 'Double-walled vacuum insulated bottle keeps beverages piping hot or icy cold for up to 24 hours. Leak-proof cap doubles as a cup.',
    tags: ['flask', 'insulated-bottle', 'travel-flask']
  },
  {
    categoryId: 'cat_fashion',
    name: 'Printed Cotton Kurta',
    brands: ['Biba', 'W for Woman', 'Libas', 'Anouk', 'Aurelia'],
    priceRange: [799, 2499],
    images: ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=600'],
    specs: {
      'Fabric': ['100% Pure Cotton', 'Rayon linen blend'],
      'Style': ['Anarkali printed style', 'Straight fit floral print'],
      'Sleeve': ['3/4 Sleeves', 'Full regular sleeves']
    },
    description: 'Elegant daily wear floral printed kurta for women. Breathable cotton fabric ensures comfort during hot summer days.',
    tags: ['kurta', 'womens-wear', 'fashion', 'clothing']
  },
  {
    categoryId: 'cat_fashion',
    name: 'Floral A-Line Midi Dress',
    brands: ['Harpa', 'Vero Moda', 'Zara', 'Only', 'Roadster'],
    priceRange: [999, 3999],
    images: ['https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=600'],
    specs: {
      'Length': ['Midi length', 'Maxi dress length'],
      'Fabric': ['Premium Georgette with lining', 'Flowy Viscose Rayon'],
      'Pattern': ['Bohemian Floral Print', 'Solid pastel colors']
    },
    description: 'A stylish and flowy A-line midi dress featuring ruffled sleeves and a tier skirt, perfect for brunches and casual outings.',
    tags: ['dress', 'womens-clothing', 'midi-dress']
  },
  {
    categoryId: 'cat_fashion',
    name: 'Embroidered Smock Top',
    brands: ['Zara', 'Only', 'Vero Moda', 'Harpa'],
    priceRange: [499, 1999],
    images: ['https://images.unsplash.com/photo-1509319117193-57bab727e09d?auto=format&fit=crop&q=80&w=600'],
    specs: {
      'Fabric': ['Linen cotton blend', '100% Cotton cambric'],
      'Fit': ['Regular fit with elasticated cuffs', 'Loose comfort fit']
    },
    description: 'Boho embroidered smock top featuring balloon sleeves and a buttoned front. Pairs beautifully with denim jeans.',
    tags: ['top', 'womens-wear', 'fashion']
  },
  {
    categoryId: 'cat_fashion',
    name: 'High-Rise Skinny Jeans',
    brands: ['Levi\'s', 'Kraus', 'Only', 'Vero Moda', 'Spykar'],
    priceRange: [1299, 3499],
    images: ['https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80&w=600'],
    specs: {
      'Fit': ['Skinny fit', 'Super skinny stretch fit'],
      'Rise': ['High rise waistline', 'Mid rise classic waist'],
      'Length': ['Ankle length', 'Regular length']
    },
    description: 'Stretchable high-rise skinny jeans designed to sculpt and hold your curves. Features 5-pocket styling and metal zipper closure.',
    tags: ['jeans', 'skinny-fit', 'denim']
  },
  {
    categoryId: 'cat_fashion',
    name: 'Banarasi Silk Saree',
    brands: ['Karagiri', 'Mimosa', 'Sabyasachi', 'Nalli'],
    priceRange: [1999, 14999],
    images: ['https://images.unsplash.com/photo-1610030469668-93535c17b6b3?auto=format&fit=crop&q=80&w=600'],
    specs: {
      'Material': ['Art Silk with Zari border', 'Pure Kanjivaram Silk weave'],
      'Length': ['5.5 meters + 0.8 meter blouse piece', '6.2 meters total length']
    },
    description: 'Traditional Banarasi silk saree adorned with intricate gold-toned zari work. Includes matching unstitched blouse fabric.',
    tags: ['saree', 'traditional', 'wedding-wear']
  },
  {
    categoryId: 'cat_fashion',
    name: 'Classic Casual Cotton Shirt',
    brands: ['Peter England', 'Roadster', 'US Polo Assn', 'Wrangler', 'Levis'],
    priceRange: [699, 2499],
    images: ['https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=600'],
    specs: {
      'Fabric': ['100% Premium Cotton', 'Cotton linen breathable weave'],
      'Sleeve': ['Long roll-up sleeves', 'Short summer sleeves'],
      'Pattern': ['Checked pattern casual', 'Solid oxford shirt']
    },
    description: 'A versatile casual button-down shirt. Perfect for smart-casual wear, offering a breathable fit and curved hemline.',
    tags: ['shirt', 'mens-wear', 'casual-shirt']
  },
  {
    categoryId: 'cat_fashion',
    name: 'Slim Fit Cotton Jeans',
    brands: ['Levi\'s', 'Wrangler', 'Spykar', 'Pepe Jeans', 'Roadster'],
    priceRange: [1499, 3999],
    images: ['https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&q=80&w=600'],
    specs: {
      'Fit': ['Slim fit', 'Straight fit comfort'],
      'Material': ['98% Cotton, 2% Elastane stretch', 'Heavyweight denim cotton']
    },
    description: 'Classic 5-pocket denim jeans in a modern slim silhouette. Specially washed to provide a vintage fade look.',
    tags: ['jeans', 'mens-denim', 'slim-fit']
  },
  {
    categoryId: 'cat_fashion',
    name: 'Premium Lifestyle Sneakers',
    brands: ['Nike', 'Adidas', 'Puma', 'Converse', 'Reebok'],
    priceRange: [1999, 8999],
    images: ['https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=600'],
    specs: {
      'Upper': ['Genuine leather + suede accents', 'Breathable canvas classic'],
      'Insole': ['OrthoLite cushioned footbed', 'Standard foam comfort sole']
    },
    description: 'Iconic lifestyle sneakers blending heritage athletic design with modern everyday comfort. High traction vulcanized rubber sole.',
    tags: ['sneakers', 'lifestyle-shoes', 'footwear']
  },
  {
    categoryId: 'cat_fashion',
    name: 'Structured Leather Tote Bag',
    brands: ['Lavie', 'Baggit', 'Lino Perros', 'Caprese', 'Hidesign'],
    priceRange: [999, 3999],
    images: ['https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=600'],
    specs: {
      'Material': ['Premium Faux Leather', 'Vegetable tanned full-grain leather'],
      'Pockets': ['Main zip compartment + 2 inner pockets', 'Back zip pocket + tablet sleeve']
    },
    description: 'Spacious and elegant handbag designed for working professionals. Easily fits a 13-inch laptop, planner, and daily accessories.',
    tags: ['handbag', 'tote', 'womens-bags']
  },
  {
    categoryId: 'cat_home_decor',
    name: 'Abstract Metal Wall Art',
    brands: ['Art Street', 'Safal', 'Home Centre', 'Decorfutures'],
    priceRange: [499, 2499],
    images: ['https://images.unsplash.com/photo-1534349762230-e0cadf78f5da?auto=format&fit=crop&q=80&w=600'],
    specs: {
      'Material': ['Anti-rust wrought iron', 'Hand-painted metal panel'],
      'Dimensions': ['24 x 18 inches', '36 x 24 inches large']
    },
    description: 'Stunning handcrafted metal wall sculpture. Features dynamic geometric shapes and gold metallic finishes to add depth to any living room.',
    tags: ['wall-art', 'wall-decor', 'metal-art']
  },
  {
    categoryId: 'cat_home_decor',
    name: 'Decorative Round Wall Mirror',
    brands: ['Decorfutures', 'Home Centre', 'Ikea', 'Fabindia'],
    priceRange: [999, 4999],
    images: ['https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&q=80&w=600'],
    specs: {
      'Frame': ['Hand-carved distressed wooden frame', 'Gold metal wireframe design'],
      'Diameter': ['20 inches', '24 inches', '30 inches focal mirror']
    },
    description: 'A stylish accent mirror that reflects ambient light to make spaces look larger. Perfect for entryways, bedrooms, or above consoles.',
    tags: ['mirror', 'wall-mirror', 'decor']
  },
  {
    categoryId: 'cat_home_decor',
    name: 'Silent Movement Wall Clock',
    brands: ['Ajanta', 'Casio', 'Titan', 'Seiko'],
    priceRange: [599, 3499],
    images: ['https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?auto=format&fit=crop&q=80&w=600'],
    specs: {
      'Movement': ['Silent quartz sweep movement (no-ticking)', 'Standard step movement'],
      'Display': ['Analog with bold 3D numbers', 'Minimalist metallic dial']
    },
    description: 'A classic and silent wall clock with a clean layout. The sweep mechanism ensures a completely quiet workspace or bedroom.',
    tags: ['clock', 'wall-clock', 'accessories']
  },
  {
    categoryId: 'cat_home_decor',
    name: 'Collage Photo Frame Set',
    brands: ['Solimo', 'Art Street', 'Ikea'],
    priceRange: [399, 1299],
    images: ['https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=600'],
    specs: {
      'Frames Count': ['Set of 8 frames (multiple sizes)', 'Set of 10 collage frames'],
      'Material': ['Engineered wood with acrylic glass', 'Synthetic resin lightweight frames']
    },
    description: 'Preserve your cherished memories. Features wall hangers for both vertical and horizontal display. Includes templates for easy layout planning.',
    tags: ['photo-frames', 'collage', 'decor']
  },
  {
    categoryId: 'cat_home_decor',
    name: 'Artificial Bonsai Plant',
    brands: ['Fourwalls', 'BS AMOR', 'Ikea', 'Solimo'],
    priceRange: [299, 999],
    images: ['https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&q=80&w=600'],
    specs: {
      'Pot': ['White ceramic pot included', 'Black plastic nursery pot'],
      'Height': ['12 inches', '18 inches table size']
    },
    description: 'Lifelike artificial bonsai tree that adds a touch of tranquil greenery without the hassle of watering or sunlight.',
    tags: ['artificial-plant', 'bonsai', 'table-decor']
  },
  {
    categoryId: 'cat_home_decor',
    name: 'Scented Soy Jar Candle',
    brands: ['Miniso', 'Ekam', 'Bath & Body Works', 'Lumina'],
    priceRange: [199, 999],
    images: ['https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&q=80&w=600'],
    specs: {
      'Fragrance': ['French Lavender & Vanilla', 'Midnight Rose & Musk', 'Citrus & Sandalwood'],
      'Burn Time': ['Up to 40 hours continuous', 'Up to 25 hours small jar']
    },
    description: 'Hand-poured natural soy wax candle formulated with essential oils. Emits a clean, smoke-free fragrance that relaxes the mind.',
    tags: ['scented-candle', 'aromatherapy', 'soy-wax']
  },
  {
    categoryId: 'cat_home_decor',
    name: 'Minimalist Desk Table Lamp',
    brands: ['Philips', 'Wipro', 'Ikea', 'Syska'],
    priceRange: [799, 2999],
    images: ['https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=600'],
    specs: {
      'Base': ['Premium solid wood base', 'Weighted matte black metal base'],
      'Bulb': ['Includes 5W warm LED bulb', 'E27 socket compatible']
    },
    description: 'Compact table lamp featuring a linen fabric shade that filters light into a warm, inviting glow. Perfect for nightstands or home offices.',
    tags: ['table-lamp', 'lighting', 'desk-lamp']
  },
  {
    categoryId: 'cat_home_decor',
    name: 'Thermal Blackout Curtains',
    brands: ['Urban Space', 'Home Sizzler', 'Solimo'],
    priceRange: [699, 2499],
    images: ['https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=600'],
    specs: {
      'Material': ['Triple-weave heavy polyester', 'Linen blackout lining'],
      'Size': ['Door: 7 feet (Pack of 2)', 'Window: 5 feet (Pack of 2)']
    },
    description: 'Block out 90% of sunlight and external noise. The thermal insulation properties help keep rooms cooler in summer and warmer in winter.',
    tags: ['curtains', 'blackout', 'home-furnishing']
  },
  {
    categoryId: 'cat_kitchen',
    name: 'Digital Touch Air Fryer',
    brands: ['Philips', 'Havells', 'Inalsa', 'Kent', 'Wonderchef'],
    priceRange: [4999, 11999],
    images: ['https://images.unsplash.com/photo-1621972750749-0fbb1abb7736?auto=format&fit=crop&q=80&w=600'],
    specs: {
      'Capacity': ['4.1 Litres', '5.5 Litres family size'],
      'Programs': ['7 preset touch menus', 'Manual temperature/time knobs'],
      'Technology': ['Rapid Air 360 degree heating', 'TurboAir flow']
    },
    description: 'Fry, bake, grill, and roast with up to 90% less oil. Enjoy crispy texture using the rapid air circulation technology.',
    tags: ['air-fryer', 'appliances', 'cooking', 'healthy']
  },
  {
    categoryId: 'cat_kitchen',
    name: 'Heavy Duty Mixer Grinder',
    brands: ['Preethi', 'Sucheta', 'Philips', 'Bajaj', 'Prestige'],
    priceRange: [2499, 6999],
    images: ['https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?auto=format&fit=crop&q=80&w=600'],
    specs: {
      'Motor': ['750 Watts copper motor', '1000 Watts commercial grade motor'],
      'Jars': ['3 Stainless Steel Jars + Juicer', '3 Jars basic set']
    },
    description: 'Grind tough dry ingredients and blend smoothies effortlessly. Built with overload protectors and vacuum suction feet.',
    tags: ['mixer-grinder', 'grinding', 'blender']
  },
  {
    categoryId: 'cat_kitchen',
    name: 'Automatic Electric Kettle',
    brands: ['Pigeon', 'Kent', 'Prestige', 'Havells', 'Milton'],
    priceRange: [699, 2499],
    images: ['https://images.unsplash.com/photo-1594213112595-61e72e0d3785?auto=format&fit=crop&q=80&w=600'],
    specs: {
      'Capacity': ['1.5 Litres', '1.8 Litres extra large'],
      'Material': ['Food-grade 304 Stainless Steel', 'Borosilicate glass body'],
      'Safety': ['Auto shut-off and boil-dry protection', 'Cool touch outer handle']
    },
    description: 'Boil water for tea, coffee, or instant noodles in under 3 minutes. The cordless base allows easy pouring.',
    tags: ['electric-kettle', 'kettle', 'appliances']
  },
  {
    categoryId: 'cat_kitchen',
    name: 'Anodized Pressure Cooker',
    brands: ['Hawkins', 'Prestige', 'Pigeon', 'Prestige Deluxe'],
    priceRange: [999, 3499],
    images: ['https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&q=80&w=600'],
    specs: {
      'Capacity': ['3 Litres', '5 Litres standard size'],
      'Base': ['Induction & Gas compatible double base', 'Gas stove base only'],
      'Material': ['Hard Anodized Aluminum', 'Polished Stainless Steel']
    },
    description: 'Prepare rice, dal, and curries fast. The hard anodized body is scratch-resistant and heats up evenly.',
    tags: ['cooker', 'pressure-cooker', 'cookware']
  },
  {
    categoryId: 'cat_kitchen',
    name: 'Premium Non-Stick Cookware Set',
    brands: ['Cello', 'Wonderchef', 'Prestige', 'Tefal', 'Nirlon'],
    priceRange: [1499, 4999],
    images: ['https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&q=80&w=600'],
    specs: {
      'Items': ['3 Piece Set (Tawa, Kadai, Fry Pan)', '4 Piece Set with glass lid'],
      'Coating': ['5-layer granite non-stick coating', '3-layer teflon PFOA-free coating']
    },
    description: 'Enjoy oil-free healthy cooking with durable non-stick pans. Features cool-touch bakelite handles.',
    tags: ['cookware-set', 'pan', 'tawa', 'kitchen-tools']
  },
  {
    categoryId: 'cat_kitchen',
    name: 'Opalware Dinner Set',
    brands: ['Larah by Borosil', 'Cello', 'La Opala', 'Corelle'],
    priceRange: [1999, 5999],
    images: ['https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&q=80&w=600'],
    specs: {
      'Pieces': ['35 Piece full dinner set', '18 Piece starter dining set'],
      'Features': ['Bone-ash free, microwave & dishwasher safe', 'Scratch and chip resistant opal glass']
    },
    description: 'Spruce up your dinner table with elegant, lightweight opalware dishes. Spotless white with artistic borders.',
    tags: ['dinner-set', 'crockery', 'plates', 'dining']
  },
  {
    categoryId: 'cat_cosmetics',
    name: 'Foaming Neem Face Wash',
    brands: ['Himalaya', 'Cetaphil', 'Mamaearth', 'Neutrogena', 'Nivea'],
    priceRange: [199, 599],
    images: ['https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=600'],
    specs: {
      'Skin Type': ['All skin types, acne-prone skin', 'Sensitive and dry skin'],
      'Volume': ['150 ml pump bottle', '200 ml economy pack']
    },
    description: 'Purify your skin with neem and turmeric extracts. Gently lifts dirt, sebum, and pollutants to prevent pimples.',
    tags: ['facewash', 'cleanser', 'skincare']
  },
  {
    categoryId: 'cat_cosmetics',
    name: 'Hydro Boost Water Gel Moisturizer',
    brands: ['Neutrogena', 'Nivea', 'Cetaphil', 'Clinique', 'Ponds'],
    priceRange: [299, 1499],
    images: ['https://images.unsplash.com/photo-1608248597481-496100c80836?auto=format&fit=crop&q=80&w=600'],
    specs: {
      'Key Ingredient': ['Hyaluronic Acid + Glycerin', 'Aloe Vera extract'],
      'Texture': ['Ultra-lightweight oil-free water gel', 'Rich nourishing cream']
    },
    description: 'Instantly quenches dry skin and locks in moisture for up to 72 hours. Non-comedogenic formula doesn\'t clog pores.',
    tags: ['moisturizer', 'cream', 'skincare']
  },
  {
    categoryId: 'cat_cosmetics',
    name: 'Dry-Touch Sunscreen SPF 50',
    brands: ['Neutrogena', 'La Roche-Posay', 'Lacto Calamine', 'Minimalist', 'Lotus'],
    priceRange: [399, 999],
    images: ['https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=600'],
    specs: {
      'SPF Factor': ['SPF 50+ PA+++ broad spectrum', 'SPF 60 PA++++ ultra shield'],
      'Finish': ['Matte finish, non-greasy, water resistant', 'Dewy glowing sunscreen']
    },
    description: 'Protect your skin against harmful UVA/UVB rays. The dry-touch formula absorbs instantly with zero white cast.',
    tags: ['sunscreen', 'sun-protection', 'skincare']
  },
  {
    categoryId: 'cat_cosmetics',
    name: 'Keratin Smooth Shampoo',
    brands: ['L\'Oreal', 'Head & Shoulders', 'Dove', 'Tresemme', 'Mamaearth'],
    priceRange: [299, 899],
    images: ['https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&q=80&w=600'],
    specs: {
      'Hair Type': ['Dry, frizzy, treated hair', 'Thinning hair control'],
      'Ingredients': ['Keratin protein + Argan Oil', 'Onion seed oil extract']
    },
    description: 'Infused with keratin to restore protein gaps in your hair shaft. Gives you salon-smooth, frizz-free hair for up to 3 days.',
    tags: ['shampoo', 'haircare', 'cleanser']
  },
  {
    categoryId: 'cat_cosmetics',
    name: 'Rapid Hair Dryer 2000W',
    brands: ['Philips', 'Havells', 'Nova', 'Dyson', 'Syska'],
    priceRange: [799, 3999],
    images: ['https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=600'],
    specs: {
      'Power': ['1200 Watts portable', '2000 Watts professional ionic motor'],
      'Speeds': ['3 Heat & 2 Speed settings with cool shot', '2 Speed basic knob']
    },
    description: 'Dry your hair safely without heat damage. The built-in ionic conditioner prevents static and adds a glossy shine.',
    tags: ['hair-dryer', 'grooming', 'appliances']
  },
  {
    categoryId: 'cat_cosmetics',
    name: 'Ceramic Hair Straightener',
    brands: ['Philips', 'Havells', 'Vega', 'Nova'],
    priceRange: [999, 3999],
    images: ['https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=600'],
    specs: {
      'Plates': ['Keratin-infused ceramic plates', 'Wide tourmaline plates'],
      'Temperature': ['Up to 210 degrees quick heating', 'Variable 120-230 degrees']
    },
    description: 'Style your hair straight or in waves with smooth ceramic plates. Heats up in 60 seconds and has auto cut-off safety.',
    tags: ['straightener', 'hair-styler', 'grooming']
  },
  {
    categoryId: 'cat_oral_care',
    name: 'Mint Fresh Toothpaste',
    brands: ['Colgate', 'Sensodyne', 'Pepsodent', 'Dabur Red', 'Meswak'],
    priceRange: [99, 299],
    images: ['https://images.unsplash.com/photo-1606811971618-4486d14f3f99?auto=format&fit=crop&q=80&w=600'],
    specs: {
      'Benefits': ['Cavity protection & whitening', 'Sensitivity relief & gum protection'],
      'Volume': ['Pack of 2 (150g each)', 'Pack of 3 (100g each)']
    },
    description: 'Fight cavities and maintain fresh breath all day long. Packed with natural mint extracts and protective fluoride.',
    tags: ['toothpaste', 'oral-hygiene', 'freshness']
  },
  {
    categoryId: 'cat_oral_care',
    name: 'CrossAction Toothbrush Pack',
    brands: ['Oral-B', 'Colgate', 'Sensodyne', 'Solimo'],
    priceRange: [99, 399],
    images: ['https://images.unsplash.com/photo-1606811971618-4486d14f3f99?auto=format&fit=crop&q=80&w=600'],
    specs: {
      'Bristles': ['Medium angled cross bristles', 'Super soft charcoal-infused bristles'],
      'Pack Size': ['Pack of 4', 'Pack of 6 family saver']
    },
    description: 'Removes up to 99% of plaque in hard-to-reach areas. Features soft rubber tongue cleaners on the back.',
    tags: ['toothbrush', 'brush', 'oral-care']
  },
  {
    categoryId: 'cat_oral_care',
    name: 'Sonic Rechargeable Electric Toothbrush',
    brands: ['Oral-B', 'Philips Sonicare', 'Caresmith', 'Colgate'],
    priceRange: [999, 4999],
    images: ['https://images.unsplash.com/photo-1606811971618-4486d14f3f99?auto=format&fit=crop&q=80&w=600'],
    specs: {
      'Vibrations': ['20,000 strokes per min sonic', '35,000 micro-brushes per min smart'],
      'Modes': ['Clean, Sensitive, Whitening modes', '2 basic vibration settings'],
      'Timer': ['2-minute smart timer with quadrant pulse', 'Auto stop timer']
    },
    description: 'Elevate your brushing experience. Sonic pulses whip up toothpaste micro-bubbles to wash plaque away between teeth.',
    tags: ['electric-toothbrush', 'smart-brush', 'appliances']
  },
  {
    categoryId: 'cat_home_essentials',
    name: 'Spin Mop bucket System',
    brands: ['Gala', 'Spotzero by Milton', 'Scotch-Brite'],
    priceRange: [999, 2499],
    images: ['https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=600'],
    specs: {
      'Material': ['Durable virgin plastic bucket, steel wringer', 'Compact plastic wringer'],
      'Refills': ['2 microfiber refills included', '3 extra plush absorbent refills']
    },
    description: 'Clean your floors without bending. The smart 360-degree spin mechanism wrings out excess water with minimal effort.',
    tags: ['mop', 'cleaning', 'spin-mop', 'home-care']
  },
  {
    categoryId: 'cat_home_essentials',
    name: 'Plastic Pedal Trash Dustbin',
    brands: ['Solimo', 'Kuber Industries', 'Cello', 'Joyo'],
    priceRange: [299, 1299],
    images: ['https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=600'],
    specs: {
      'Capacity': ['10 Litres', '15 Litres kitchen size', '7 Litres bathroom size'],
      'Material': ['BPA-free durable plastic', 'Stainless steel outer body']
    },
    description: 'Hands-free waste disposal. The foot pedal mechanism is smooth and keeps odors locked inside the lid.',
    tags: ['dustbin', 'trash-can', 'cleaning-tools']
  },
  {
    categoryId: 'cat_home_essentials',
    name: 'Foldable Wardrobe Cloth Organizer',
    brands: ['Solimo', 'Joyo', 'House of Quirk', 'Kuber Industries'],
    priceRange: [299, 1499],
    images: ['https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=600'],
    specs: {
      'Slots': ['Set of 3 boxes with dividers', 'Pack of 6 underwear organizers'],
      'Material': ['Breathable non-woven fabric with cardboard support', 'Waterproof nylon fabric']
    },
    description: 'De-clutter your closets and drawers. Fits shirts, socks, innerwear, and accessories in neat separate compartments.',
    tags: ['organizer', 'storage-box', 'wardrobe']
  },
  {
    categoryId: 'cat_grocery',
    name: 'Chakki Atta Wheat Flour',
    brands: ['Aashirvaad', 'Fortune', 'Pillsbury', 'Organic Tattva'],
    priceRange: [249, 499],
    images: ['https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=600'],
    specs: {
      'Weight': ['5 Kg pack', '10 Kg family saver pack'],
      'Type': ['100% Whole Wheat Chakki Atta', 'Multi-grain high fiber atta']
    },
    description: 'Absorbs more water to keep rotis soft and fluffy for a longer duration. Made from premium wheat grains.',
    tags: ['atta', 'flour', 'grocery', 'staples']
  },
  {
    categoryId: 'cat_grocery',
    name: 'Basmati Rice Premium Extra Long',
    brands: ['India Gate', 'Daawat', 'Kohinoor', 'Fortune'],
    priceRange: [499, 1299],
    images: ['https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=600'],
    specs: {
      'Grain Length': ['8.4mm extra long grain', '7.4mm standard grain'],
      'Weight': ['5 Kg pack', '1 Kg trial pack']
    },
    description: 'Aromatic, elongated basmati rice, perfect for biryanis, pulaos, and special occasions. Aged to perfection.',
    tags: ['rice', 'basmati', 'staples', 'grocery']
  },
  {
    categoryId: 'cat_grocery',
    name: 'Toor Arhar Dal Unpolished',
    brands: ['Tata Sampann', 'Organic Tattva', 'Fortune', 'Solimo'],
    priceRange: [129, 249],
    images: ['https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=600'],
    specs: {
      'Weight': ['1 Kg', '500g pack'],
      'Type': ['Unpolished premium arhar dal', 'Organic certified toor dal']
    },
    description: 'Unpolished split pigeon peas that retain their natural nutrients, dietary fibers, and authentic taste.',
    tags: ['dal', 'pulses', 'grocery']
  },
  {
    categoryId: 'cat_grocery',
    name: 'Premium Blended Cooking Oil',
    brands: ['Fortune', 'Saffola', 'Dhara', 'Sundrop'],
    priceRange: [149, 799],
    images: ['https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=600'],
    specs: {
      'Volume': ['1 Litre pouch', '5 Litre jar with handle'],
      'Blend': ['Refined Rice Bran & Soyabean Oil', 'Pure Mustard cold pressed']
    },
    description: 'Low-absorb and cholesterol-reducing daily cooking oil. Enriched with Vitamins A and D to support family heart health.',
    tags: ['cooking-oil', 'oil', 'staples']
  },
  {
    categoryId: 'cat_grocery',
    name: 'Premium California Almonds',
    brands: ['Happilo', 'Tata Sampann', 'Nutraj', 'Solimo'],
    priceRange: [299, 1299],
    images: ['https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=600'],
    specs: {
      'Weight': ['500g zip-lock bag', '200g small jar', '1 Kg mega pack'],
      'Type': ['100% Raw California Almonds', 'Roasted & salted almonds']
    },
    description: 'Crispy and highly nutritious California almonds. Loaded with Vitamin E, fibers, and healthy fats.',
    tags: ['almonds', 'dry-fruits', 'snacks']
  },
  {
    categoryId: 'cat_furniture_bedding',
    name: 'King Size Engineered Wood Bed',
    brands: ['DeckUp', 'Solimo', 'Sleepyhead', 'Nilkamal'],
    priceRange: [9999, 24999],
    images: ['https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&q=80&w=600'],
    specs: {
      'Size': ['King Size (78 x 72 inches)', 'Queen Size (72 x 60 inches)'],
      'Storage': ['Box storage inside bed board', 'No storage minimalist style'],
      'Material': ['Engineered wood with wenge finish', 'Solid sheesham hardwood']
    },
    description: 'A sturdy and elegant wooden bed frame. Features box storage compartments to organize blankets and pillows.',
    tags: ['bed', 'furniture', 'bedroom']
  },
  {
    categoryId: 'cat_furniture_bedding',
    name: 'Orthopedic Memory Foam Mattress',
    brands: ['Sleepyhead', 'Wakefit', 'Kurlon', 'Duroflex'],
    priceRange: [4999, 14999],
    images: ['https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&q=80&w=600'],
    specs: {
      'Thickness': ['6 Inches height', '8 Inches thick deluxe'],
      'Firmness': ['Medium-Firm body support', 'Dual-comfort reversible'],
      'Material': ['High resilience foam + memory foam layer', 'Pocket springs with latex top']
    },
    description: 'Doctor recommended orthopedic mattress that contours to your body shape, relieving pressure points and back pains.',
    tags: ['mattress', 'bedding', 'ortho-mattress']
  },
  {
    categoryId: 'cat_furniture_bedding',
    name: 'Ergonomic Mesh Office Chair',
    brands: ['Green Soul', 'Savya Home', 'Apex', 'Nilkamal'],
    priceRange: [2999, 11999],
    images: ['https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&q=80&w=600'],
    specs: {
      'Armrest': ['2D Adjustable armrests', 'Fixed nylon armrests'],
      'Support': ['High-back with lumbar adjust', 'Mid-back basic chair'],
      'Base': ['Heavy duty chrome wheelbase', 'Nylon star base']
    },
    description: 'Stay focused and pain-free during long work-from-home shifts. Features adjustable lumbar support, seat height, and tilting locking.',
    tags: ['office-chair', 'ergonomic', 'study-chair']
  },
  {
    categoryId: 'cat_furniture_bedding',
    name: 'Double Cotton Floral Bedsheet',
    brands: ['Swayam', 'Solimo', 'Bombay Dyeing', 'Fabindia'],
    priceRange: [499, 1999],
    images: ['https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&q=80&w=600'],
    specs: {
      'Thread Count': ['144 TC cotton fabric', '250 TC premium satin cotton'],
      'Size': ['Double King: 108 x 90 inches with 2 pillow covers', 'Single Bed sheet with 1 cover']
    },
    description: 'Breathable, skin-friendly double bed sheet woven in high-quality cotton fibers. Bright floral patterns that stay vibrant after washes.',
    tags: ['bedsheet', 'cotton-sheets', 'bedding']
  },
  {
    categoryId: 'cat_kids_baby',
    name: 'Unisex Cotton Rompers Pack',
    brands: ['Hopscotch', 'Mothercare', 'MiniKlub', 'LuvLap'],
    priceRange: [399, 1299],
    images: ['https://images.unsplash.com/photo-1515488042361-404e9250afef?auto=format&fit=crop&q=80&w=600'],
    specs: {
      'Fabric': ['100% Organic soft cotton', 'Cotton knit jersey stretch'],
      'Pack size': ['Pack of 3 snaps rompers', 'Pack of 5 bodysuits']
    },
    description: 'Ensure absolute comfort for your little one. Features nickel-free crotch snap buttons for hassle-free diaper changes.',
    tags: ['baby-clothes', 'romper', 'clothing', 'kids']
  },
  {
    categoryId: 'cat_kids_baby',
    name: 'Anti-Rash Baby Diapers Pants',
    brands: ['Pampers', 'MamyPoko', 'Huggies', 'LuvLap'],
    priceRange: [399, 1499],
    images: ['https://images.unsplash.com/photo-1515488042361-404e9250afef?auto=format&fit=crop&q=80&w=600'],
    specs: {
      'Size': ['Medium (M) - 62 counts', 'Large (L) - 54 counts', 'Small (S) - 78 counts'],
      'Absorption': ['Up to 12 hours gel absorption lock', 'Super dry layer standard']
    },
    description: 'Diaper pants enriched with soothing Aloe Vera lotion to keep baby skin dry, healthy, and rash-free.',
    tags: ['diapers', 'baby-care', 'essential']
  },
  {
    categoryId: 'cat_kids_baby',
    name: 'Augmented Reality Educational Globe',
    brands: ['Shifu Orboot', 'Einstein Box', 'Lego', 'Funskool'],
    priceRange: [799, 2999],
    images: ['https://images.unsplash.com/photo-1515488042361-404e9250afef?auto=format&fit=crop&q=80&w=600'],
    specs: {
      'Age Group': ['4 to 10 years old kids', '3 to 6 years early learning'],
      'Features': ['Companion App with 3D interactions', 'Basic geography print map']
    },
    description: 'Interactive STEM learning toy. Children scan the globe using tablet/phone apps to discover animals, history, monuments, and cultures in 3D.',
    tags: ['educational-toys', 'stem', 'globe', 'kids-toys']
  },
  {
    categoryId: 'cat_phones',
    name: 'Premium Flagship 5G Smartphone',
    brands: ['Apple', 'Samsung', 'OnePlus', 'Xiaomi', 'realme'],
    priceRange: [19999, 129999],
    images: ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=600'],
    specs: {
      'Display': ['6.7" OLED (120Hz Dynamic LTPO)', '6.5" Super AMOLED 90Hz'],
      'Processor': ['Snapdragon 8 Gen 3 Octa-Core', 'Aura Silicon A17 Pro Bionic'],
      'Camera': ['50MP + 12MP + 10MP Triple Camera', '200MP Quad Zoom Lens']
    },
    description: 'Next-generation 5G connectivity, professional zoom cameras, and ultra-high-resolution dynamic OLED displays.',
    tags: ['smartphone', 'mobile', '5g', 'electronics']
  },
  {
    categoryId: 'cat_laptops',
    name: 'Professional Coding Laptop',
    brands: ['HP', 'Dell', 'Lenovo', 'Asus', 'Acer'],
    priceRange: [34999, 99999],
    images: ['https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&q=80&w=600'],
    specs: {
      'Processor': ['Intel Core i5 13th Gen', 'AMD Ryzen 7 Octa-core', 'Intel Core i7 13th Gen'],
      'RAM/SSD': ['16GB DDR5 RAM + 512GB NVMe SSD', '8GB RAM + 512GB SSD'],
      'Screen': ['15.6" IPS Full HD Anti-glare', '14.0" WUXGA OLED Thin bezel']
    },
    description: 'Fast compiler, responsive keyboard, and silent thermal performance. Ideal for code compilation, data analysis, and multitasking.',
    tags: ['laptop', 'notebook', 'coding', 'electronics']
  },
  {
    categoryId: 'cat_audio',
    name: 'Wireless ANC Earbuds Pro',
    brands: ['Sony', 'boAt', 'Apple', 'JBL', 'OnePlus'],
    priceRange: [999, 24999],
    images: ['https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&q=80&w=600'],
    specs: {
      'Noise Cancelling': ['Active Noise Cancellation (up to 45dB)', 'Environmental Noise Cancel (ENx)'],
      'Battery Life': ['Up to 40 hours total with charging case', 'Up to 30 hours charging case'],
      'Waterproof': ['IPX5 sweat and water resistant', 'IPX4 splashproof']
    },
    description: 'Immerse in crystal-clear acoustics and heavy bass. Dual studio-grade mics block ambient sound during business calls.',
    tags: ['earbuds', 'wireless-audio', 'headphones']
  },
  {
    categoryId: 'cat_audio',
    name: 'Portable Bluetooth Speaker HD',
    brands: ['JBL', 'Marshall', 'Sony', 'boAt', 'JBL Professional'],
    priceRange: [1999, 19999],
    images: ['https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&q=80&w=600'],
    specs: {
      'Driver Size': ['40mm driver + dual passive radiators', 'Full range dual speaker array'],
      'Playtime': ['Up to 12 hours rechargeable battery', 'Up to 20 hours powerhouse play']
    },
    description: 'Room-filling spatial audio with punchy deep bass. Small rugged design is dust and splashproof, perfect for outdoor pool parties.',
    tags: ['bluetooth-speaker', 'speaker', 'audio']
  },
  {
    categoryId: 'cat_wearables',
    name: 'Smart Watch Fitness Tracker',
    brands: ['Noise', 'Apple', 'Samsung', 'Fitbit', 'boAt'],
    priceRange: [1999, 39999],
    images: ['https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&q=80&w=600'],
    specs: {
      'Display': ['1.85" HD Always-on Display', '1.4" round AMOLED display'],
      'Calling': ['Bluetooth calling with built-in mic/speaker', 'Notification alert sync only']
    },
    description: 'Track daily workouts, heartbeat rhythm, blood oxygen levels, and receive phone calls directly from your wrist.',
    tags: ['smartwatch', 'tracker', 'wearable']
  },
  {
    categoryId: 'cat_electronics',
    name: 'Mechanical Gaming Keyboard',
    brands: ['Keychron', 'Logitech', 'Redgear', 'Zebronics'],
    priceRange: [1499, 9999],
    images: ['https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&q=80&w=600'],
    specs: {
      'Keys': ['Tactile Blue switches mechanical', 'Quiet Red switches mechanical'],
      'Backlight': ['RGB backlight with 18 effects', 'Solid blue LED lighting'],
      'Layout': ['TKL Tenkeyless 87 keys layout', 'Full size 104 keys layout']
    },
    description: 'Durable and highly tactile mechanical keyboard for optimal gaming inputs and pleasant, fast typing experience.',
    tags: ['keyboard', 'mechanical-keyboard', 'gaming-keyboard']
  },
  {
    categoryId: 'cat_electronics',
    name: 'Ergonomic Wireless Mouse',
    brands: ['Logitech', 'Razer', 'Dell', 'Lenovo'],
    priceRange: [499, 9999],
    images: ['https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&q=80&w=600'],
    specs: {
      'DPI': ['Adjustable 800 - 4000 DPI sensor', '8000 DPI high-speed laser sensor'],
      'Connection': ['2.4GHz USB receiver + Bluetooth', '2.4GHz wireless dongle only']
    },
    description: 'Contoured hand-fit wireless mouse with silent clicks. Reduces wrist strain and improves tracking accuracy.',
    tags: ['mouse', 'wireless-mouse', 'accessories']
  }
];

const generateDynamicProducts = (): Product[] => {
  const productsList: Product[] = [];
  const editions = [
    "Edition Alpha", "Model Pro", "Series X", "Classic", "Premium", 
    "Elite", "Ultra", "Lite", "Edition II", "Standard", 
    "Prime", "Signature", "Advanced", "Comfort Plus", "Smart Edition", 
    "Daily Pack", "Essential", "Deluxe", "Sport Fit", "Home Edition",
    "Carbon Edition", "Neo", "Max", "Air", "Active",
    "Carbon Fiber", "Stripe Edition", "Gold Edition", "Midnight", "Studio",
    "Vibe", "Sonic"
  ];

  for (const temp of TEMPLATES) {
    // Generate 32 products per template to hit ~1000 items (31 templates * 32 products = 992 products)
    for (let i = 1; i <= 32; i++) {
      const brand = temp.brands[i % temp.brands.length];
      const id = `prod_dyn_${temp.categoryId}_${temp.name.toLowerCase().replace(/[^a-z0-9]+/g, '_')}_${i}`;
      
      const editionText = editions[(i - 1) % editions.length];
      const title = `${brand} ${temp.name} (${editionText})`;
      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const nameAbbr = temp.name.replace(/[^a-zA-Z ]/g, '').split(' ').filter(Boolean).map(w => w[0]).join('').toUpperCase();
      const sku = `${temp.categoryId.substring(4, 8).toUpperCase()}-${nameAbbr}-${brand.substring(0, 3).toUpperCase()}-${i}00`;
      
      // Calculate dynamic price
      const pricePaise = (temp.priceRange[0] + ((i * 17) % (temp.priceRange[1] - temp.priceRange[0]))) * 100;
      const compareAtPaise = i % 3 !== 0 ? Math.floor(pricePaise * 1.25) : undefined;
      
      const averageRating = parseFloat((4.0 + ((i * 3) % 11) / 10).toFixed(1));
      const totalReviews = 10 + (i * 7) % 190;
      
      const specEntries: Record<string, string> = {};
      for (const [key, valArray] of Object.entries(temp.specs)) {
        specEntries[key] = valArray[i % valArray.length];
      }
      specEntries['Warranty'] = '1 Year Manufacturer Brand Warranty';
      specEntries['Model Year'] = '2025';

      const stock = 10 + (i * 13) % 90;
      
      const variants = [
        { id: `${id}_v_std`, label: 'Standard Edition', sku: `${sku}-STD`, priceDeltaPaise: 0, stock: Math.floor(stock / 2) },
        { id: `${id}_v_dlx`, label: 'Deluxe Pack', sku: `${sku}-DLX`, priceDeltaPaise: Math.floor(pricePaise * 0.15), stock: Math.floor(stock / 2) }
      ];

      const tags = [...temp.tags, brand.toLowerCase(), temp.categoryId.substring(4)];

      const prod: Product = {
        id,
        title,
        slug,
        sku,
        brand,
        categoryId: temp.categoryId,
        description: `${temp.description} Crafted with high-grade components by ${brand}, this ${temp.name.toLowerCase()} offers outstanding value, longevity, and modern aesthetics.`,
        specs: specEntries,
        images: [
          {
            publicId: `${id}_main`,
            url: temp.images[0],
            alt: title,
            sortOrder: 1
          }
        ],
        pricePaise,
        compareAtPaise,
        stock,
        variants,
        tags,
        ratingSummary: { averageRating, totalReviews },
        status: 'published',
        seo: {
          title: `${title} - Buy Online | BZARO`,
          description: `Shop ${title} online at best prices. High performance, durable design, 1-year brand warranty. Order now!`
        },
        createdAt: new Date(Date.now() - i * 3600000).toISOString(),
        updatedAt: new Date().toISOString()
      };

      productsList.push(prod);
    }
  }

  return productsList;
};

export const SEED_PRODUCTS: Product[] = [
  ...staticProducts,
  ...generateDynamicProducts()
];

export const SEED_COUPONS: Coupon[] = [
  {
    id: 'coup_first500',
    code: 'FIRST500',
    type: 'fixed',
    value: 50000, // Rs. 500 off
    minSubtotal: 200000, // Minimum order Rs. 2,000
    usageLimit: 100,
    usageCount: 15,
    active: true,
    startsAt: new Date(Date.now() - 86400000 * 10).toISOString(), // 10 days ago
    endsAt: new Date(Date.now() + 86400000 * 30).toISOString(), // 30 days from now
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'coup_festive10',
    code: 'FESTIVE10',
    type: 'percent',
    value: 10, // 10% off
    minSubtotal: 500000, // Minimum order Rs. 5,000
    maxDiscount: 200000, // Max discount Rs. 2,000
    usageLimit: 200,
    usageCount: 42,
    active: true,
    startsAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    endsAt: new Date(Date.now() + 86400000 * 15).toISOString(), // 15 days from now
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'coup_expired',
    code: 'EXPIRED50',
    type: 'percent',
    value: 50,
    minSubtotal: 100000,
    usageLimit: 10,
    usageCount: 10,
    active: true,
    startsAt: new Date(Date.now() - 86400000 * 20).toISOString(),
    endsAt: new Date(Date.now() - 86400000 * 5).toISOString(), // ended 5 days ago
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const SEED_PROMOTIONS: Promotion[] = [
  {
    id: 'promo_hero',
    title: 'Redefine Visual Precision: The AuraBook Pro 14 with M3',
    placement: 'hero',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=1200',
    destination: '/products/aurabook-pro-14',
    startsAt: new Date().toISOString(),
    endsAt: new Date(Date.now() + 86400000 * 30).toISOString(),
    active: true,
    sortOrder: 1,
  },
  {
    id: 'promo_laptops',
    title: 'Power Meets Play: Next-Gen Gaming Laptops',
    placement: 'hero',
    image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&q=80&w=1200',
    destination: '/products?category=cat_laptops',
    startsAt: new Date().toISOString(),
    endsAt: new Date(Date.now() + 86400000 * 30).toISOString(),
    active: true,
    sortOrder: 2,
  },
  {
    id: 'promo_phones',
    title: 'Flagship Power, Everyday Value: iPhones & Androids',
    placement: 'hero',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=1200',
    destination: '/products?category=cat_phones',
    startsAt: new Date().toISOString(),
    endsAt: new Date(Date.now() + 86400000 * 30).toISOString(),
    active: true,
    sortOrder: 3,
  },
  {
    id: 'promo_music',
    title: 'Unleash Your Resonance: Acoustic Guitars',
    placement: 'hero',
    image: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&q=80&w=1200',
    destination: '/products?category=cat_music',
    startsAt: new Date().toISOString(),
    endsAt: new Date(Date.now() + 86400000 * 30).toISOString(),
    active: true,
    sortOrder: 4,
  },
  {
    id: 'promo_deal1',
    title: 'Flicker-Free Design: Lumina Desk Lamp Flat 25% Off',
    placement: 'deal_strip',
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=600',
    destination: '/products/lumina-minimalist-desk-lamp',
    startsAt: new Date().toISOString(),
    endsAt: new Date(Date.now() + 86400000 * 15).toISOString(),
    active: true,
    sortOrder: 5,
  },
];
