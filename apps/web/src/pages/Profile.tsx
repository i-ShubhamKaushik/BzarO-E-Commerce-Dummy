import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../app/store';
import { setCredentials } from '../features/auth/authSlice';
import { formatINR } from '../components/CartDrawer';
import { toggleCartDrawer } from '../features/ui/uiSlice';
import { useCart } from '../hooks/useCart';
import { 
  User, MapPin, Package, Heart, Trash2, Edit2, Plus, 
  Trash, Save, ShoppingBag, Loader2, CheckCircle2, 
  ChevronRight, RefreshCw, X, AlertTriangle, Eye, ShieldCheck
} from 'lucide-react';

export const Profile: React.FC = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const { addToCart } = useCart();
  const location = useLocation();
  const navigate = useNavigate();

  // Determine active tab from route path
  const getTabFromPath = (path: string): 'overview' | 'orders' | 'wishlist' | 'addresses' => {
    if (path.endsWith('/profile/orders')) return 'orders';
    if (path.endsWith('/profile/wishlist')) return 'wishlist';
    if (path.endsWith('/profile/addresses')) return 'addresses';
    return 'overview';
  };

  const activeTab = getTabFromPath(location.pathname);

  const handleTabChange = (tab: 'overview' | 'orders' | 'wishlist' | 'addresses') => {
    if (tab === 'overview') {
      navigate('/profile');
    } else {
      navigate(`/profile/${tab}`);
    }
  };

  // Edit Profile States
  const [editName, setEditName] = useState(user?.name || '');
  const [editPhone, setEditPhone] = useState(user?.phone || '');
  const [editAvatar, setEditAvatar] = useState(user?.avatar || '');
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);

  // Address CRUD Form State
  const [showAddrForm, setShowAddrForm] = useState(false);
  const [editingAddrId, setEditingAddrId] = useState<string | null>(null);
  const [addrLabel, setAddrLabel] = useState('Home');
  const [addrRecipient, setAddrRecipient] = useState('');
  const [addrPhone, setAddrPhone] = useState('');
  const [addrLines, setAddrLines] = useState('');
  const [addrCity, setAddrCity] = useState('');
  const [addrState, setAddrState] = useState('');
  const [addrPostalCode, setAddrPostalCode] = useState('');

  // Selected Order Detail Modal State
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  // Queries
  const { data: orders, isLoading: ordersLoading, refetch: refetchOrders } = useQuery({
    queryKey: ['profile-orders'],
    queryFn: async () => {
      const res = await api.get('/orders');
      return res.data.data.orders;
    }
  });

  const { data: wishlist, isLoading: wishlistLoading, refetch: refetchWishlist } = useQuery({
    queryKey: ['profile-wishlist'],
    queryFn: async () => {
      const res = await api.get('/wishlist');
      return res.data.data.products;
    }
  });

  const { data: addresses, isLoading: addressesLoading, refetch: refetchAddresses } = useQuery({
    queryKey: ['profile-addresses'],
    queryFn: async () => {
      const res = await api.get('/users/me/addresses');
      return res.data.data.addresses;
    }
  });

  // Profile Edit Mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (updates: any) => {
      const res = await api.patch('/users/me', updates);
      return res.data.data.user;
    },
    onSuccess: (updatedUser) => {
      dispatch(setCredentials(updatedUser));
      setProfileSuccess('Profile updated successfully.');
      setTimeout(() => setProfileSuccess(null), 3000);
    }
  });

  // Address CRUD Mutations
  const saveAddressMutation = useMutation({
    mutationFn: async (payload: { id?: string; data: any }) => {
      if (payload.id) {
        const res = await api.patch(`/users/me/addresses/${payload.id}`, payload.data);
        return res.data.data.address;
      } else {
        const res = await api.post('/users/me/addresses', payload.data);
        return res.data.data.address;
      }
    },
    onSuccess: () => {
      refetchAddresses();
      setShowAddrForm(false);
      setEditingAddrId(null);
      // Reset Form
      setAddrRecipient('');
      setAddrPhone('');
      setAddrLines('');
      setAddrCity('');
      setAddrState('');
      setAddrPostalCode('');
    }
  });

  const deleteAddressMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/users/me/addresses/${id}`);
    },
    onSuccess: () => {
      refetchAddresses();
    }
  });

  // Wishlist mutations
  const deleteWishlistItemMutation = useMutation({
    mutationFn: async (productId: string) => {
      await api.delete(`/wishlist/${productId}`);
    },
    onSuccess: () => {
      refetchWishlist();
    }
  });

  // Order Cancel Mutation
  const cancelOrderMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.post(`/orders/${id}/cancel`);
      return res.data.data.order;
    },
    onSuccess: (updatedOrder) => {
      refetchOrders();
      setSelectedOrder(updatedOrder);
    }
  });

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMutation.mutate({
      name: editName,
      phone: editPhone,
      avatar: editAvatar || undefined
    });
  };

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const lines = addrLines.split('\n').filter(l => l.trim());
    const payload = {
      label: addrLabel,
      recipient: addrRecipient,
      phone: addrPhone,
      lines,
      city: addrCity,
      state: addrState,
      postalCode: addrPostalCode,
      isDefault: addresses?.length === 0
    };

    saveAddressMutation.mutate({
      id: editingAddrId || undefined,
      data: payload
    });
  };

  const handleEditAddressClick = (addr: any) => {
    setEditingAddrId(addr.id);
    setAddrLabel(addr.label);
    setAddrRecipient(addr.recipient);
    setAddrPhone(addr.phone);
    setAddrLines(addr.lines.join('\n'));
    setAddrCity(addr.city);
    setAddrState(addr.state);
    setAddrPostalCode(addr.postalCode);
    setShowAddrForm(true);
  };

  const handleCancelOrder = async (orderId: string) => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      try {
        await cancelOrderMutation.mutateAsync(orderId);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleMoveToCart = async (prod: any) => {
    try {
      await addToCart({ productId: prod.id, qty: 1 });
      await deleteWishlistItemMutation.mutateAsync(prod.id);
      dispatch(toggleCartDrawer(true));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 pb-16">
      
      {/* 1. Left Tab Menu */}
      <div className="w-full lg:w-64 shrink-0 space-y-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 text-center space-y-3 shadow-sm">
          <div className="w-20 h-20 rounded-full overflow-hidden mx-auto border border-brand-500/20 bg-slate-100 shrink-0">
            <img 
              src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'} 
              alt={user?.name}
              className="w-full h-full object-cover" 
            />
          </div>
          <div className="space-y-0.5">
            <h3 className="text-sm font-bold text-slate-900 truncate">{user?.name}</h3>
            <p className="text-[10px] text-slate-400 font-mono tracking-wide">{user?.email}</p>
          </div>
          <span className="inline-block text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-brand-50 border border-brand-100 text-brand-700">
            {user?.role} Account
          </span>
        </div>

        {/* Tab Links */}
        <div className="flex flex-col gap-1">
          <button
            onClick={() => handleTabChange('overview')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-semibold tracking-wide transition-all ${
              activeTab === 'overview'
                ? 'bg-slate-100 text-brand-600 border-l-2 border-brand-500'
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
            }`}
          >
            <User size={16} />
            Profile Details
          </button>

          <button
            onClick={() => handleTabChange('orders')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-xs font-semibold tracking-wide transition-all ${
              activeTab === 'orders'
                ? 'bg-slate-100 text-brand-600 border-l-2 border-brand-500'
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <Package size={16} />
              <span>Order History</span>
            </div>
            {orders && orders.length > 0 && (
              <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded-full font-mono font-bold">{orders.length}</span>
            )}
          </button>

          <button
            onClick={() => handleTabChange('wishlist')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-xs font-semibold tracking-wide transition-all ${
              activeTab === 'wishlist'
                ? 'bg-slate-100 text-brand-600 border-l-2 border-brand-500'
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <Heart size={16} />
              <span>My Wishlist</span>
            </div>
            {wishlist && wishlist.length > 0 && (
              <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded-full font-mono font-bold">{wishlist.length}</span>
            )}
          </button>

          <button
            onClick={() => handleTabChange('addresses')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-semibold tracking-wide transition-all ${
              activeTab === 'addresses'
                ? 'bg-slate-100 text-brand-600 border-l-2 border-brand-500'
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
            }`}
          >
            <MapPin size={16} />
            Address Book
          </button>
        </div>

      </div>

      {/* 2. Right Tab Content */}
      <div className="flex-1">
        
        {/* Tab 1: Profile Details Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-slate-900">Profile Details</h2>
              <p className="text-xs text-slate-500">Update your primary shopping coordinates and user avatar.</p>
            </div>

            <form onSubmit={handleProfileSubmit} className="bg-white p-6 rounded-xl border border-slate-200 space-y-4 max-w-xl shadow-sm">
              {profileSuccess && (
                <div className="p-3.5 rounded-lg bg-brand-50 border border-brand-200 text-brand-700 text-xs flex gap-2">
                  <CheckCircle2 size={16} className="shrink-0 mt-0.5 text-brand-600" />
                  <span>{profileSuccess}</span>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-slate-500">Full Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full input-field text-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-slate-500">Email Address (Immutable)</label>
                  <input
                    type="email"
                    value={user?.email}
                    className="w-full input-field text-xs bg-slate-100 text-slate-500 border-slate-200 cursor-not-allowed"
                    disabled
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-slate-500">Phone Number</label>
                  <input
                    type="text"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full input-field text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-slate-500">Avatar Image URL</label>
                <input
                  type="url"
                  placeholder="Paste URL link for avatar image"
                  value={editAvatar}
                  onChange={(e) => setEditAvatar(e.target.value)}
                  className="w-full input-field text-xs font-mono"
                />
              </div>

              <button
                type="submit"
                disabled={updateProfileMutation.isPending}
                className="btn-primary py-2.5 px-6 text-xs font-semibold self-start"
              >
                {updateProfileMutation.isPending ? 'Saving changes...' : 'Save Profile Details'}
              </button>
            </form>
          </div>
        )}

        {/* Tab 2: Orders History */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="space-y-1 flex justify-between items-end">
              <div>
                <h2 className="text-lg font-bold text-slate-900 font-sans">Order History</h2>
                <p className="text-xs text-slate-500">Track shipment timelines, payment statuses, and cancel pending purchases.</p>
              </div>
              <button 
                onClick={() => refetchOrders()}
                className="text-xs text-slate-500 hover:text-slate-900 flex items-center gap-1.5 transition-colors bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 shadow-sm"
              >
                <RefreshCw size={12} className={ordersLoading ? 'animate-spin' : ''} />
                Refresh
              </button>
            </div>

            {ordersLoading ? (
              <div className="h-64 flex items-center justify-center">
                <Loader2 className="animate-spin text-brand-600" size={32} />
              </div>
            ) : !orders || orders.length === 0 ? (
              <div className="p-12 rounded-xl border border-dashed border-slate-200 text-center text-xs text-slate-500 space-y-3 bg-white shadow-sm">
                <ShoppingBag size={24} className="mx-auto text-slate-400" />
                <p className="font-normal">No orders placed yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order: any) => (
                  <div 
                    key={order.id}
                    className="p-5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50/40 transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-slate-900">{order.orderNumber}</span>
                        <span className={`text-[9px] uppercase font-extrabold tracking-wider px-1.5 py-0.5 rounded ${
                          ['paid', 'processing', 'shipped', 'delivered'].includes(order.status)
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-red-50 text-red-700 border border-red-200'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 font-mono">Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                      <p className="text-xs text-slate-600 font-normal">
                        {order.items.length} {order.items.length === 1 ? 'item' : 'items'} • Total: <span className="text-slate-900 font-bold">{formatINR(order.totals.totalPaise)}</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto self-stretch md:self-auto justify-end">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="btn-secondary py-1.5 px-3 text-xs font-bold flex items-center gap-1"
                      >
                        <Eye size={12} />
                        Track Order
                      </button>
                      
                      {['pending_payment', 'paid', 'processing'].includes(order.status) && (
                        <button
                          onClick={() => handleCancelOrder(order.id)}
                          className="py-1.5 px-3 text-xs font-semibold rounded bg-red-50 hover:bg-red-100/80 border border-red-200 text-red-700 transition-all"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Wishlist */}
        {activeTab === 'wishlist' && (
          <div className="space-y-6">
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-slate-900">My Wishlist</h2>
              <p className="text-xs text-slate-500">Save products to shop later or transfer directly to cart.</p>
            </div>

            {wishlistLoading ? (
              <div className="h-64 flex items-center justify-center">
                <Loader2 className="animate-spin text-brand-600" size={32} />
              </div>
            ) : !wishlist || wishlist.length === 0 ? (
              <div className="p-12 rounded-xl border border-dashed border-slate-200 text-center text-xs text-slate-500 space-y-3 bg-white shadow-sm">
                <Heart size={24} className="mx-auto text-slate-400" />
                <p className="font-normal">Your wishlist is empty.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {wishlist.map((prod: any) => (
                  <div key={prod.id} className="group glass-card rounded-xl overflow-hidden flex flex-col h-full bg-white relative">
                    <div className="aspect-square bg-white border-b border-slate-100 relative overflow-hidden shrink-0">
                      <img src={prod.images[0]?.url} alt={prod.title} className="w-full h-full object-cover" />
                      <button
                        onClick={() => deleteWishlistItemMutation.mutate(prod.id)}
                        className="absolute top-3 right-3 p-1.5 rounded-lg bg-white/95 hover:bg-red-50 hover:text-red-700 text-slate-500 transition-colors shadow shadow-slate-200/50"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    
                    <div className="p-4 flex flex-col justify-between flex-1 space-y-4">
                      <div>
                        <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider font-mono">{prod.brand}</span>
                        <h4 className="text-xs font-semibold text-slate-900 truncate mt-0.5">{prod.title}</h4>
                        <span className="text-xs font-bold text-brand-650 mt-2 block">{formatINR(prod.pricePaise)}</span>
                      </div>

                      <button
                        onClick={() => handleMoveToCart(prod)}
                        disabled={prod.stock <= 0}
                        className="w-full btn-primary py-2 text-xs font-bold flex items-center justify-center gap-1.5"
                      >
                        <ShoppingBag size={12} />
                        Move to Bag
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}        {/* Tab 4: Addresses */}
        {activeTab === 'addresses' && (
          <div className="space-y-6">
            <div className="space-y-1 flex justify-between items-end">
              <div>
                <h2 className="text-lg font-bold text-slate-900 font-sans">Address Book</h2>
                <p className="text-xs text-slate-500">Manage multiple domestic shipping addresses.</p>
              </div>
              {!showAddrForm && (
                <button
                  onClick={() => {
                    setEditingAddrId(null);
                    setShowAddrForm(true);
                  }}
                  className="btn-secondary py-1.5 px-3 text-xs font-bold flex items-center gap-1"
                >
                  <Plus size={14} />
                  Add Address
                </button>
              )}
            </div>

            {/* Address CRUD Form */}
            {showAddrForm && (
              <form onSubmit={handleAddressSubmit} className="bg-white p-6 rounded-xl border border-slate-200 space-y-4 max-w-xl shadow-sm animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h4 className="text-sm font-bold text-slate-900">
                    {editingAddrId ? 'Edit Address Details' : 'Add New Address'}
                  </h4>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddrForm(false);
                      setEditingAddrId(null);
                    }}
                    className="text-xs text-slate-450 hover:text-slate-700"
                  >
                    Cancel
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-500">Label</label>
                    <select
                      value={addrLabel}
                      onChange={(e) => setAddrLabel(e.target.value)}
                      className="w-full input-field py-2.5 text-xs bg-white"
                    >
                      <option value="Home">Home</option>
                      <option value="Office">Office</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-500">Recipient Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Rahul Varma"
                      value={addrRecipient}
                      onChange={(e) => setAddrRecipient(e.target.value)}
                      className="w-full input-field py-2 text-xs"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-500">Phone</label>
                    <input
                      type="tel"
                      value={addrPhone}
                      onChange={(e) => setAddrPhone(e.target.value)}
                      className="w-full input-field py-2 text-xs"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-500">Pincode (6 digits)</label>
                    <input
                      type="text"
                      value={addrPostalCode}
                      onChange={(e) => setAddrPostalCode(e.target.value)}
                      className="w-full input-field py-2 text-xs"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-500">Address lines</label>
                  <textarea
                    rows={2}
                    value={addrLines}
                    onChange={(e) => setAddrLines(e.target.value)}
                    className="w-full input-field py-2 text-xs"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-500">City</label>
                    <input
                      type="text"
                      value={addrCity}
                      onChange={(e) => setAddrCity(e.target.value)}
                      className="w-full input-field py-2 text-xs"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-500">State</label>
                    <input
                      type="text"
                      value={addrState}
                      onChange={(e) => setAddrState(e.target.value)}
                      className="w-full input-field py-2 text-xs"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={saveAddressMutation.isPending}
                  className="w-full btn-primary py-2.5 text-xs font-bold"
                >
                  {saveAddressMutation.isPending ? 'Saving...' : 'Save Address Info'}
                </button>
              </form>
            )}

            {/* List of addresses */}
            {addressesLoading ? (
              <div className="h-48 flex items-center justify-center">
                <Loader2 className="animate-spin text-brand-600" size={32} />
              </div>
            ) : !addresses || addresses.length === 0 ? (
              <div className="p-8 rounded-xl border border-dashed border-slate-200 text-center text-xs text-slate-500 bg-white shadow-sm">
                No addresses saved in address book.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {addresses.map((addr: any) => (
                  <div 
                    key={addr.id}
                    className="p-5 rounded-xl border border-slate-200 bg-white flex flex-col justify-between min-h-[160px] shadow-sm"
                  >
                    <div>
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-slate-700 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">
                          {addr.label}
                        </span>
                        {addr.isDefault && (
                          <span className="text-[9px] uppercase font-bold text-brand-700 bg-brand-50 border border-brand-100 px-1.5 py-0.5 rounded">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-bold text-slate-900 mt-3">{addr.recipient}</p>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed line-clamp-2">
                        {addr.lines.join(', ')}, {addr.city}, {addr.state} - {addr.postalCode}
                      </p>
                    </div>

                    <div className="flex justify-between items-center mt-4 border-t border-slate-100 pt-3">
                      <span className="text-[10px] text-slate-400 font-mono">{addr.phone}</span>
                      <div className="flex gap-2.5">
                        <button
                          onClick={() => handleEditAddressClick(addr)}
                          className="text-xs text-brand-600 hover:text-brand-700 font-bold flex items-center gap-0.5"
                        >
                          <Edit2 size={12} />
                          Edit
                        </button>
                        {!addr.isDefault && (
                          <button
                            onClick={() => deleteAddressMutation.mutate(addr.id)}
                            className="text-xs text-red-600 hover:text-red-750 font-bold flex items-center gap-0.5"
                          >
                            <Trash size={12} />
                            Delete
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>

      {/* 3. Order detail overlay Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs" onClick={() => setSelectedOrder(null)} />
          <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
            
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
              <div>
                <h3 className="text-md font-bold text-slate-900">Order Tracking Details</h3>
                <span className="text-[10px] font-mono text-slate-400">{selectedOrder.orderNumber}</span>
              </div>
              <button 
                onClick={() => setSelectedOrder(null)}
                className="text-slate-450 hover:text-slate-700 p-1 hover:bg-slate-100 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* Timeline Progress Bar */}
              <div className="space-y-4 bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Shipping Status Timeline</h4>
                <div className="space-y-4 pt-2">
                  {selectedOrder.timeline.map((evt: any, idx: number) => (
                    <div key={idx} className="flex gap-4 relative">
                      {/* Timeline bar line */}
                      {idx < selectedOrder.timeline.length - 1 && (
                        <div className="absolute left-[9px] top-4 bottom-0 w-0.5 bg-slate-200" />
                      )}
                      
                      {/* Timeline dot */}
                      <div className={`w-5 h-5 rounded-full shrink-0 flex items-center justify-center ring-4 ring-white z-10 ${
                        idx === selectedOrder.timeline.length - 1
                          ? 'bg-brand-600 text-white animate-pulse shadow-sm'
                          : 'bg-slate-200 text-slate-500'
                      }`}>
                        <CheckCircle2 size={10} fill="currentColor" className={idx === selectedOrder.timeline.length - 1 ? 'text-white' : 'text-slate-400'} />
                      </div>

                      <div className="space-y-0.5 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900 uppercase">{evt.status}</span>
                          <span className="text-[9px] text-slate-400 font-mono">{new Date(evt.timestamp).toLocaleString()}</span>
                        </div>
                        {evt.note && <p className="text-xs text-slate-600 font-sans mt-0.5 font-normal leading-relaxed">{evt.note}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Items Details */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Order Items Snapshot</h4>
                <div className="rounded-xl border border-slate-200 bg-slate-50/50 divide-y divide-slate-100 overflow-hidden shadow-sm">
                  {selectedOrder.items.map((item: any, idx: number) => (
                    <div key={idx} className="p-3.5 flex justify-between items-center text-xs">
                      <div className="flex gap-3 items-center min-w-0">
                        <div className="w-10 h-10 bg-white rounded overflow-hidden shrink-0 border border-slate-200">
                          <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="min-w-0">
                          <span className="font-bold text-slate-800 truncate block">{item.name}</span>
                          {item.variantLabel && <span className="text-[10px] text-slate-500">{item.variantLabel}</span>}
                          <span className="text-[9px] font-mono text-slate-400 block">SKU: {item.sku}</span>
                        </div>
                      </div>
                      <div className="text-right font-mono">
                        <span className="text-slate-500 block">{item.qty} × {formatINR(item.unitPricePaise)}</span>
                        <span className="text-brand-600 font-semibold">{formatINR(item.unitPricePaise * item.qty)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Address detail */}
              <div className="space-y-1.5 text-xs">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Shipping Destination</h4>
                <p className="font-bold text-slate-800">{selectedOrder.address.recipient}</p>
                <p className="text-slate-500 leading-relaxed font-normal">
                  {selectedOrder.address.lines.join(', ')}, {selectedOrder.address.city}, {selectedOrder.address.state} - {selectedOrder.address.postalCode}
                </p>
                <p className="text-[10px] text-slate-400 font-mono mt-1">Contact: {selectedOrder.address.phone}</p>
              </div>

              {/* Pricing summary */}
              <div className="space-y-2 border-t border-slate-100 pt-4 text-xs">
                <div className="flex justify-between text-slate-650">
                  <span>Subtotal</span>
                  <span className="text-slate-900 font-semibold">{formatINR(selectedOrder.totals.subtotalPaise)}</span>
                </div>
                {selectedOrder.totals.discountPaise > 0 && (
                  <div className="flex justify-between text-brand-600 font-semibold">
                    <span>Discount ({selectedOrder.couponCode})</span>
                    <span>-{formatINR(selectedOrder.totals.discountPaise)}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-650">
                  <span>Shipping</span>
                  <span className="text-slate-900 font-semibold">{selectedOrder.totals.shippingPaise === 0 ? 'FREE' : formatINR(selectedOrder.totals.shippingPaise)}</span>
                </div>
                <div className="flex justify-between text-slate-900 font-bold text-sm pt-2 border-t border-dashed border-slate-200">
                  <span>Grand Total</span>
                  <span className="text-brand-600 text-base font-extrabold">{formatINR(selectedOrder.totals.totalPaise)}</span>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};
