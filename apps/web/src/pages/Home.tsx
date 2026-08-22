import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { formatINR } from '../components/CartDrawer';
import { ArrowRight, Sparkles, Shield, Gift, Volume2, Loader2, Star, ChevronLeft, ChevronRight } from 'lucide-react';

const HERO_DESCRIPTIONS: Record<string, string> = {
  'promo_hero': 'Experience next-generation silicon engineering, customized Liquid OLED displays, and spatial acoustic arrays designed to flow audio around you.',
  'promo_laptops': 'Discover top-tier performance with Lenovo LOQ, ASUS TUF, and HP Victus. Loaded with Nvidia RTX graphics, optimized for peak gameplay and productivity.',
  'promo_phones': 'Upgrade to flagship performance. Get the latest iPhone 15 or premium Android smartphones with high-resolution cameras and fast charging.',
  'promo_music': 'Start your musical journey today. Shop professional dreadnought acoustic guitars from Yamaha and Kadence starting under 10,000 INR.'
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

  // Fetch trending products (top 4 published products)
  const { data: trendingProducts, isLoading: productsLoading } = useQuery({
    queryKey: ['products-trending'],
    queryFn: async () => {
      const res = await api.get('/products', { params: { limit: 4 } });
      return res.data.data;
    }
  });

  // Fetch categories
  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories-home'],
    queryFn: async () => {
      const res = await api.get('/categories');
      return res.data.data.categories;
    }
  });

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

      {/* 2. Category Grid */}
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
          <div className="h-48 flex items-center justify-center">
            <Loader2 className="animate-spin text-brand-600" size={32} />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories?.filter((c: any) => !c.parentId).map((cat: any) => (
              <div 
                key={cat.id}
                onClick={() => navigate(`/products?category=${cat.id}`)}
                className="group relative h-64 rounded-xl overflow-hidden border border-slate-200/80 cursor-pointer shadow hover:shadow-md hover:border-slate-300 transition-all duration-300"
              >
                <img 
                  src={cat.image || 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=400'} 
                  alt={cat.name} 
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-102 transition-transform duration-500 brightness-[0.8] group-hover:brightness-[0.75]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-slate-950/10 to-transparent" />
                
                <div className="absolute bottom-0 left-0 p-6 space-y-1 z-15">
                  <h3 className="text-lg font-bold text-white tracking-wide">{cat.name}</h3>
                  <p className="text-xs text-slate-200 line-clamp-1">{cat.description}</p>
                </div>
              </div>
            ))}
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
            {trendingProducts?.map((prod: any) => (
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
