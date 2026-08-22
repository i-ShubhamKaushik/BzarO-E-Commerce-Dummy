import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { formatINR } from '../components/CartDrawer';
import { 
  Filter, RotateCcw, Search, ChevronLeft, ChevronRight, 
  Loader2, Star, SlidersHorizontal, ArrowUpDown
} from 'lucide-react';

export const Products: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const isSearchPage = location.pathname === '/search';
  const queryKeyword = searchParams.get('q') || '';
  
  // Local states for sliders/filters to avoid excessive API requests during sliding
  const [minPriceInput, setMinPriceInput] = useState(searchParams.get('minPrice') || '');
  const [maxPriceInput, setMaxPriceInput] = useState(searchParams.get('maxPrice') || '');

  // Extract filters from URL
  const selectedCategory = searchParams.get('category') || '';
  const selectedSort = searchParams.get('sort') || 'newest';
  const selectedPage = parseInt(searchParams.get('page') || '1');
  const inStockOnly = searchParams.get('inStock') === 'true';
  const selectedRating = parseFloat(searchParams.get('rating') || '0');
  
  // Extract multiple brands
  const selectedBrands = searchParams.getAll('brand');

  // Fetch categories for sidebar filter
  const { data: categories } = useQuery({
    queryKey: ['categories-list'],
    queryFn: async () => {
      const res = await api.get('/categories');
      return res.data.data.categories;
    }
  });

  // Unique list of brands for checklist (we can extract this from catalog or hardcode realistic brands)
  const availableBrands = ['Aura', 'SoundWave', 'Infinity', 'Lumina'];

  // Fetch products matching parameters
  const { data: result, isLoading, error } = useQuery({
    queryKey: ['products-list', location.search, isSearchPage],
    queryFn: async () => {
      const endpoint = isSearchPage ? '/search' : '/products';
      
      // Parse parameters
      const params: any = {
        page: selectedPage,
        limit: 8,
        sort: selectedSort,
      };

      if (isSearchPage) params.q = queryKeyword;
      if (selectedCategory) params.category = selectedCategory;
      if (inStockOnly) params.inStock = 'true';
      if (selectedRating > 0) params.rating = selectedRating;
      
      const minP = parseInt(searchParams.get('minPrice') || '');
      const maxP = parseInt(searchParams.get('maxPrice') || '');
      if (!isNaN(minP)) params.minPrice = minP * 100; // Rs. to Paise
      if (!isNaN(maxP)) params.maxPrice = maxP * 100;

      // Handle brand array
      if (selectedBrands.length > 0) {
        params.brand = selectedBrands;
      }

      const res = await api.get(endpoint, { params });
      return {
        products: res.data.data,
        meta: res.data.meta,
      };
    }
  });

  // Sync inputs when URL changes
  useEffect(() => {
    setMinPriceInput(searchParams.get('minPrice') || '');
    setMaxPriceInput(searchParams.get('maxPrice') || '');
  }, [searchParams]);

  // Update URL search parameters helper
  const updateUrlParam = (key: string, value: string | string[], resetPage = true) => {
    const newParams = new URLSearchParams(searchParams);
    
    if (resetPage) {
      newParams.set('page', '1');
    }

    if (Array.isArray(value)) {
      newParams.delete(key);
      value.forEach(val => newParams.append(key, val));
    } else if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }

    setSearchParams(newParams);
  };

  const handleBrandChange = (brand: string, checked: boolean) => {
    let updatedBrands = [...selectedBrands];
    if (checked) {
      updatedBrands.push(brand);
    } else {
      updatedBrands = updatedBrands.filter(b => b !== brand);
    }
    updateUrlParam('brand', updatedBrands);
  };

  const handlePriceApply = (e: React.FormEvent) => {
    e.preventDefault();
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', '1');

    if (minPriceInput) {
      newParams.set('minPrice', minPriceInput);
    } else {
      newParams.delete('minPrice');
    }

    if (maxPriceInput) {
      newParams.set('maxPrice', maxPriceInput);
    } else {
      newParams.delete('maxPrice');
    }

    setSearchParams(newParams);
  };

  const handleClearAll = () => {
    setSearchParams(newParams => {
      const q = newParams.get('q') || '';
      const cleared = new URLSearchParams();
      if (q) cleared.set('q', q);
      return cleared;
    });
    setMinPriceInput('');
    setMaxPriceInput('');
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > (result?.meta?.totalPages || 1)) return;
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', newPage.toString());
    setSearchParams(newParams);
  };

  const totalPages = result?.meta?.totalPages || 1;
  const products = result?.products || [];

  return (
    <div className="flex flex-col lg:flex-row gap-8 pb-16">
      
      {/* 1. Sidebar Filters panel */}
      <div className="w-full lg:w-64 shrink-0 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
            <Filter size={16} className="text-brand-600" />
            <span>Filters</span>
          </div>
          <button 
            onClick={handleClearAll}
            className="text-xs text-slate-500 hover:text-brand-600 flex items-center gap-1 transition-colors"
          >
            <RotateCcw size={12} />
            Reset all
          </button>
        </div>

        {/* Category Facets */}
        <div className="space-y-2.5">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Categories</h4>
          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            <button
              onClick={() => updateUrlParam('category', '')}
              className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                !selectedCategory 
                  ? 'bg-slate-100 text-brand-600' 
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
              }`}
            >
              All Categories
            </button>
            {categories?.map((cat: any) => (
              <button
                key={cat.id}
                onClick={() => updateUrlParam('category', cat.id)}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors truncate ${
                  selectedCategory === cat.id 
                    ? 'bg-slate-100 text-brand-600' 
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Brand Checklist */}
        <div className="space-y-2.5 border-t border-slate-200 pt-5">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Brands</h4>
          <div className="space-y-2 text-xs">
            {availableBrands.map(brand => (
              <label key={brand} className="flex items-center gap-2.5 text-slate-600 hover:text-slate-900 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={selectedBrands.includes(brand)}
                  onChange={(e) => handleBrandChange(brand, e.target.checked)}
                  className="rounded border-slate-300 bg-white text-brand-600 focus:ring-brand-500 focus:ring-offset-white accent-brand-600 w-4 h-4"
                />
                <span>{brand}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Price limits */}
        <div className="space-y-2.5 border-t border-slate-200 pt-5">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Price Range (₹)</h4>
          <form onSubmit={handlePriceApply} className="space-y-3">
            <div className="flex gap-2 items-center">
              <input
                type="number"
                placeholder="Min"
                value={minPriceInput}
                onChange={(e) => setMinPriceInput(e.target.value)}
                className="w-full input-field px-2 py-1.5 text-xs text-center font-mono"
              />
              <span className="text-slate-400 text-xs">-</span>
              <input
                type="number"
                placeholder="Max"
                value={maxPriceInput}
                onChange={(e) => setMaxPriceInput(e.target.value)}
                className="w-full input-field px-2 py-1.5 text-xs text-center font-mono"
              />
            </div>
            <button
              type="submit"
              className="w-full btn-secondary py-1.5 text-xs font-bold"
            >
              Apply Range
            </button>
          </form>
        </div>

        {/* Rating threshold */}
        <div className="space-y-2.5 border-t border-slate-200 pt-5">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Customer Rating</h4>
          <div className="space-y-1">
            {[4, 3, 2].map(stars => (
              <button
                key={stars}
                onClick={() => updateUrlParam('rating', selectedRating === stars ? '' : stars.toString())}
                className={`w-full flex items-center justify-between p-2 rounded-lg text-xs transition-all ${
                  selectedRating === stars 
                    ? 'bg-slate-100 text-brand-600 font-semibold' 
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={12} 
                      className={i < stars ? 'text-amber-500 fill-current stroke-[1.5]' : 'text-slate-300'} 
                    />
                  ))}
                  <span className="ml-1 mt-0.5">& Up</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Availability */}
        <div className="space-y-2.5 border-t border-slate-200 pt-5">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Availability</h4>
          <label className="flex items-center gap-2.5 text-xs text-slate-600 hover:text-slate-900 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => updateUrlParam('inStock', e.target.checked ? 'true' : '')}
              className="rounded border-slate-300 bg-white text-brand-600 focus:ring-brand-500 focus:ring-offset-white accent-brand-600 w-4 h-4"
            />
            <span>In Stock Only</span>
          </label>
        </div>

      </div>

      {/* 2. Main products display panel */}
      <div className="flex-1 space-y-6">
        
        {/* Sorting and Count metadata */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <h1 className="text-lg font-bold text-slate-900 tracking-tight">
              {isSearchPage ? `Search results for "${queryKeyword}"` : 'Product Catalogue'}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Showing {products.length} of {result?.meta?.total || 0} products
            </p>
          </div>

          <div className="flex items-center gap-2 self-stretch sm:self-auto">
            <ArrowUpDown size={14} className="text-slate-400 shrink-0" />
            <select
              value={selectedSort}
              onChange={(e) => updateUrlParam('sort', e.target.value)}
              className="flex-1 sm:w-48 bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-750 focus:outline-none focus:border-brand-500 cursor-pointer"
            >
              <option value="newest">Newest Arrivals</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Top Customer Rated</option>
            </select>
          </div>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="h-96 flex items-center justify-center flex-col gap-2">
            <Loader2 className="animate-spin text-brand-600" size={32} />
            <p className="text-xs text-slate-500">Loading products list...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="h-96 flex flex-col items-center justify-center text-center gap-4 border border-dashed border-slate-250 rounded-xl py-12 bg-white">
            <SlidersHorizontal size={32} className="text-slate-400" />
            <div>
              <h3 className="text-sm font-bold text-slate-900">No products found</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-xs font-normal">
                Try widening your price range, toggling off filters, or trying a different search keyword.
              </p>
            </div>
            <button 
              onClick={handleClearAll}
              className="btn-secondary py-1.5 px-4 text-xs font-bold"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {products.map((prod: any) => (
                <div 
                  key={prod.id}
                  onClick={() => navigate(`/products/${prod.slug}`)}
                  className="group glass-card rounded-xl overflow-hidden cursor-pointer flex flex-col h-full bg-white relative"
                >
                  {/* Image */}
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

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 pt-8 border-t border-slate-200">
                <button
                  onClick={() => handlePageChange(selectedPage - 1)}
                  disabled={selectedPage === 1}
                  className="btn-secondary p-2 disabled:opacity-30 disabled:pointer-events-none"
                >
                  <ChevronLeft size={16} />
                </button>
                
                <span className="text-xs text-slate-600 font-semibold">
                  Page {selectedPage} of {totalPages}
                </span>

                <button
                  onClick={() => handlePageChange(selectedPage + 1)}
                  disabled={selectedPage === totalPages}
                  className="btn-secondary p-2 disabled:opacity-30 disabled:pointer-events-none"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </>
        )}

      </div>

    </div>
  );
};
