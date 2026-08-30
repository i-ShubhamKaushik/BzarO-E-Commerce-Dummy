import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { formatINR } from '../components/CartDrawer';
import { 
  ArrowRight, Sparkles, Shield, Gift, Volume2, Loader2, Star, ChevronLeft, ChevronRight,
  Laptop, Headphones, Smartphone, Watch, Gem, 
  Music, Utensils, Dumbbell, Car, Briefcase, Shirt, Bed, PenTool, Smile, 
  Heart, ClipboardList, ShoppingBag, Tag 
} from 'lucide-react';

const HERO_DESCRIPTIONS: Record<string, string> = {
  'promo_hero': 'Experience next-generation silicon engineering, customized Liquid OLED displays, and spatial acoustic arrays designed to flow audio around you.',
  'promo_laptops': 'Discover top-tier performance with Lenovo LOQ, ASUS TUF, and HP Victus. Loaded with Nvidia RTX graphics, optimized for peak gameplay and productivity.',
  'promo_phones': 'Upgrade to flagship performance. Get the latest iPhone 15 or premium Android smartphones with high-resolution cameras and fast charging.',
  'promo_music': 'Start your musical journey today. Shop professional dreadnought acoustic guitars from Yamaha and Kadence starting under 10,000 INR.'
};

const getCategoryIcon = (slug: string) => {
  const mapping: Record<string, React.ComponentType<any>> = {
    'electronics': Laptop,
    'audio': Headphones,
    'smartphones': Smartphone,
    'wearables': Watch,
    'home-living': Bed,
    'laptops': Laptop,
    'lifestyle-accessories': Gem,
    'cosmetics': Sparkles,
    'musical-instruments': Music,
    'kitchen-dining': Utensils,
    'sports-fitness': Dumbbell,
    'automotive': Car,
    'travel-luggage': Briefcase,
    'fashion-wardrobe': Shirt,
    'home-decor': Bed,
    'oral-care': Smile,
    'home-essentials': ClipboardList,
    'grocery-daily-needs': ShoppingBag,
    'furniture-bedding': Bed,
    'kids-baby': Heart,
    'stationery-office': PenTool,
  };
  return mapping[slug] || Tag;
};

