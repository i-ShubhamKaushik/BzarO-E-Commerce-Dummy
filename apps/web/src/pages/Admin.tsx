import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import { formatINR } from '../components/CartDrawer';
import { 
  TrendingUp, ShoppingBag, PackageCheck, AlertCircle, 
  Plus, Edit2, Archive, Trash2, Check, X, RefreshCw,
  Tag, SlidersHorizontal, Loader2, ArrowRightLeft, FileCheck,
  Users, ClipboardList, ShieldAlert, BarChart3, Download, Eye, Ban, ShieldCheck, ChevronLeft, ChevronRight
} from 'lucide-react';

export const Admin: React.FC = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'categories' | 'orders' | 'reviews' | 'coupons' | 'users' | 'audit-logs'>('dashboard');

  // Pagination states
  const [userPage, setUserPage] = useState(1);
  const [userSearch, setUserSearch] = useState('');
  const [userStatusFilter, setUserStatusFilter] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('');

  const [orderPage, setOrderPage] = useState(1);
  
  const [auditPage, setAuditPage] = useState(1);
  const [auditActionFilter, setAuditActionFilter] = useState('');
  const [auditEntityTypeFilter, setAuditEntityTypeFilter] = useState('');

  // Products CRUD form states
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [prodTitle, setProdTitle] = useState('');
  const [prodSku, setProdSku] = useState('');
  const [prodBrand, setProdBrand] = useState('');
  const [prodCategory, setProdCategory] = useState('');
  const [prodPrice, setProdPrice] = useState(1000);
  const [prodComparePrice, setProdComparePrice] = useState('');
  const [prodStock, setProdStock] = useState(10);
  const [prodDescription, setProdDescription] = useState('');
  const [prodImageUrl, setProdImageUrl] = useState('');

  // Categories CRUD states
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [catName, setCatName] = useState('');
  const [catDescription, setCatDescription] = useState('');
  const [catImage, setCatImage] = useState('');
  const [catSortOrder, setCatSortOrder] = useState(0);

  // Inventory adjustment state
  const [adjustingProductId, setAdjustingProductId] = useState<string | null>(null);
  const [adjustStockVal, setAdjustStockVal] = useState(5);

  // Review moderation modal reason state
  const [moderatingReview, setModeratingReview] = useState<any | null>(null);
  const [moderationReason, setModerationReason] = useState('Approved by moderation');
  const [moderationAction, setModerationAction] = useState<'approved' | 'rejected'>('approved');

  // Coupon CRUD states
  const [showCouponForm, setShowCouponForm] = useState(false);
  const [editingCouponId, setEditingCouponId] = useState<string | null>(null);
  const [coupCode, setCoupCode] = useState('');
  const [coupType, setCoupType] = useState<'fixed' | 'percent'>('fixed');
  const [coupValue, setCoupValue] = useState(500);
  const [coupMinSubtotal, setCoupMinSubtotal] = useState(2000);
  const [coupLimit, setCoupLimit] = useState(100);
  const [coupActive, setCoupActive] = useState(true);

  // Detailed drawers/modals
  const [viewingUser, setViewingUser] = useState<any | null>(null);
  const [viewingOrder, setViewingOrder] = useState<any | null>(null);
  const [viewingAuditLog, setViewingAuditLog] = useState<any | null>(null);

  // Analytics Date Ranges
  const [analyticsDays, setAnalyticsDays] = useState<'7' | '30' | '90'>('30');

  // Queries
  const { data: dashboardData, isLoading: dashLoading, refetch: refetchDash } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: async () => {
      const res = await api.get('/admin/dashboard');
      return res.data.data;
    }
  });

  const { data: productsData, isLoading: productsLoading, refetch: refetchProducts } = useQuery({
    queryKey: ['admin-products'],
    queryFn: async () => {
      const res = await api.get('/products', { params: { limit: 50, sort: 'newest' } });
      return res.data.data;
    }
  });

  const { data: categoriesData, isLoading: categoriesLoading, refetch: refetchCategories } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: async () => {
      const res = await api.get('/categories');
      return res.data.data.categories;
    }
  });

  const { data: ordersData, isLoading: ordersLoading, refetch: refetchOrders } = useQuery({
    queryKey: ['admin-orders', orderPage],
    queryFn: async () => {
      const res = await api.get('/admin/orders', { params: { page: orderPage, limit: 10 } });
      return res.data;
    }
  });

  const { data: reviewsData, isLoading: reviewsLoading, refetch: refetchReviews } = useQuery({
    queryKey: ['admin-reviews'],
    queryFn: async () => {
      const res = await api.get('/admin/reviews');
      return res.data.data;
    }
  });

  const { data: couponsData, isLoading: couponsLoading, refetch: refetchCoupons } = useQuery({
    queryKey: ['admin-coupons'],
    queryFn: async () => {
      const res = await api.get('/admin/coupons');
      return res.data.data.coupons;
    }
  });

  const { data: usersData, isLoading: usersLoading, refetch: refetchUsers } = useQuery({
    queryKey: ['admin-users', userPage, userSearch, userStatusFilter, userRoleFilter],
    queryFn: async () => {
      const res = await api.get('/admin/users', {
        params: {
          page: userPage,
          limit: 10,
          search: userSearch,
          status: userStatusFilter,
          role: userRoleFilter
        }
      });
      return res.data;
    }
  });

  const { data: auditLogsData, isLoading: auditLoading, refetch: refetchAudits } = useQuery({
    queryKey: ['admin-audit-logs', auditPage, auditActionFilter, auditEntityTypeFilter],
    queryFn: async () => {
      const res = await api.get('/admin/audit-logs', {
        params: {
          page: auditPage,
          limit: 15,
          action: auditActionFilter,
          entityType: auditEntityTypeFilter
        }
      });
      return res.data;
    }
  });

  const { data: analyticsData, isLoading: analyticsLoading, refetch: refetchAnalytics } = useQuery({
    queryKey: ['admin-analytics', analyticsDays],
    queryFn: async () => {
      const fromDate = new Date(Date.now() - parseInt(analyticsDays) * 24 * 60 * 60 * 1000).toISOString();
      const res = await api.get('/admin/analytics', { params: { from: fromDate } });
      return res.data.data;
    }
  });

  // MUTATIONS

  // Product CRUD
  const saveProductMutation = useMutation({
    mutationFn: async (payload: { id?: string; data: any }) => {
      if (payload.id) {
        return (await api.patch(`/admin/products/${payload.id}`, payload.data)).data.data;
      } else {
        return (await api.post('/admin/products', payload.data)).data.data;
      }
    },
    onSuccess: () => {
      refetchProducts();
      refetchDash();
      setShowProductForm(false);
      setEditingProductId(null);
      setProdTitle('');
      setProdSku('');
      setProdBrand('');
      setProdPrice(1000);
      setProdComparePrice('');
      setProdStock(10);
      setProdDescription('');
      setProdImageUrl('');
    }
  });

  const deleteProductMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/admin/products/${id}`);
    },
    onSuccess: () => {
      refetchProducts();
      refetchDash();
    }
  });

  const adjustStockMutation = useMutation({
    mutationFn: async (payload: { productId: string; adjustment: number }) => {
      await api.post('/admin/inventory/adjustments', {
        productId: payload.productId,
        adjustment: payload.adjustment,
        reason: 'Manual admin restocking adjustment'
      });
    },
    onSuccess: () => {
      refetchProducts();
      refetchDash();
      setAdjustingProductId(null);
    }
  });

  // Category CRUD Mutations
  const saveCategoryMutation = useMutation({
    mutationFn: async (payload: { id?: string; data: any }) => {
      if (payload.id) {
        return (await api.patch(`/admin/categories/${payload.id}`, payload.data)).data.data;
      } else {
        return (await api.post('/admin/categories', payload.data)).data.data;
      }
    },
    onSuccess: () => {
      refetchCategories();
      setShowCategoryForm(false);
      setEditingCategoryId(null);
      setCatName('');
      setCatDescription('');
      setCatImage('');
      setCatSortOrder(0);
    }
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/admin/categories/${id}`);
    },
    onSuccess: () => {
      refetchCategories();
    }
  });

  // User moderation status & role change
  const updateUserStatusMutation = useMutation({
    mutationFn: async (payload: { id: string; status: 'active' | 'blocked' }) => {
      await api.patch(`/admin/users/${payload.id}/status`, { status: payload.status });
    },
    onSuccess: () => {
      refetchUsers();
      if (viewingUser) {
        setViewingUser((prev: any) => prev ? { ...prev, user: { ...prev.user, status: prev.user.status === 'active' ? 'blocked' : 'active' } } : null);
      }
    },
    onError: (err: any) => {
      alert(err.message || 'Failed to update user status');
    }
  });

  const updateUserRoleMutation = useMutation({
    mutationFn: async (payload: { id: string; role: 'customer' | 'admin' }) => {
      await api.patch(`/admin/users/${payload.id}/role`, { role: payload.role });
    },
    onSuccess: () => {
      refetchUsers();
      if (viewingUser) {
        setViewingUser((prev: any) => prev ? { ...prev, user: { ...prev.user, role: prev.user.role === 'admin' ? 'customer' : 'admin' } } : null);
      }
    },
    onError: (err: any) => {
      alert(err.message || 'Failed to change user role');
    }
  });

  // Order status
  const updateOrderStatusMutation = useMutation({
    mutationFn: async (payload: { id: string; status: string }) => {
      await api.patch(`/admin/orders/${payload.id}`, {
        status: payload.status,
        note: `Order status updated to ${payload.status} by logistics operations.`
      });
    },
    onSuccess: () => {
      refetchOrders();
      refetchDash();
      if (viewingOrder) {
        refetchOrderDetails(viewingOrder.id);
      }
    }
  });

  const refetchOrderDetails = async (orderId: string) => {
    try {
      const res = await api.get(`/admin/orders/${orderId}`);
      setViewingOrder(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Review moderation
  const moderateReviewMutation = useMutation({
    mutationFn: async (payload: { id: string; status: 'approved' | 'rejected' }) => {
      await api.patch(`/admin/reviews/${payload.id}`, {
        status: payload.status,
        reason: moderationReason
      });
    },
    onSuccess: () => {
      refetchReviews();
      refetchProducts();
      setModeratingReview(null);
    }
  });

  // Coupon CRUD
  const saveCouponMutation = useMutation({
    mutationFn: async (payload: { id?: string; data: any }) => {
      if (payload.id) {
        await api.patch(`/admin/coupons/${payload.id}`, payload.data);
      } else {
        await api.post('/admin/coupons', payload.data);
      }
    },
    onSuccess: () => {
      refetchCoupons();
      setShowCouponForm(false);
      setEditingCouponId(null);
      setCoupCode('');
      setCoupValue(500);
      setCoupMinSubtotal(2000);
      setCoupLimit(100);
      setCoupActive(true);
    }
  });

  const deleteCouponMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/admin/coupons/${id}`);
    },
    onSuccess: () => {
      refetchCoupons();
    }
  });

  // HANDLERS
  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      title: prodTitle,
      sku: prodSku,
      brand: prodBrand,
      categoryId: prodCategory || categoriesData?.[0]?.id || 'cat_electronics',
      pricePaise: prodPrice * 100,
      compareAtPaise: prodComparePrice ? parseFloat(prodComparePrice) * 100 : undefined,
      stock: prodStock,
      description: prodDescription,
      images: [
        {
          publicId: `img-${Date.now()}`,
          url: prodImageUrl || 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=400',
          sortOrder: 1
        }
      ],
      specs: {
        Brand: prodBrand,
        SKU: prodSku,
      }
    };

    saveProductMutation.mutate({
      id: editingProductId || undefined,
      data: payload
    });
  };

  const handleEditProductClick = (p: any) => {
    setEditingProductId(p.id);
    setProdTitle(p.title);
    setProdSku(p.sku);
    setProdBrand(p.brand);
    setProdCategory(p.categoryId);
    setProdPrice(p.pricePaise / 100);
    setProdComparePrice(p.compareAtPaise ? (p.compareAtPaise / 100).toString() : '');
    setProdStock(p.stock);
    setProdDescription(p.description);
    setProdImageUrl(p.images[0]?.url || '');
    setShowProductForm(true);
  };

  const handleCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: catName,
      description: catDescription,
      image: catImage || undefined,
      sortOrder: catSortOrder,
      active: true
    };
    saveCategoryMutation.mutate({
      id: editingCategoryId || undefined,
      data: payload
    });
  };

  const handleEditCategoryClick = (c: any) => {
    setEditingCategoryId(c.id);
    setCatName(c.name);
    setCatDescription(c.description || '');
    setCatImage(c.image || '');
    setCatSortOrder(c.sortOrder || 0);
    setShowCategoryForm(true);
  };

  const handleCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      code: coupCode.toUpperCase(),
      type: coupType,
      value: coupType === 'fixed' ? coupValue * 100 : coupValue,
      minSubtotal: coupMinSubtotal * 100,
      startsAt: new Date().toISOString(),
      endsAt: new Date(Date.now() + 86400000 * 30).toISOString(),
      usageLimit: coupLimit,
      active: coupActive
    };
    saveCouponMutation.mutate({
      id: editingCouponId || undefined,
      data: payload
    });
  };

  const handleEditCouponClick = (c: any) => {
    setEditingCouponId(c.id);
    setCoupCode(c.code);
    setCoupType(c.type);
    setCoupValue(c.type === 'fixed' ? c.value / 100 : c.value);
    setCoupMinSubtotal(c.minSubtotal / 100);
    setCoupLimit(c.usageLimit);
    setCoupActive(c.active);
    setShowCouponForm(true);
  };

  // CSV Export Utility
  const handleExportCSV = (reportType: 'sales' | 'orders' | 'products' | 'customers') => {
    if (!analyticsData) return;
    let headers: string[] = [];
    let rows: any[] = [];
    let fileName = `BzarO_${reportType}_report.csv`;

    switch (reportType) {
      case 'sales':
        headers = ['Date', 'Gross Revenue (INR)', 'Order Count'];
        rows = analyticsData.trends.map((t: any) => ({
          'Date': t.date,
          'Gross Revenue (INR)': t.revenue,
          'Order Count': t.ordersCount
        }));
        break;
      case 'orders':
        headers = ['Category', 'Sales Total (INR)', 'Units Sold'];
        rows = analyticsData.categorySales.map((c: any) => ({
          'Category': c.categoryName,
          'Sales Total (INR)': c.revenue,
          'Units Sold': c.ordersCount
        }));
        break;
      case 'products':
        headers = ['Product Name', 'Units Sold', 'Revenue Generated (INR)'];
        rows = analyticsData.topProducts.map((p: any) => ({
          'Product Name': p.productName,
          'Units Sold': p.unitsSold,
          'Revenue Generated (INR)': p.revenue
        }));
        break;
      case 'customers':
        headers = ['Ordering Customers', 'New Signups', 'Total System Users'];
        rows = [{
          'Ordering Customers': analyticsData.customerMetrics.orderingCustomers,
          'New Signups': analyticsData.customerMetrics.newCustomers,
          'Total System Users': analyticsData.customerMetrics.totalUsersCount
        }];
        break;
    }

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(row => headers.map(h => {
          const val = row[h];
          const str = typeof val === 'object' ? JSON.stringify(val) : String(val === undefined ? '' : val);
          return `"${str.replace(/"/g, '""')}"`;
        }).join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpenUserDrawer = async (userId: string) => {
    try {
      const res = await api.get(`/admin/users/${userId}`);
      setViewingUser(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenOrderDrawer = async (orderId: string) => {
    try {
      const res = await api.get(`/admin/orders/${orderId}`);
      setViewingOrder(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 pb-16 w-full">
      
      {/* 1. Sidebar Admin Menu */}
      <div className="w-full lg:w-64 shrink-0 space-y-4">
        <div className="p-4 border border-slate-200 rounded-xl bg-slate-100 text-xs font-bold text-brand-700 uppercase tracking-widest flex items-center gap-2 shadow-sm">
          <ShieldAlert size={16} />
          BzarO Control Center
        </div>

        <div className="flex flex-col gap-1">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-semibold tracking-wide transition-all ${
              activeTab === 'dashboard' ? 'bg-slate-100 text-brand-600 border-l-2 border-brand-500' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
            }`}
          >
            <TrendingUp size={16} />
            Dashboard Metrics
          </button>
          
          <button
            onClick={() => setActiveTab('products')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-semibold tracking-wide transition-all ${
              activeTab === 'products' ? 'bg-slate-100 text-brand-600 border-l-2 border-brand-500' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
            }`}
          >
            <ShoppingBag size={16} />
            Catalog Products
          </button>

          <button
            onClick={() => setActiveTab('categories')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-semibold tracking-wide transition-all ${
              activeTab === 'categories' ? 'bg-slate-100 text-brand-600 border-l-2 border-brand-500' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
            }`}
          >
            <SlidersHorizontal size={16} />
            Catalog Categories
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-semibold tracking-wide transition-all ${
              activeTab === 'orders' ? 'bg-slate-100 text-brand-600 border-l-2 border-brand-500' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
            }`}
          >
            <PackageCheck size={16} />
            Logistics Orders
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-semibold tracking-wide transition-all ${
              activeTab === 'reviews' ? 'bg-slate-100 text-brand-600 border-l-2 border-brand-500' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
            }`}
          >
            <FileCheck size={16} />
            Moderation Reviews
          </button>

          <button
            onClick={() => setActiveTab('coupons')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-semibold tracking-wide transition-all ${
              activeTab === 'coupons' ? 'bg-slate-100 text-brand-600 border-l-2 border-brand-500' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
            }`}
          >
            <Tag size={16} />
            Promotional Coupons
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-semibold tracking-wide transition-all ${
              activeTab === 'users' ? 'bg-slate-100 text-brand-600 border-l-2 border-brand-500' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
            }`}
          >
            <Users size={16} />
            User Access Roles
          </button>

          <button
            onClick={() => setActiveTab('audit-logs')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-semibold tracking-wide transition-all ${
              activeTab === 'audit-logs' ? 'bg-slate-100 text-brand-600 border-l-2 border-brand-500' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
            }`}
          >
            <ClipboardList size={16} />
            Administrative Audits
          </button>
        </div>
      </div>

      {/* 2. Main Content Tab Card */}
      <div className="flex-1 min-w-0">
        
        {/* Tab 1: Dashboard Overview & SVG Analytics Charts */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <div className="space-y-1">
                <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                  <BarChart3 className="text-brand-600" />
                  Executive Performance Dashboard
                </h2>
                <p className="text-xs text-slate-500 font-sans">Business sales metrics & customer enrollment indicators.</p>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={analyticsDays}
                  onChange={(e) => setAnalyticsDays(e.target.value as any)}
                  className="bg-white border border-slate-200 rounded-lg p-2 text-xs text-slate-700 shadow-sm"
                >
                  <option value="7">Last 7 Days</option>
                  <option value="30">Last 30 Days</option>
                  <option value="90">Last 90 Days</option>
                </select>

                <button 
                  onClick={() => { refetchDash(); refetchAnalytics(); }}
                  className="text-xs text-slate-500 hover:text-slate-900 bg-white border border-slate-200 rounded-lg p-2 flex items-center gap-1.5 shadow-sm"
                >
                  <RefreshCw size={12} className={(dashLoading || analyticsLoading) ? 'animate-spin' : ''} />
                  Sync
                </button>
              </div>
            </div>

            {dashLoading ? (
              <div className="h-64 flex items-center justify-center">
                <Loader2 className="animate-spin text-brand-600" size={32} />
              </div>
            ) : (
              <>
                {/* Metrics Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-5 rounded-xl border border-slate-200 bg-white space-y-2 shadow-sm">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Gross Sales</span>
                    <p className="text-xl font-bold text-slate-900 font-mono">{formatINR(dashboardData?.stats?.revenuePaise || 0)}</p>
                  </div>
                  <div className="p-5 rounded-xl border border-slate-200 bg-white space-y-2 shadow-sm">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Total Orders</span>
                    <p className="text-xl font-bold text-slate-900 font-mono">{dashboardData?.stats?.ordersCount || 0}</p>
                  </div>
                  <div className="p-5 rounded-xl border border-slate-200 bg-white space-y-2 shadow-sm">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Avg Order Value</span>
                    <p className="text-xl font-bold text-slate-900 font-mono">{formatINR(dashboardData?.stats?.avgOrderValPaise || 0)}</p>
                  </div>
                  <div className="p-5 rounded-xl border border-slate-200 bg-white space-y-2 shadow-sm">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Low Stock Products</span>
                    <p className="text-xl font-bold text-red-750 font-mono flex items-center gap-1.5">
                      <AlertCircle size={18} className="shrink-0" />
                      {dashboardData?.stats?.lowStockCount || 0}
                    </p>
                  </div>
                </div>

                {/* CSV Export & Reports Deck */}
                <div className="bg-white p-6 border border-slate-200 rounded-xl space-y-4 shadow-sm">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                    <h3 className="text-sm font-bold text-slate-900">Reporting Database Exports</h3>
                    <Download size={16} className="text-slate-400" />
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <button 
                      onClick={() => handleExportCSV('sales')}
                      className="text-xs font-bold py-2 px-3 bg-white hover:bg-slate-50 text-brand-700 border border-slate-200 rounded-lg flex items-center justify-center gap-2 shadow-xs"
                    >
                      Sales Report CSV
                    </button>
                    <button 
                      onClick={() => handleExportCSV('orders')}
                      className="text-xs font-bold py-2 px-3 bg-white hover:bg-slate-50 text-brand-700 border border-slate-200 rounded-lg flex items-center justify-center gap-2 shadow-xs"
                    >
                      Orders Category CSV
                    </button>
                    <button 
                      onClick={() => handleExportCSV('products')}
                      className="text-xs font-bold py-2 px-3 bg-white hover:bg-slate-50 text-brand-700 border border-slate-200 rounded-lg flex items-center justify-center gap-2 shadow-xs"
                    >
                      Top Products CSV
                    </button>
                    <button 
                      onClick={() => handleExportCSV('customers')}
                      className="text-xs font-bold py-2 px-3 bg-white hover:bg-slate-50 text-brand-700 border border-slate-200 rounded-lg flex items-center justify-center gap-2 shadow-xs"
                    >
                      Customers Stats CSV
                    </button>
                  </div>
                </div>

                {/* SVG Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Revenue Line Chart */}
                  <div className="bg-white p-6 border border-slate-200 rounded-xl space-y-4 shadow-sm">
                    <h3 className="text-xs uppercase font-bold text-slate-400 tracking-wider">Gross Sales Timeline (INR)</h3>
                    {analyticsLoading ? (
                      <div className="h-48 flex items-center justify-center"><Loader2 className="animate-spin text-brand-600" /></div>
                    ) : (
                      <div className="h-48 w-full">
                        <svg className="w-full h-full" viewBox="0 0 500 200">
                          <line x1="0" y1="50" x2="500" y2="50" stroke="#f1f5f9" strokeDasharray="4" />
                          <line x1="0" y1="100" x2="500" y2="100" stroke="#f1f5f9" strokeDasharray="4" />
                          <line x1="0" y1="150" x2="500" y2="150" stroke="#f1f5f9" strokeDasharray="4" />
                          {analyticsData?.trends?.length > 1 ? (
                            (() => {
                              const maxVal = Math.max(...analyticsData.trends.map((t: any) => t.revenue)) || 1000;
                              const points = analyticsData.trends.map((t: any, idx: number) => {
                                const x = (idx / (analyticsData.trends.length - 1)) * 500;
                                const y = 200 - (t.revenue / maxVal) * 160 - 20;
                                return `${x},${y}`;
                              }).join(' ');
                              return (
                                <>
                                  <path d={`M 0,180 ${points.split(' ').map(p => `L ${p}`).join(' ')} L 500,180 Z`} fill="url(#salesGrad)" opacity="0.15" />
                                  <polyline fill="none" stroke="#10b981" strokeWidth="2.5" points={points} />
                                </>
                              );
                            })()
                          ) : (
                            <text x="250" y="100" textAnchor="middle" fill="#94a3b8" className="text-xs">Insufficient transaction range</text>
                          )}
                          <defs>
                            <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#10b981" />
                              <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                            </linearGradient>
                          </defs>
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Orders Bar Chart */}
                  <div className="bg-white p-6 border border-slate-200 rounded-xl space-y-4 shadow-sm">
                    <h3 className="text-xs uppercase font-bold text-slate-400 tracking-wider">Logistics Volumes</h3>
                    {analyticsLoading ? (
                      <div className="h-48 flex items-center justify-center"><Loader2 className="animate-spin text-brand-600" /></div>
                    ) : (
                      <div className="h-48 w-full">
                        <svg className="w-full h-full" viewBox="0 0 500 200">
                          {analyticsData?.trends?.length > 0 ? (
                            (() => {
                              const maxOrders = Math.max(...analyticsData.trends.map((t: any) => t.ordersCount)) || 5;
                              const barWidth = Math.max(4, 400 / analyticsData.trends.length);
                              return analyticsData.trends.map((t: any, idx: number) => {
                                const x = (idx / analyticsData.trends.length) * 460 + 20;
                                const height = (t.ordersCount / maxOrders) * 140;
                                const y = 180 - height;
                                return (
                                  <rect
                                    key={idx}
                                    x={x}
                                    y={y}
                                    width={barWidth}
                                    height={height}
                                    fill="#3b82f6"
                                    rx="2"
                                    className="transition-all hover:fill-brand-600"
                                  />
                                );
                              });
                            })()
                          ) : (
                            <text x="250" y="100" textAnchor="middle" fill="#94a3b8" className="text-xs">No orders recorded</text>
                          )}
                          <line x1="0" y1="180" x2="500" y2="180" stroke="#cbd5e1" strokeWidth="2" />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>

                {/* Recent Purchases */}
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-slate-900">Recent Purchases</h3>
                  <div className="rounded-xl border border-slate-200 bg-white overflow-hidden divide-y divide-slate-100 shadow-sm animate-in fade-in duration-200">
                    {dashboardData?.recentOrders?.length === 0 ? (
                      <p className="p-4 text-xs text-slate-500 text-center">No orders placed yet.</p>
                    ) : (
                      dashboardData?.recentOrders?.map((ord: any) => (
                        <div key={ord.id} className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs">
                          <div className="space-y-0.5">
                            <p className="font-mono font-bold text-slate-800 hover:underline hover:text-brand-600 cursor-pointer" onClick={() => handleOpenOrderDrawer(ord.id)}>{ord.orderNumber}</p>
                            <p className="text-[10px] text-slate-400 font-mono">Customer ID: {ord.userId}</p>
                          </div>
                          <span className={`text-[10px] uppercase font-extrabold tracking-wider px-1.5 py-0.5 rounded ${
                            ['paid', 'processing', 'shipped', 'delivered'].includes(ord.status)
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-250'
                              : 'bg-red-50 text-red-700 border border-red-250'
                          }`}>
                            {ord.status}
                          </span>
                          <span className="font-mono font-bold text-brand-600">{formatINR(ord.totals.totalPaise)}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Tab 2: Catalog Products CRUD */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex justify-between items-end">
              <div className="space-y-1">
                <h2 className="text-lg font-bold text-slate-900">Catalog Products</h2>
                <p className="text-xs text-slate-505">Add, edit stock levels, or archive catalog items.</p>
              </div>
              {!showProductForm && (
                <button
                  onClick={() => {
                    setEditingProductId(null);
                    setShowProductForm(true);
                  }}
                  className="btn-primary py-1.5 px-3 text-xs font-bold flex items-center gap-1"
                >
                  <Plus size={14} />
                  Add Product
                </button>
              )}
            </div>

            {/* Product Form */}
            {showProductForm && (
              <form onSubmit={handleProductSubmit} className="bg-white p-6 rounded-xl border border-slate-200 space-y-4 max-w-2xl shadow-sm animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h4 className="text-sm font-bold text-slate-900">
                    {editingProductId ? 'Edit Catalog Product' : 'Add New Product'}
                  </h4>
                  <button
                    type="button"
                    onClick={() => {
                      setShowProductForm(false);
                      setEditingProductId(null);
                    }}
                    className="text-xs text-slate-450 hover:text-slate-750"
                  >
                    Cancel
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-500">Product Title</label>
                    <input
                      type="text"
                      placeholder="e.g. AuraBook Pro 15"
                      value={prodTitle}
                      onChange={(e) => setProdTitle(e.target.value)}
                      className="w-full input-field py-2 text-xs"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-500">SKU Code</label>
                    <input
                      type="text"
                      placeholder="AURB-15-M3"
                      value={prodSku}
                      onChange={(e) => setProdSku(e.target.value)}
                      className="w-full input-field py-2 text-xs font-mono uppercase"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-500">Brand</label>
                    <input
                      type="text"
                      placeholder="Aura"
                      value={prodBrand}
                      onChange={(e) => setProdBrand(e.target.value)}
                      className="w-full input-field py-2 text-xs"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-500">Category</label>
                    <select
                      value={prodCategory}
                      onChange={(e) => setProdCategory(e.target.value)}
                      className="w-full input-field py-2 text-xs bg-white"
                    >
                      {categoriesData?.map((cat: any) => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-500">Initial Stock</label>
                    <input
                      type="number"
                      value={prodStock}
                      onChange={(e) => setProdStock(parseInt(e.target.value))}
                      className="w-full input-field py-2 text-xs"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-500">Price (Rupees)</label>
                    <input
                      type="number"
                      value={prodPrice}
                      onChange={(e) => setProdPrice(parseFloat(e.target.value))}
                      className="w-full input-field py-2 text-xs"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-500">Compare Price (optional)</label>
                    <input
                      type="number"
                      value={prodComparePrice}
                      onChange={(e) => setProdComparePrice(e.target.value)}
                      className="w-full input-field py-2 text-xs"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-500">Image URL</label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={prodImageUrl}
                    onChange={(e) => setProdImageUrl(e.target.value)}
                    className="w-full input-field py-2 text-xs font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-500">Product Description</label>
                  <textarea
                    placeholder="Write product overview details here..."
                    rows={4}
                    value={prodDescription}
                    onChange={(e) => setProdDescription(e.target.value)}
                    className="w-full input-field p-3 text-xs"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={saveProductMutation.isPending}
                  className="w-full btn-primary py-2.5 text-xs font-bold"
                >
                  {saveProductMutation.isPending ? 'Saving...' : 'Save Product to Catalog'}
                </button>
              </form>
            )}

            {/* Products grid list */}
            {productsLoading ? (
              <div className="h-64 flex items-center justify-center">
                <Loader2 className="animate-spin text-brand-600" size={32} />
              </div>
            ) : (
              <div className="rounded-xl border border-slate-200 bg-white overflow-hidden divide-y divide-slate-100 shadow-sm animate-in fade-in duration-200">
                {productsData?.products?.map((prod: any) => (
                  <div key={prod.id} className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs">
                    <div className="flex gap-3 items-center min-w-0">
                      <div className="w-10 h-10 bg-white border border-slate-200 rounded overflow-hidden shrink-0">
                        <img src={prod.images[0]?.url} alt={prod.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-bold text-slate-900 truncate">{prod.title}</h4>
                        <p className="text-[10px] text-slate-400 font-mono">
                          SKU: {prod.sku} • Stock: <span className={prod.stock <= 5 ? 'text-red-600 font-bold animate-pulse' : 'text-slate-500'}>{prod.stock}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto self-stretch sm:self-auto justify-end">
                      {adjustingProductId === prod.id ? (
                        <div className="flex items-center gap-1.5 bg-slate-50 p-1 rounded-lg border border-slate-200 shadow-xs">
                          <input
                            type="number"
                            value={adjustStockVal}
                            onChange={(e) => setAdjustStockVal(parseInt(e.target.value))}
                            className="w-14 input-field py-1 px-2 text-center text-xs font-mono h-7"
                          />
                          <button
                            onClick={() => adjustStockMutation.mutate({ productId: prod.id, adjustment: adjustStockVal })}
                            className="bg-brand-600 hover:bg-brand-700 text-white rounded p-1 text-[10px] h-7 font-bold px-2"
                          >
                            Set
                          </button>
                          <button
                            onClick={() => setAdjustingProductId(null)}
                            className="bg-slate-200 text-slate-600 hover:text-slate-950 rounded p-1 text-[10px] h-7 font-bold px-2"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setAdjustStockVal(5);
                            setAdjustingProductId(prod.id);
                          }}
                          className="text-xs text-brand-600 hover:text-brand-700 font-bold flex items-center gap-1 border border-slate-200 hover:border-slate-300 bg-white px-2 py-1 rounded shadow-xs"
                        >
                          <ArrowRightLeft size={12} />
                          Adjust Stock
                        </button>
                      )}

                      <button
                        onClick={() => handleEditProductClick(prod)}
                        className="text-xs text-slate-600 hover:text-slate-900 font-bold flex items-center gap-0.5 border border-slate-200 hover:border-slate-300 bg-white px-2 py-1 rounded shadow-xs"
                      >
                        <Edit2 size={12} />
                        Edit
                      </button>

                      <button
                        onClick={() => {
                          if (window.confirm('Delete or archive this product?')) {
                            deleteProductMutation.mutate(prod.id);
                          }
                        }}
                        className="text-xs text-red-600 hover:text-red-700 font-bold flex items-center gap-0.5 border border-slate-200 hover:border-slate-300 bg-white px-2 py-1 rounded shadow-xs"
                      >
                        <Archive size={12} />
                        Archive
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}        {/* Tab 3: Catalog Categories CRUD */}
        {activeTab === 'categories' && (
          <div className="space-y-6">
            <div className="flex justify-between items-end">
              <div className="space-y-1">
                <h2 className="text-lg font-bold text-slate-900">Catalog Categories</h2>
                <p className="text-xs text-slate-500">Add, edit, or remove catalog product categories.</p>
              </div>
              {!showCategoryForm && (
                <button
                  onClick={() => {
                    setEditingCategoryId(null);
                    setShowCategoryForm(true);
                  }}
                  className="btn-primary py-1.5 px-3 text-xs font-bold flex items-center gap-1"
                >
                  <Plus size={14} />
                  Add Category
                </button>
              )}
            </div>

            {/* Category Form */}
            {showCategoryForm && (
              <form onSubmit={handleCategorySubmit} className="bg-white p-6 rounded-xl border border-slate-200 space-y-4 max-w-xl animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h4 className="text-sm font-bold text-slate-900">
                    {editingCategoryId ? 'Edit Category' : 'Create Category'}
                  </h4>
                  <button
                    type="button"
                    onClick={() => {
                      setShowCategoryForm(false);
                      setEditingCategoryId(null);
                    }}
                    className="text-xs text-slate-400 hover:text-slate-700"
                  >
                    Cancel
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-500">Category Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Smart Accessories"
                      value={catName}
                      onChange={(e) => setCatName(e.target.value)}
                      className="w-full input-field py-2 text-xs"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-500">Sort Order</label>
                    <input
                      type="number"
                      value={catSortOrder}
                      onChange={(e) => setCatSortOrder(parseInt(e.target.value))}
                      className="w-full input-field py-2 text-xs"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-500">Image URL (optional)</label>
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/..."
                      value={catImage}
                      onChange={(e) => setCatImage(e.target.value)}
                      className="w-full input-field py-2 text-xs font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-500">Description</label>
                    <textarea
                      placeholder="Category overview..."
                      rows={3}
                      value={catDescription}
                      onChange={(e) => setCatDescription(e.target.value)}
                      className="w-full input-field p-3 text-xs"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={saveCategoryMutation.isPending}
                  className="w-full btn-primary py-2.5 text-xs font-bold"
                >
                  {saveCategoryMutation.isPending ? 'Saving...' : 'Save Category'}
                </button>
              </form>
            )}

            {/* Categories List */}
            {categoriesLoading ? (
              <div className="h-64 flex items-center justify-center">
                <Loader2 className="animate-spin text-brand-600" size={32} />
              </div>
            ) : (
              <div className="rounded-xl border border-slate-200 bg-white overflow-hidden divide-y divide-slate-100 shadow-sm animate-in fade-in duration-200">
                {categoriesData?.map((cat: any) => (
                  <div key={cat.id} className="p-4 flex justify-between items-center text-xs">
                    <div>
                      <h4 className="font-bold text-slate-900">{cat.name}</h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">Sort Order: {cat.sortOrder} • Slug: {cat.slug}</p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditCategoryClick(cat)}
                        className="text-xs text-slate-600 hover:text-slate-950 font-bold flex items-center gap-0.5 border border-slate-200 hover:border-slate-300 bg-white px-2 py-1 rounded shadow-xs"
                      >
                        <Edit2 size={12} />
                        Edit
                      </button>

                      <button
                        onClick={() => {
                          if (window.confirm('Delete this category?')) {
                            deleteCategoryMutation.mutate(cat.id);
                          }
                        }}
                        className="text-xs text-red-600 hover:text-red-700 font-bold flex items-center gap-0.5 border border-slate-200 hover:border-slate-300 bg-white px-2 py-1 rounded shadow-xs"
                      >
                        <Trash2 size={12} />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Logistics Orders Status Management & Detailed Drawer */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-slate-900">Logistics Orders</h2>
              <p className="text-xs text-slate-500">Process shipping status coordinates (`processing`, `shipped`, `delivered`).</p>
            </div>

            {ordersLoading ? (
              <div className="h-64 flex items-center justify-center">
                <Loader2 className="animate-spin text-brand-600" size={32} />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="rounded-xl border border-slate-200 bg-white overflow-hidden divide-y divide-slate-100 shadow-sm animate-in fade-in duration-200">
                  {ordersData?.data?.map((ord: any) => (
                    <div key={ord.id} className="p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-slate-800 hover:underline hover:text-brand-600 cursor-pointer" onClick={() => handleOpenOrderDrawer(ord.id)}>{ord.orderNumber}</span>
                          <span className="text-[10px] text-slate-400">{new Date(ord.createdAt).toLocaleDateString()}</span>
                        </div>
                        <p className="text-[10px] text-slate-400 font-mono mt-0.5">Total Amount: {formatINR(ord.totals.totalPaise)}</p>
                      </div>

                      <div className="flex items-center gap-3 w-full md:w-auto self-stretch md:self-auto justify-end">
                        <span className="font-bold text-slate-600 uppercase shrink-0">Status: {ord.status}</span>
                        
                        <button
                          onClick={() => handleOpenOrderDrawer(ord.id)}
                          className="bg-white hover:bg-slate-50 text-slate-750 rounded p-1.5 px-3 font-bold flex items-center gap-1 border border-slate-200 shadow-xs"
                        >
                          <Eye size={12} />
                          Details
                        </button>

                        {ord.status === 'paid' && (
                          <button
                            onClick={() => updateOrderStatusMutation.mutate({ id: ord.id, status: 'processing' })}
                            className="bg-brand-600 hover:bg-brand-700 text-white rounded px-2.5 py-1 font-bold animate-pulse"
                          >
                            Start Processing
                          </button>
                        )}
                        
                        {ord.status === 'processing' && (
                          <button
                            onClick={() => updateOrderStatusMutation.mutate({ id: ord.id, status: 'shipped' })}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded px-2.5 py-1 font-bold"
                          >
                            Ship Order
                          </button>
                        )}

                        {ord.status === 'shipped' && (
                          <button
                            onClick={() => updateOrderStatusMutation.mutate({ id: ord.id, status: 'delivered' })}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white rounded px-2.5 py-1 font-bold"
                          >
                            Mark Delivered
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination Controls */}
                <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border border-slate-200/80 shadow-xs">
                  <span className="text-[10px] text-slate-500 font-mono">
                    Showing Page {ordersData?.meta?.page} of {ordersData?.meta?.totalPages}
                  </span>
                  <div className="flex gap-2">
                    <button
                      disabled={orderPage === 1}
                      onClick={() => setOrderPage(p => p - 1)}
                      className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-750 rounded p-1.5 disabled:opacity-40 disabled:pointer-events-none shadow-xs"
                    >
                      <ChevronLeft size={14} />
                    </button>
                    <button
                      disabled={orderPage === ordersData?.meta?.totalPages}
                      onClick={() => setOrderPage(p => p + 1)}
                      className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-750 rounded p-1.5 disabled:opacity-40 disabled:pointer-events-none shadow-xs"
                    >
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 5: Review Moderation with Custom Reasons */}
        {activeTab === 'reviews' && (
          <div className="space-y-6">
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-slate-900">Review Moderation</h2>
              <p className="text-xs text-slate-500">Approve, hide, or reject user review submissions.</p>
            </div>

            {reviewsLoading ? (
              <div className="h-64 flex items-center justify-center">
                <Loader2 className="animate-spin text-brand-600" size={32} />
              </div>
            ) : (
              <div className="space-y-4">
                {reviewsData?.reviews?.map((rev: any) => (
                  <div key={rev.id} className="p-4 rounded-xl border border-slate-200 bg-white space-y-3 shadow-xs">
                    <div className="flex justify-between items-center text-xs">
                      <div>
                        <span className="font-bold text-slate-900">{rev.userName}</span>
                        <span className="text-[10px] text-slate-400 font-mono ml-2">Rating: {rev.rating}/5</span>
                      </div>
                      <span className={`text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded border ${
                        rev.status === 'approved' 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                          : rev.status === 'pending' 
                          ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                          : 'bg-red-50 text-red-700 border-red-200'
                      }`}>
                        {rev.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed italic">"{rev.body}"</p>

                    {rev.moderation && (
                      <div className="text-[10px] text-slate-500 font-mono bg-slate-50 p-2 rounded border border-slate-100">
                        Moderator: {rev.moderation.moderatedBy} • Reason: {rev.moderation.reason}
                      </div>
                    )}

                    {rev.status === 'pending' && (
                      <div className="flex gap-2 justify-end pt-2 border-t border-slate-100">
                        <button
                          onClick={() => {
                            setModeratingReview(rev);
                            setModerationAction('rejected');
                            setModerationReason('');
                          }}
                          className="py-1 px-2.5 text-[10px] font-bold border border-red-200 bg-white hover:bg-red-50 text-red-700 rounded-lg shadow-xs transition-colors"
                        >
                          Reject
                        </button>
                        <button
                          onClick={() => {
                            setModeratingReview(rev);
                            setModerationAction('approved');
                            setModerationReason('Approved by admin moderation');
                          }}
                          className="py-1 px-2.5 text-[10px] font-bold bg-brand-600 hover:bg-brand-700 text-white rounded-lg shadow-xs transition-colors"
                        >
                          Approve
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 6: Coupon CRUD & Toggle Enabled/Disabled */}
        {activeTab === 'coupons' && (
          <div className="space-y-6">
            <div className="flex justify-between items-end">
              <div className="space-y-1">
                <h2 className="text-lg font-bold text-slate-900">Promotional Coupons</h2>
                <p className="text-xs text-slate-500">Add, disable, or modify promotional campaign codes.</p>
              </div>
              {!showCouponForm && (
                <button
                  onClick={() => {
                    setEditingCouponId(null);
                    setShowCouponForm(true);
                  }}
                  className="btn-primary py-1.5 px-3 text-xs font-bold flex items-center gap-1"
                >
                  <Plus size={14} />
                  Add Coupon
                </button>
              )}
            </div>

            {/* Coupon Form */}
            {showCouponForm && (
              <form onSubmit={handleCouponSubmit} className="bg-white p-6 rounded-xl border border-slate-200 space-y-4 max-w-xl shadow-sm animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h4 className="text-sm font-bold text-slate-900">{editingCouponId ? 'Edit Coupon' : 'Create New Coupon'}</h4>
                  <button
                    type="button"
                    onClick={() => setShowCouponForm(false)}
                    className="text-xs text-slate-400 hover:text-slate-700"
                  >
                    Cancel
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-500">Coupon Code</label>
                    <input
                      type="text"
                      placeholder="e.g. SUMMER20"
                      value={coupCode}
                      onChange={(e) => setCoupCode(e.target.value.toUpperCase())}
                      className="w-full input-field py-2 text-xs uppercase"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-500">Discount Type</label>
                    <select
                      value={coupType}
                      onChange={(e) => setCoupType(e.target.value as any)}
                      className="w-full input-field py-2.5 text-xs bg-white"
                    >
                      <option value="fixed">Fixed Off (₹)</option>
                      <option value="percent">Percentage Off (%)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-500">Discount Value</label>
                    <input
                      type="number"
                      value={coupValue}
                      onChange={(e) => setCoupValue(parseFloat(e.target.value))}
                      className="w-full input-field py-2 text-xs"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-500">Min Order Subtotal (₹)</label>
                    <input
                      type="number"
                      value={coupMinSubtotal}
                      onChange={(e) => setCoupMinSubtotal(parseFloat(e.target.value))}
                      className="w-full input-field py-2 text-xs"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-500">Usage Limit</label>
                    <input
                      type="number"
                      value={coupLimit}
                      onChange={(e) => setCoupLimit(parseInt(e.target.value))}
                      className="w-full input-field py-2 text-xs"
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="coupActive"
                    checked={coupActive}
                    onChange={(e) => setCoupActive(e.target.checked)}
                    className="rounded border-slate-300 bg-white text-brand-600 focus:ring-brand-500 h-4 w-4 accent-brand-600"
                  />
                  <label htmlFor="coupActive" className="text-xs text-slate-700 font-semibold select-none cursor-pointer">Active (Customers can use it)</label>
                </div>

                <button
                  type="submit"
                  disabled={saveCouponMutation.isPending}
                  className="w-full btn-primary py-2.5 text-xs font-bold"
                >
                  {saveCouponMutation.isPending ? 'Saving...' : 'Save Coupon'}
                </button>
              </form>
            )}

            {/* Coupons List */}
            {couponsLoading ? (
              <div className="h-64 flex items-center justify-center">
                <Loader2 className="animate-spin text-brand-600" size={32} />
              </div>
            ) : (
              <div className="rounded-xl border border-slate-200 bg-white overflow-hidden divide-y divide-slate-100 shadow-sm animate-in fade-in duration-200">
                {couponsData?.map((coup: any) => (
                  <div key={coup.id} className="p-4 flex justify-between items-center text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-900">{coup.code}</span>
                        <span className={`text-[9px] px-1 rounded uppercase font-extrabold ${coup.active ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'}`}>
                          {coup.active ? 'Active' : 'Disabled'}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                        Min Order: {formatINR(coup.minSubtotal)} • Limit: {coup.usageCount}/{coup.usageLimit}
                      </p>
                    </div>

                    <div className="flex gap-3.5">
                      <button
                        onClick={() => {
                          if (window.confirm(`Are you sure you want to ${coup.active ? 'disable' : 'enable'} this coupon?`)) {
                            saveCouponMutation.mutate({ id: coup.id, data: { active: !coup.active } });
                          }
                        }}
                        className={`font-bold text-xs ${coup.active ? 'text-rose-600 hover:text-red-700' : 'text-brand-600 hover:text-brand-700'}`}
                      >
                        {coup.active ? 'Disable' : 'Enable'}
                      </button>

                      <button
                        onClick={() => handleEditCouponClick(coup)}
                        className="text-slate-600 hover:text-slate-900 font-bold text-xs"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => {
                          if (window.confirm('Delete coupon code?')) {
                            deleteCouponMutation.mutate(coup.id);
                          }
                        }}
                        className="text-red-600 hover:text-red-700 font-bold text-xs"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 7: Users & Roles Access Management */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Users className="text-brand-600" />
                User Access Control
              </h2>
              <p className="text-xs text-slate-500">View user directories, block access immediately, and configure access roles.</p>
            </div>

            {/* Filter Deck */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 shadow-sm">
              <input
                type="text"
                placeholder="Search name, email, or user ID..."
                value={userSearch}
                onChange={(e) => { setUserSearch(e.target.value); setUserPage(1); }}
                className="input-field py-1.5 text-xs bg-white"
              />
              <select
                value={userStatusFilter}
                onChange={(e) => { setUserStatusFilter(e.target.value); setUserPage(1); }}
                className="input-field py-2 text-xs bg-white"
              >
                <option value="">All Statuses</option>
                <option value="active">Active</option>
                <option value="blocked">Blocked</option>
              </select>
              <select
                value={userRoleFilter}
                onChange={(e) => { setUserRoleFilter(e.target.value); setUserPage(1); }}
                className="input-field py-2 text-xs bg-white"
              >
                <option value="">All Roles</option>
                <option value="admin">Administrator</option>
                <option value="customer">Customer</option>
              </select>
            </div>

            {usersLoading ? (
              <div className="h-64 flex items-center justify-center">
                <Loader2 className="animate-spin text-brand-600" size={32} />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="rounded-xl border border-slate-200 bg-white overflow-hidden divide-y divide-slate-100 shadow-sm animate-in fade-in duration-200">
                  {usersData?.data?.map((usr: any) => (
                    <div key={usr.id} className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs">
                      <div>
                        <h4 className="font-bold text-slate-900">{usr.name}</h4>
                        <p className="text-[10px] text-slate-400 font-mono">{usr.email}</p>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className={`text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded border ${
                          usr.role === 'admin' ? 'bg-indigo-50 text-indigo-700 border-indigo-200 font-extrabold' : 'bg-slate-100 text-slate-600 border-slate-200'
                        }`}>
                          {usr.role}
                        </span>

                        <span className={`text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded border ${
                          (usr.status || 'active') === 'active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200 font-bold animate-pulse'
                        }`}>
                          {usr.status || 'active'}
                        </span>

                        <button
                          onClick={() => handleOpenUserDrawer(usr.id)}
                          className="bg-white hover:bg-slate-50 text-slate-750 rounded p-1 px-2.5 text-[10px] border border-slate-200 font-bold shadow-xs"
                        >
                          View Activity
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border border-slate-200/80 shadow-xs">
                  <span className="text-[10px] text-slate-500 font-mono">
                    Showing Page {usersData?.meta?.page} of {usersData?.meta?.totalPages}
                  </span>
                  <div className="flex gap-2">
                    <button
                      disabled={userPage === 1}
                      onClick={() => setUserPage(p => p - 1)}
                      className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-750 rounded p-1.5 disabled:opacity-40 disabled:pointer-events-none shadow-xs"
                    >
                      <ChevronLeft size={14} />
                    </button>
                    <button
                      disabled={userPage === usersData?.meta?.totalPages}
                      onClick={() => setUserPage(p => p + 1)}
                      className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-750 rounded p-1.5 disabled:opacity-40 disabled:pointer-events-none shadow-xs"
                    >
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 8: Audit Log Viewer */}
        {activeTab === 'audit-logs' && (
          <div className="space-y-6">
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <ClipboardList className="text-brand-600" />
                Administrative Activity Logs
              </h2>
              <p className="text-xs text-slate-500">Chronological audits tracking changes inside catalogs, roles, configurations, and orders.</p>
            </div>

            {/* Filter Deck */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 shadow-sm">
              <select
                value={auditActionFilter}
                onChange={(e) => { setAuditActionFilter(e.target.value); setAuditPage(1); }}
                className="input-field py-2 text-xs bg-white"
              >
                <option value="">All Actions</option>
                <option value="PRODUCT_CREATE">PRODUCT_CREATE</option>
                <option value="PRODUCT_UPDATE">PRODUCT_UPDATE</option>
                <option value="PRODUCT_DELETE">PRODUCT_DELETE</option>
                <option value="USER_BLOCK">USER_BLOCK</option>
                <option value="USER_UNBLOCK">USER_UNBLOCK</option>
                <option value="ROLE_CHANGED">ROLE_CHANGED</option>
                <option value="ORDER_STATUS_UPDATE">ORDER_STATUS_UPDATE</option>
                <option value="REVIEW_MODERATED">REVIEW_MODERATED</option>
              </select>
              <select
                value={auditEntityTypeFilter}
                onChange={(e) => { setAuditEntityTypeFilter(e.target.value); setAuditPage(1); }}
                className="input-field py-2 text-xs bg-white"
              >
                <option value="">All Abstractions</option>
                <option value="Product">Product</option>
                <option value="User">User</option>
                <option value="Order">Order</option>
                <option value="Review">Review</option>
                <option value="Coupon">Coupon</option>
              </select>
            </div>

            {auditLoading ? (
              <div className="h-64 flex items-center justify-center">
                <Loader2 className="animate-spin text-brand-600" size={32} />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="rounded-xl border border-slate-200 bg-white overflow-hidden divide-y divide-slate-100 shadow-sm animate-in fade-in duration-200">
                  {auditLogsData?.data?.map((log: any) => (
                    <div key={log.id} className="p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs hover:bg-slate-50 transition-all cursor-pointer" onClick={() => setViewingAuditLog(log)}>
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-slate-800 uppercase">{log.action}</span>
                          <span className="text-[10px] text-slate-400 font-mono">{new Date(log.createdAt).toLocaleString()}</span>
                        </div>
                        <p className="text-[10px] text-slate-500 font-mono">Entity: {log.entityType} ({log.entityId})</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-700">{log.actor?.email}</span>
                        <button className="text-slate-400 hover:text-slate-700 p-1 hover:bg-slate-100 rounded">
                          <Eye size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border border-slate-200/80 shadow-xs">
                  <span className="text-[10px] text-slate-500 font-mono">
                    Showing Page {auditLogsData?.meta?.page} of {auditLogsData?.meta?.totalPages}
                  </span>
                  <div className="flex gap-2">
                    <button
                      disabled={auditPage === 1}
                      onClick={() => setAuditPage(p => p - 1)}
                      className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-750 rounded p-1.5 disabled:opacity-40 disabled:pointer-events-none shadow-xs"
                    >
                      <ChevronLeft size={14} />
                    </button>
                    <button
                      disabled={auditPage === auditLogsData?.meta?.totalPages}
                      onClick={() => setAuditPage(p => p + 1)}
                      className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-750 rounded p-1.5 disabled:opacity-40 disabled:pointer-events-none shadow-xs"
                    >
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

      </div>

      {/* 3. Global Overlays: Modals / Drawers */}

      {/* A. User Detail Stats Drawer */}
      {viewingUser && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-white border-l border-slate-200 p-6 overflow-y-auto space-y-6 shadow-2xl animate-in slide-in-from-right duration-300">
            <div className="flex justify-between items-start border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">{viewingUser.user.name}</h3>
                <p className="text-xs text-slate-400 font-mono mt-0.5">{viewingUser.user.email}</p>
              </div>
              <button onClick={() => setViewingUser(null)} className="text-slate-400 hover:text-slate-700 p-1 hover:bg-slate-100 rounded-lg">
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1 shadow-sm">
                <span className="text-[9px] uppercase font-bold text-slate-400">Order Count</span>
                <p className="text-xl font-bold text-slate-900 font-mono">{viewingUser.orderCount}</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1 shadow-sm">
                <span className="text-[9px] uppercase font-bold text-slate-400">Total Spent</span>
                <p className="text-xl font-bold text-brand-600 font-mono">{formatINR(viewingUser.totalSpentPaise)}</p>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] uppercase font-bold text-slate-500">Account Access Credentials</span>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    if (window.confirm(`Are you sure you want to change this user's role to ${viewingUser.user.role === 'admin' ? 'customer' : 'admin'}?`)) {
                      updateUserRoleMutation.mutate({ id: viewingUser.user.id, role: viewingUser.user.role === 'admin' ? 'customer' : 'admin' });
                    }
                  }}
                  className={`flex-1 py-2 rounded-lg text-xs font-semibold border flex items-center justify-center gap-1.5 transition-colors ${
                    viewingUser.user.role === 'admin' 
                      ? 'border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 shadow-xs' 
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 hover:text-slate-950 shadow-xs'
                  }`}
                >
                  <ShieldCheck size={14} />
                  {viewingUser.user.role === 'admin' ? 'Demote to Customer' : 'Promote to Admin'}
                </button>

                <button
                  onClick={() => {
                    const nextStatus = (viewingUser.user.status || 'active') === 'active' ? 'blocked' : 'active';
                    if (window.confirm(`Are you sure you want to set status to ${nextStatus}?`)) {
                      updateUserStatusMutation.mutate({ id: viewingUser.user.id, status: nextStatus });
                    }
                  }}
                  className={`flex-1 py-2 rounded-lg text-xs font-semibold border flex items-center justify-center gap-1.5 transition-colors ${
                    (viewingUser.user.status || 'active') === 'active'
                      ? 'border-red-200 bg-red-50 text-red-700 hover:bg-red-100'
                      : 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                  }`}
                >
                  <Ban size={14} />
                  {(viewingUser.user.status || 'active') === 'active' ? 'Block Access' : 'Unblock Account'}
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <span className="text-[10px] uppercase font-bold text-slate-500">Order Activity Timeline</span>
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl bg-white overflow-hidden shadow-sm">
                {viewingUser.recentOrders?.length === 0 ? (
                  <p className="p-4 text-xs text-slate-500 text-center">No purchases recorded</p>
                ) : (
                  viewingUser.recentOrders?.map((ord: any) => (
                    <div key={ord.id} className="p-3 flex justify-between items-center text-xs">
                      <div>
                        <p className="font-mono font-semibold text-slate-800">{ord.orderNumber}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">{new Date(ord.createdAt).toLocaleDateString()}</p>
                      </div>
                      <span className="font-mono font-bold text-brand-600">{formatINR(ord.totals.totalPaise)}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* B. Detailed Order Drawer */}
      {viewingOrder && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
          <div className="w-full max-w-xl bg-white border-l border-slate-200 p-6 overflow-y-auto space-y-6 shadow-2xl animate-in slide-in-from-right duration-300">
            <div className="flex justify-between items-start border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 font-mono">{viewingOrder.orderNumber}</h3>
                <p className="text-xs text-slate-400 mt-0.5">Purchased on {new Date(viewingOrder.createdAt).toLocaleString()}</p>
              </div>
              <button onClick={() => setViewingOrder(null)} className="text-slate-400 hover:text-slate-700 p-1 hover:bg-slate-100 rounded-lg">
                <X size={20} />
              </button>
            </div>

            {/* Customer Details */}
            {viewingOrder.customer && (
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-2 text-xs shadow-sm">
                <h4 className="text-[10px] uppercase font-bold text-slate-400">Customer Identity</h4>
                <div className="grid grid-cols-2 gap-2 text-slate-800">
                  <div>
                    <p className="text-slate-400 font-sans font-semibold">Name</p>
                    <p className="font-bold">{viewingOrder.customer.name}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 font-sans font-semibold">Email</p>
                    <p className="font-mono font-bold truncate">{viewingOrder.customer.email}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Delivery address */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-2 text-xs shadow-sm">
              <h4 className="text-[10px] uppercase font-bold text-slate-400">Delivery Address</h4>
              <p className="font-bold text-slate-800">{viewingOrder.address.recipient} ({viewingOrder.address.phone})</p>
              <p className="text-slate-500 font-normal leading-relaxed">{viewingOrder.address.lines.join(', ')}</p>
              <p className="text-slate-500 font-normal leading-relaxed">{viewingOrder.address.city}, {viewingOrder.address.state} - {viewingOrder.address.postalCode}</p>
            </div>

            {/* Items snapping */}
            <div className="space-y-3">
              <h4 className="text-[10px] uppercase font-bold text-slate-500">Order Items Snapshots</h4>
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl bg-white overflow-hidden shadow-sm">
                {viewingOrder.items.map((item: any, idx: number) => (
                  <div key={idx} className="p-3 flex justify-between items-center gap-4 text-xs">
                    <div>
                      <p className="font-bold text-slate-800">{item.name}</p>
                      <p className="text-[10px] text-slate-400 font-mono">Qty: {item.qty} • Unit Price: {formatINR(item.unitPricePaise)}</p>
                    </div>
                    <span className="font-mono font-bold text-slate-800">{formatINR(item.unitPricePaise * item.qty)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Timeline */}
            <div className="space-y-3">
              <h4 className="text-[10px] uppercase font-bold text-slate-500">Order timeline logs</h4>
              <div className="space-y-3 border-l-2 border-slate-200 ml-3 pl-4">
                {viewingOrder.timeline?.map((ev: any, idx: number) => (
                  <div key={idx} className="relative space-y-0.5">
                    <span className="absolute -left-[23px] top-1.5 h-2 w-2 rounded-full bg-brand-600 border border-white ring-4 ring-brand-100" />
                    <p className="text-xs font-bold text-slate-900 uppercase">{ev.status}</p>
                    <p className="text-[10px] text-slate-400 font-mono">
                      {new Date(ev.timestamp).toLocaleString()} • Actor: {ev.actor}
                    </p>
                    {ev.note && <p className="text-xs text-slate-500 italic font-normal">"{ev.note}"</p>}
                  </div>
                ))}
              </div>
            </div>

            {/* Pricing breakdown */}
            <div className="border-t border-slate-100 pt-4 space-y-2 text-xs font-mono">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal</span>
                <span className="text-slate-800 font-semibold">{formatINR(viewingOrder.totals.subtotalPaise)}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Coupon Discount</span>
                <span className="text-slate-800 font-semibold">-{formatINR(viewingOrder.totals.discountPaise)}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Shipping fee</span>
                <span className="text-slate-800 font-semibold">{formatINR(viewingOrder.totals.shippingPaise)}</span>
              </div>
              <div className="flex justify-between text-slate-900 font-bold text-sm pt-2 border-t border-dashed border-slate-200">
                <span>Grand Total</span>
                <span className="text-brand-600 text-base font-extrabold">{formatINR(viewingOrder.totals.totalPaise)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* C. Audit Log Details Modal */}
      {viewingAuditLog && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-xl p-6 overflow-hidden flex flex-col max-h-[85vh] shadow-2xl animate-in scale-in duration-200">
            <div className="flex justify-between items-start border-b border-slate-100 pb-4 shrink-0">
              <div>
                <h3 className="text-sm font-bold text-slate-900 font-mono uppercase">{viewingAuditLog.action}</h3>
                <p className="text-[10px] text-slate-400 font-mono mt-0.5">Logged {new Date(viewingAuditLog.createdAt).toLocaleString()}</p>
              </div>
              <button onClick={() => setViewingAuditLog(null)} className="text-slate-400 hover:text-slate-700 p-1 hover:bg-slate-100 rounded-lg">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 py-4 text-xs font-mono">
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200/80">
                <div>
                  <p className="text-slate-400 font-sans text-[10px] font-semibold">ADMINISTRATOR</p>
                  <p className="text-slate-800 font-bold">{viewingAuditLog.actor?.email}</p>
                </div>
                <div>
                  <p className="text-slate-400 font-sans text-[10px] font-semibold">REQUEST ID</p>
                  <p className="text-slate-800 font-bold">{viewingAuditLog.requestId}</p>
                </div>
              </div>

              {viewingAuditLog.before && (
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase font-bold font-sans">State Before Update</span>
                  <pre className="bg-red-50 p-3 rounded-lg border border-red-200 text-[10px] text-red-700 overflow-x-auto whitespace-pre-wrap">
                    {JSON.stringify(viewingAuditLog.before, null, 2)}
                  </pre>
                </div>
              )}

              {viewingAuditLog.after && (
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase font-bold font-sans">State After Update</span>
                  <pre className="bg-brand-50 p-3 rounded-lg border border-brand-200 text-[10px] text-brand-700 overflow-x-auto whitespace-pre-wrap">
                    {JSON.stringify(viewingAuditLog.after, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* D. Review Moderation Action Modal */}
      {moderatingReview && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-xl p-6 animate-in scale-in duration-200 space-y-4 shadow-2xl">
            <h3 className="text-sm font-bold text-slate-900">
              {moderationAction === 'approved' ? 'Approve Review Submission' : 'Reject Review Submission'}
            </h3>

            <p className="text-xs text-slate-500 italic">"{moderatingReview.body}"</p>

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold text-slate-500">Moderation Decision Reason</label>
              <input
                type="text"
                placeholder={moderationAction === 'approved' ? 'Optional reason...' : 'Specify reasons for rejection (required)'}
                value={moderationReason}
                onChange={(e) => setModerationReason(e.target.value)}
                className="w-full input-field py-2 text-xs"
                required={moderationAction === 'rejected'}
              />
              {moderationAction === 'rejected' && moderationReason.length < 5 && (
                <span className="text-[10px] text-red-600">Rejection reasons must be at least 5 characters.</span>
              )}
            </div>

            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => setModeratingReview(null)}
                className="text-xs font-bold py-1.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-750 rounded-lg shadow-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={moderationAction === 'rejected' && moderationReason.length < 5}
                onClick={() => moderateReviewMutation.mutate({ id: moderatingReview.id, status: moderationAction })}
                className={`text-xs font-bold py-1.5 px-4 rounded-lg text-white ${
                  moderationAction === 'approved' ? 'bg-brand-600 hover:bg-brand-700' : 'bg-red-600 hover:bg-red-700 disabled:opacity-50'
                }`}
              >
                Submit Action
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
