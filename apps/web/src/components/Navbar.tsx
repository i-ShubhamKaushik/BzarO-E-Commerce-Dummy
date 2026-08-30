import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import type { RootState } from '../app/store';
import { toggleCartDrawer, toggleAuthModal, toggleMobileMenu } from '../features/ui/uiSlice';
import { clearCredentials } from '../features/auth/authSlice';
import { useCart } from '../hooks/useCart';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { BzarOLogo } from './BzarOLogo';
import { 
  ShoppingBag, Search, Heart, User, LogOut, LayoutDashboard, 
  MapPin, ShieldAlert, Menu, X, ArrowRight, UserCheck
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const mobileMenuOpen = useSelector((state: RootState) => state.ui.mobileMenuOpen);
  
  const { cart } = useCart();
  const [searchVal, setSearchVal] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Sync search input with URL search param
  useEffect(() => {
    const q = searchParams.get('q');
    if (q) setSearchVal(q);
  }, [searchParams]);

  // Fetch active categories for dynamic menu
  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await api.get('/categories');
      return res.data?.data?.categories || [];
    }
  });

  // Filter out unwanted categories (Style/Lifestyle, Oral Care, Home Essentials, Kids)
  const filteredCategories = React.useMemo(() => {
    if (!categoriesData || !Array.isArray(categoriesData)) return [];
    return categoriesData.filter((cat: any) => {
      if (!cat) return false;
      const name = (cat.name || '').toLowerCase();
      const id = (cat.id || '').toLowerCase();
      const slug = (cat.slug || '').toLowerCase();
      
      const isStyle = name === 'style' || slug === 'style' || id.includes('style') || name.includes('lifestyle');
      const isOralCare = name.includes('oral care') || slug.includes('oral-care') || id.includes('oral_care');
      const isHomeEssentials = name.includes('home essentials') || slug.includes('home-essentials') || id.includes('home_essentials');
      const isKids = name.includes('kids') || slug.includes('kids') || id.includes('kids');
      
      return !(isStyle || isOralCare || isHomeEssentials || isKids);
    });
  }, [categoriesData]);

  const cartItemsCount = cart.items.reduce((sum: number, item: any) => sum + item.qty, 0);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchVal.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchVal)}`);
      dispatch(toggleMobileMenu(false));
    }
  };

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
      dispatch(clearCredentials());
      navigate('/');
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  const triggerLogin = () => {
    dispatch(toggleAuthModal({ open: true, tab: 'login' }));
  };

  return (
    <nav className="sticky top-0 z-40 bg-white/80 border-b border-slate-200/80 backdrop-blur-md transition-all duration-300 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Mobile menu trigger */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => dispatch(toggleMobileMenu(!mobileMenuOpen))}
              className="text-slate-600 hover:text-slate-900 p-2 hover:bg-slate-100 rounded-lg"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
 
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center gap-2 group">
              <BzarOLogo className="w-8 h-8 group-hover:scale-105 transition-transform" />
              <span className="text-lg font-bold tracking-wider text-slate-900 font-sans group-hover:text-brand-600 transition-colors">
                BzarO
              </span>
            </Link>
          </div>
 
          {/* Desktop Categories Menu */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/products" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
              All Products
            </Link>
            {filteredCategories?.slice(0, 3).map((cat: any) => (
              <Link
                key={cat.id}
                to={`/products?category=${cat.id}`}
                className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
              >
                {cat.name}
              </Link>
            ))}
          </div>
 
          {/* Search Bar */}
          <form 
            onSubmit={handleSearchSubmit}
            className="hidden sm:flex flex-1 max-w-md relative"
          >
            <Search className="absolute left-3.5 top-2.5 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Search products, brands, tags..."
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-full pl-10 pr-4 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all duration-200"
            />
          </form>
 
          {/* Actions Menu */}
          <div className="flex items-center gap-2 sm:gap-4">
            
            {/* Search toggler for mobile screen */}
            <Link 
              to="/products"
              className="sm:hidden text-slate-600 hover:text-slate-900 p-2 hover:bg-slate-100 rounded-lg"
            >
              <Search size={20} />
            </Link>
 
            {/* Wishlist */}
            <Link
              to={isAuthenticated ? '/profile/wishlist' : '#'}
              onClick={(e) => {
                if (!isAuthenticated) {
                  e.preventDefault();
                  triggerLogin();
                }
              }}
              className="text-slate-600 hover:text-slate-900 p-2 hover:bg-slate-100 rounded-lg relative"
            >
              <Heart size={20} />
            </Link>
 
            {/* Cart Trigger */}
            <button
              onClick={() => {
                if (isAuthenticated) {
                  dispatch(toggleCartDrawer(true));
                } else {
                  triggerLogin();
                }
              }}
              className="text-slate-600 hover:text-slate-900 p-2 hover:bg-slate-100 rounded-lg relative"
            >
              <ShoppingBag size={20} />
              {cartItemsCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 bg-brand-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center font-mono ring-2 ring-white">
                  {cartItemsCount}
                </span>
              )}
            </button>
 
            {/* Divider */}
            <div className="hidden sm:block w-px h-5 bg-slate-200" />
 
            {/* Account Panel */}
            <div className="relative">
              {isAuthenticated ? (
                <>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-1.5 text-sm font-medium text-slate-700 hover:text-slate-900 p-1 px-2.5 hover:bg-slate-100 rounded-lg border border-transparent hover:border-slate-200"
                  >
                    <User size={18} className="text-brand-600" />
                    <span className="hidden lg:inline">{user?.name.split(' ')[0]}</span>
                  </button>
 
                  {/* Dropdown Card */}
                  {dropdownOpen && (
                    <>
                      <div className="fixed inset-0 z-30" onClick={() => setDropdownOpen(false)} />
                      <div className="absolute right-0 mt-2.5 w-56 rounded-xl border border-slate-200 bg-white shadow-xl z-40 p-1 animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="px-3 py-2 border-b border-slate-100 text-xs text-slate-500 mb-1">
                          <p className="font-semibold text-slate-900 truncate">{user?.name}</p>
                          <p className="truncate mt-0.5">{user?.email}</p>
                        </div>
                        
                        <Link
                          to="/profile"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors"
                        >
                          <UserCheck size={16} />
                          My Profile
                        </Link>
                        
                        <Link
                          to="/profile/orders"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors"
                        >
                          <MapPin size={16} />
                          Order History
                        </Link>
 
                        {user?.role === 'admin' && (
                          <Link
                            to="/admin"
                            onClick={() => setDropdownOpen(false)}
                            className="flex items-center gap-2 px-3 py-2 text-sm text-brand-600 hover:text-brand-700 hover:bg-slate-50 rounded-lg transition-colors"
                          >
                            <LayoutDashboard size={16} />
                            Admin Panel
                          </Link>
                        )}
 
                        <button
                          onClick={() => {
                            setDropdownOpen(false);
                            handleLogout();
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors text-left"
                        >
                          <LogOut size={16} />
                          Logout
                        </button>
                      </div>
                    </>
                  )}
                </>
              ) : (
                <button
                  onClick={triggerLogin}
                  className="btn-primary py-1.5 px-4 text-xs font-semibold"
                >
                  Sign In
                </button>
              )}
            </div>
 
          </div>
 
        </div>
      </div>
 
      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-panel border-b border-slate-200 p-4 space-y-4 animate-in slide-in-from-top duration-300">
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="absolute left-3.5 top-2.5 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Search products..."
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              className="w-full !pl-10 input-field"
            />
          </form>
 
          <div className="space-y-2 flex flex-col">
            <Link
              to="/products"
              onClick={() => dispatch(toggleMobileMenu(false))}
              className="px-3 py-2 rounded-lg text-sm text-slate-700 hover:bg-slate-50"
            >
              All Products
            </Link>
            {filteredCategories?.map((cat: any) => (
              <Link
                key={cat.id}
                to={`/products?category=${cat.id}`}
                onClick={() => dispatch(toggleMobileMenu(false))}
                className="px-3 py-2 rounded-lg text-sm text-slate-700 hover:bg-slate-50"
              >
                {cat.name}
              </Link>
            ))}
            {isAuthenticated && user?.role === 'admin' && (
              <Link
                to="/admin"
                onClick={() => dispatch(toggleMobileMenu(false))}
                className="px-3 py-2 rounded-lg text-sm text-brand-600 hover:bg-slate-50 font-semibold"
              >
                Admin Panel
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