export const Home: React.FC = () => {
  const navigate = useNavigate();

  // Fetch active promotions
  const { data: promotions } = useQuery({
    queryKey: ['promotions'],
    queryFn: async () => {
      try {
        const res = await api.get('/promotions');
        return res.data.data.promotions;
      } catch {
        // Fallback mock promotions
        return [
          {
            id: 'promo_hero',
            title: 'Redefine Visual Precision: AuraBook Pro 14"',
            placement: 'hero',
            image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=1200',
            destination: '/products/aurabook-pro-14'
          }
        ];
      }
    }
  });

  // Fetch trending products (top 100 published products to filter down to 40)
  const { data: trendingProducts, isLoading: productsLoading } = useQuery({
    queryKey: ['products-trending'],
    queryFn: async () => {
      const res = await api.get('/products', { params: { limit: 100 } });
      return res.data?.data || [];
    }
  });

  // Filter out products belonging to removed categories, remove duplicates, and slice to 40 items
  const filteredProducts = React.useMemo(() => {
    if (!trendingProducts || !Array.isArray(trendingProducts)) return [];
    
    const seen = new Set<string>();
    
    return trendingProducts
      .filter((prod: any) => {
        if (!prod || !prod.id) return false;
        if (seen.has(prod.id)) return false;
        seen.add(prod.id);
        
        // Filter out products belonging to the removed categories
        const catId = prod.categoryId?.toLowerCase() || '';
        const isStyle = catId.includes('style') || catId.includes('lifestyle');
        const isOralCare = catId.includes('oral_care');
        const isHomeEssentials = catId.includes('home_essentials');
        const isKids = catId.includes('kids');
        
        if (isStyle || isOralCare || isHomeEssentials || isKids) {
          return false;
        }
        return true;
      })
      .slice(0, 40);
  }, [trendingProducts]);

  // Fetch categories
  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories-home'],
    queryFn: async () => {
      const res = await api.get('/categories');
      return res.data?.data?.categories || [];
    }
  });

  // Filter categories according to requirements (no duplicates, valid image URLs, no repeated images, remove unwanted categories)
  const filteredCategories = React.useMemo(() => {
    if (!categories || !Array.isArray(categories)) return [];
    const seenIds = new Set<string>();
    const seenImages = new Set<string>();
    
    return categories.filter((cat: any) => {
      if (!cat) return false;
      
      // 1. Remove duplicate categories by ID
      const catId = (cat.id || '').toString();
      if (seenIds.has(catId)) return false;
      seenIds.add(catId);
      
      // Preserve top-level categories only
      if (cat.parentId) return false;
      
      // 2. Remove categories without a valid image URL
      if (!cat.image || typeof cat.image !== 'string' || cat.image.trim() === '') return false;
      
      const isValidUrl = cat.image.startsWith('http://') || cat.image.startsWith('https://');
      if (!isValidUrl) return false;
      
      // 3. Remove categories using duplicate/repeated images
      if (seenImages.has(cat.image)) return false;
      seenImages.add(cat.image);

      // 4. Remove unwanted categories (Style/Lifestyle, Oral Care, Home Essentials, Kids)
      const name = (cat.name || '').toLowerCase();
      const id = (cat.id || '').toLowerCase();
      const slug = (cat.slug || '').toLowerCase();
      
      const isStyle = name === 'style' || slug === 'style' || id.includes('style') || name.includes('lifestyle');
      const isOralCare = name.includes('oral care') || slug.includes('oral-care') || id.includes('oral_care');
      const isHomeEssentials = name.includes('home essentials') || slug.includes('home-essentials') || id.includes('home_essentials');
      const isKids = name.includes('kids') || slug.includes('kids') || id.includes('kids');
      
      if (isStyle || isOralCare || isHomeEssentials || isKids) {
        return false;
      }
      
      return true;
    });
  }, [categories]);

  // Hero Carousel State
  const [currentSlide, setCurrentSlide] = React.useState(0);

  // Filter promotions for hero placement
  const heroPromotions = React.useMemo(() => {
    const list = promotions?.filter((p: any) => p.placement === 'hero') || [];
    return list.length > 0 ? list : [
      {
        id: 'promo_hero',
        title: 'Redefine Visual Precision: AuraBook Pro 14"',
        image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=1200',
        destination: '/products/aurabook-pro-14'
      }
    ];
  }, [promotions]);

  // Auto-slide effect
  React.useEffect(() => {
    if (heroPromotions.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroPromotions.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [heroPromotions.length]);

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % heroPromotions.length);
  };

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + heroPromotions.length) % heroPromotions.length);
  };

  return (
    <div className="space-y-16 pb-16 bg-transparent">
      
      {/* 1. Hero Campaign Banner Carousel */}
      <div className="relative h-[480px] w-full rounded-2xl overflow-hidden border border-slate-200 group bg-white shadow-sm">
        
        {heroPromotions.map((promo: any, idx: number) => {
          const isActive = idx === currentSlide;
          const desc = HERO_DESCRIPTIONS[promo.id] || "Discover handpicked, premium devices engineered for performance, beauty, and longevity.";
          
          return (
            <div 
              key={promo.id || idx}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                isActive ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              <img 
                src={promo.image} 
                alt={promo.title} 
                className="absolute inset-0 w-full h-full object-cover brightness-[0.95] contrast-[1.02]"
              />
              
              {/* Premium Light Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-white via-white/50 to-transparent" />
              
              <div className="absolute inset-y-0 left-0 flex flex-col justify-center px-8 sm:px-16 max-w-xl space-y-6 z-25">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 border border-brand-100 text-brand-700 text-xs font-semibold uppercase tracking-wider self-start">
                  <Sparkles size={12} />
                  Trending Selection
                </div>
                
                <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
                  {promo.title}
                </h1>
                
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
                  {desc}
                </p>

                <div className="flex gap-4 pt-2">
                  <Link 
                    to={promo.destination}
                    className="btn-primary py-3 px-6 text-sm font-semibold flex items-center gap-2"
                  >
                    Discover Details
                    <ArrowRight size={16} />
                  </Link>
                  <Link 
                    to="/products"
                    className="btn-secondary py-3 px-6 text-sm font-semibold"
                  >
                    Browse All
                  </Link>
                </div>
              </div>
            </div>
          );
        })}

        {/* Navigation Controls (Visible on hover of container) */}
        {heroPromotions.length > 1 && (
          <>
            <button 
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-white/90 hover:bg-white text-slate-800 border border-slate-200 shadow transition-all opacity-0 group-hover:opacity-100 hover:scale-105"
              aria-label="Previous Slide"
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-white/90 hover:bg-white text-slate-800 border border-slate-200 shadow transition-all opacity-0 group-hover:opacity-100 hover:scale-105"
              aria-label="Next Slide"
            >
              <ChevronRight size={20} />
            </button>

            {/* Indicator Dots */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
              {heroPromotions.map((_: any, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    idx === currentSlide ? 'w-6 bg-brand-600' : 'w-2 bg-slate-300 hover:bg-slate-400'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* 2. Category Icon Navigation */}
      <div className="space-y-6">
        <div className="flex items-end justify-between">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">Browse by Category</h2>
            <p className="text-xs sm:text-sm text-slate-500 font-normal">Discover handpicked, premium products engineered for beauty and longevity.</p>
          </div>
          <Link to="/products" className="text-xs sm:text-sm text-brand-600 hover:text-brand-700 font-bold flex items-center gap-1">
            View Catalogue
            <ArrowRight size={14} />
          </Link>
        </div>

        {categoriesLoading ? (
          <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-3 pt-1 animate-pulse">
            {[1, 2, 3, 4, 5, 6].map((idx) => (
              <div 
                key={idx} 
                className="flex flex-col items-center space-y-2 min-w-[80px] sm:min-w-[96px] shrink-0"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-slate-200" />
                <div className="h-3 w-12 sm:w-16 bg-slate-200 rounded" />
              </div>
            ))}
          </div>
        ) : (
          <div className="w-full overflow-hidden">
            <div 
              className="flex gap-4 sm:gap-6 md:gap-8 overflow-x-auto pb-3 pt-1 justify-start md:justify-center md:flex-wrap lg:flex-nowrap"
              role="list"
              aria-label="Category navigation"
            >
              {filteredCategories.map((cat: any) => {
                const IconComponent = getCategoryIcon(cat.slug);
                return (
                  <button
                    key={cat.id}
                    onClick={() => navigate(`/products?category=${cat.id}`)}
                    className="flex flex-col items-center space-y-2 min-w-[80px] sm:min-w-[96px] shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 rounded-xl p-2 transition-all duration-200 hover:bg-slate-100/80 active:bg-slate-200/60 group"
                    role="listitem"
                    aria-label={cat.name}
                  >
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-slate-100 group-hover:bg-white border border-slate-200 flex items-center justify-center text-slate-600 group-hover:text-brand-600 transition-colors shadow-xs group-hover:shadow-sm">
                      <IconComponent size={22} className="stroke-[1.5]" />
                    </div>
                    <span className="text-xs sm:text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors text-center truncate w-full max-w-[84px] sm:max-w-[100px]">
                      {cat.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 3. Promotional Strip Banner */}
      <div className="rounded-xl overflow-hidden bg-white border border-slate-200/80 p-8 sm:p-12 relative flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
        <div className="absolute top-0 right-0 w-48 h-48 bg-brand-500/2 rounded-full blur-3xl -z-10" />
        
        <div className="space-y-2 text-center md:text-left max-w-xl">
          <span className="text-xs bg-brand-50 border border-brand-200 text-brand-700 px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">
            Limited Time Deal
          </span>
          <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 pt-1">
            Flicker-Free Eye Care: Lumina desk lamp flat 25% discount
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 font-normal">
            Engineered with Sand-Blasted Anodized Aluminum, step-less rotary dimming, and flicker-free LED light panels to reduce study fatigue.
          </p>
        </div>

        <Link 
          to="/products/lumina-minimalist-desk-lamp"
          className="btn-primary py-3 px-6 text-sm shrink-0 whitespace-nowrap"
        >
          Claim Deal
        </Link>
      </div>

      {/* 4. Trending Grid */}
      <div className="space-y-6">
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">Trending Arrivals</h2>
          <p className="text-xs sm:text-sm text-slate-500 font-normal">Our best-selling devices, verified by authentic customer evaluations.</p>
        </div>

        {productsLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(idx => (
              <div key={idx} className="h-80 rounded-xl bg-slate-100 animate-pulse border border-slate-200" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts?.map((prod: any) => (
              <div 
                key={prod.id}
                onClick={() => navigate(`/products/${prod.slug}`)}
                className="group glass-card rounded-xl overflow-hidden cursor-pointer flex flex-col h-full relative"
              >
                {/* Product Image */}
                <div className="aspect-square bg-white border-b border-slate-100 relative overflow-hidden shrink-0">
                  <img 
                    src={prod.images[0]?.url || 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=300'} 
                    alt={prod.title} 
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                  />
                  {prod.compareAtPaise && (
                    <div className="absolute top-3 left-3 bg-brand-600 text-white text-[10px] uppercase font-extrabold tracking-wider px-2 py-0.5 rounded shadow-sm">
                      Sale
                    </div>
                  )}
                  {prod.stock <= 0 && (
                    <div className="absolute inset-0 bg-slate-100/70 backdrop-blur-xs flex items-center justify-center">
                      <span className="text-xs font-bold uppercase tracking-wider text-red-700 px-3 py-1 bg-red-50 border border-red-200 rounded-lg">
                        Out of Stock
                      </span>
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="p-4 flex flex-col justify-between flex-1 space-y-3 bg-white">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider font-mono">
                      {prod.brand}
                    </span>
                    <h3 className="text-sm font-semibold text-slate-900 truncate group-hover:text-brand-600 transition-colors mt-0.5">
                      {prod.title}
                    </h3>
                    
                    {/* Stars */}
                    <div className="flex items-center gap-1 mt-1 text-xs text-amber-500">
                      <Star size={12} fill="currentColor" className="stroke-[1.5]" />
                      <span className="font-bold text-slate-700 mt-0.5">{prod.ratingSummary.averageRating}</span>
                      <span className="text-slate-400 text-[10px] mt-0.5">({prod.ratingSummary.totalReviews})</span>
                    </div>
                  </div>

                  <div className="flex items-baseline justify-between pt-1 border-t border-slate-50 mt-2">
                    <div className="flex items-baseline gap-2">
                      <span className="text-sm font-bold text-slate-950">
                        {formatINR(prod.pricePaise)}
                      </span>
                      {prod.compareAtPaise && (
                        <span className="text-xs text-slate-400 line-through">
                          {formatINR(prod.compareAtPaise)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
