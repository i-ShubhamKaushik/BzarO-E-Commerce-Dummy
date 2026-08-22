import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { QueryClientProvider } from '@tanstack/react-query';
import { store } from './app/store';
import type { RootState } from './app/store';
import { queryClient } from './app/queryClient';
import { setCredentials, clearCredentials, setInitialized } from './features/auth/authSlice';
import { toggleAuthModal } from './features/ui/uiSlice';
import { api } from './lib/api';

// Components
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { CartDrawer } from './components/CartDrawer';

// Pages
import { Home } from './pages/Home';
import { Products } from './pages/Products';
import { ProductDetail } from './pages/ProductDetail';
import { Checkout } from './pages/Checkout';
import { CheckoutSuccess } from './pages/CheckoutSuccess';
import { Profile } from './pages/Profile';
import { Admin } from './pages/Admin';

// Global Layout Wrapper
const MainLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-950 selection:bg-brand-500/10 selection:text-brand-700">
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
      <Footer />
      
      {/* Global Overlays */}
      <AuthModal />
      <CartDrawer />
    </div>
  );
};

// Route Guard for Authenticated Customers
const RequireAuth: React.FC = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, isInitialized } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      // If initialized but not authenticated, trigger login sheet
      dispatch(toggleAuthModal({ open: true, tab: 'login' }));
    }
  }, [isInitialized, isAuthenticated, dispatch]);

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-brand-600">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-brand-600" />
      </div>
    );
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
};

// Route Guard for Administrators
const RequireAdmin: React.FC = () => {
  const { user, isAuthenticated, isInitialized } = useSelector((state: RootState) => state.auth);

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-brand-600">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-brand-600" />
      </div>
    );
  }

  return isAuthenticated && user?.role === 'admin' ? <Outlet /> : <Navigate to="/" replace />;
};

// Static Policy Dummy Pages
const StaticPolicyPage: React.FC<{ title: string; content: string }> = ({ title, content }) => {
  return (
    <div className="max-w-2xl mx-auto py-12 space-y-6">
      <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{title}</h1>
      <div className="text-sm text-slate-600 leading-relaxed space-y-4 font-normal">
        <p>{content}</p>
        <p>This is a portfolio demonstration page representing e-commerce policies. No business liabilities are claimed or implied.</p>
      </div>
    </div>
  );
};

// App Inner component to run session bootstrap
const AppInner: React.FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Session bootstrap check
    const checkSession = async () => {
      try {
        const res = await api.get('/auth/me');
        dispatch(setCredentials(res.data.data.user));
      } catch (err) {
        dispatch(clearCredentials());
      } finally {
        dispatch(setInitialized());
      }
    };

    checkSession();

    // Listen for global unauthorized events to reset credentials
    const handleUnauthorized = () => {
      dispatch(clearCredentials());
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => {
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
    };
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          {/* Public Routes */}
          <Route index element={<Home />} />
          <Route path="products" element={<Products />} />
          <Route path="products/:slug" element={<ProductDetail />} />
          <Route path="search" element={<Products />} />
          
          {/* Static Support Pages */}
          <Route 
            path="about" 
            element={<StaticPolicyPage title="About BzarO" content="BzarO represents a boutique digital design project showcasing premium components, single-flight refresh authentication models, and dual-database fallback architecture." />} 
          />
          <Route 
            path="contact" 
            element={<StaticPolicyPage title="Contact BzarO Support" content="Get in touch via demo tickets or mock emails. Support queue is processed periodically." />} 
          />
          <Route 
            path="shipping" 
            element={<StaticPolicyPage title="Shipping & Logistics Policy" content="All orders are processed and shipped in test mode. No physical items will be dispatched or delivered." />} 
          />
          <Route 
            path="returns" 
            element={<StaticPolicyPage title="Returns & Refunds" content="Since this is a simulated platform, no payments are captured. Return requests can be initiated for demo walkthrough purposes." />} 
          />
          <Route 
            path="privacy" 
            element={<StaticPolicyPage title="Privacy Shield Policy" content="We prioritize database privacy. No real credit card details are collected or logged." />} 
          />
          <Route 
            path="terms" 
            element={<StaticPolicyPage title="Terms of Service" content="This platform is purely for simulation and interview review. Commercial utilization of the source code is restricted." />} 
          />

          {/* Protected Customer Routes */}
          <Route element={<RequireAuth />}>
            <Route path="checkout" element={<Checkout />} />
            <Route path="checkout/success" element={<CheckoutSuccess />} />
            <Route path="profile" element={<Profile />} />
            <Route path="profile/orders" element={<Profile />} />
            <Route path="profile/wishlist" element={<Profile />} />
            <Route path="profile/addresses" element={<Profile />} />
          </Route>

          {/* Protected Admin Routes */}
          <Route element={<RequireAdmin />}>
            <Route path="admin" element={<Admin />} />
          </Route>

          {/* 404 Route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AppInner />
      </QueryClientProvider>
    </Provider>
  );
};

export default App;
