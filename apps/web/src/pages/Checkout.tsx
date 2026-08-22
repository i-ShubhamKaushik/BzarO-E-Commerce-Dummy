import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import { useCart } from '../hooks/useCart';
import { formatINR } from '../components/CartDrawer';
import { RazorpayModal } from '../components/RazorpayModal';
import { 
  MapPin, Plus, CreditCard, ShoppingBag, Loader2, 
  CheckCircle, ChevronRight, AlertTriangle, ArrowLeft
} from 'lucide-react';

export const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { cart, isLoading: cartLoading } = useCart();

  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [showAddressForm, setShowAddressForm] = useState(false);
  
  // Address form fields
  const [label, setLabel] = useState('Home');
  const [recipient, setRecipient] = useState('');
  const [phone, setPhone] = useState('');
  const [addressLines, setAddressLines] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [addressErrors, setAddressErrors] = useState<Record<string, string>>({});

  // Payment states
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [orderPaymentData, setOrderPaymentData] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [verifyingPayment, setVerifyingPayment] = useState(false);

  // Fetch addresses
  const { data: addresses, isLoading: addressesLoading, refetch: refetchAddresses } = useQuery({
    queryKey: ['user-addresses'],
    queryFn: async () => {
      const res = await api.get('/users/me/addresses');
      const addrs = res.data.data.addresses;
      // Pre-select default address if available
      const def = addrs.find((a: any) => a.isDefault);
      if (def) {
        setSelectedAddressId(def.id);
      } else if (addrs.length > 0) {
        setSelectedAddressId(addrs[0].id);
      }
      return addrs;
    }
  });

  // Create address mutation
  const createAddressMutation = useMutation({
    mutationFn: async (address: any) => {
      const res = await api.post('/users/me/addresses', address);
      return res.data.data.address;
    },
    onSuccess: (newAddr) => {
      refetchAddresses();
      setSelectedAddressId(newAddr.id);
      setShowAddressForm(false);
      // Reset form
      setRecipient('');
      setPhone('');
      setAddressLines('');
      setCity('');
      setState('');
      setPostalCode('');
      setAddressErrors({});
    },
    onError: (err: any) => {
      if (err.code === 'VALIDATION_ERROR' && err.fields) {
        setAddressErrors(err.fields);
      }
    }
  });

  // Initiate order creation mutation
  const initiateOrderMutation = useMutation({
    mutationFn: async (addressId: string) => {
      const res = await api.post('/checkout/payment-order', { addressId });
      return res.data.data;
    },
    onSuccess: (data) => {
      setOrderPaymentData(data);
      setIsPaymentOpen(true);
    },
    onError: (err: any) => {
      setErrorMessage(err.message || 'Failed to initiate order placement');
    }
  });

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAddressErrors({});
    const lines = addressLines.split('\n').filter(line => line.trim());
    
    createAddressMutation.mutate({
      label,
      recipient,
      phone,
      lines,
      city,
      state,
      postalCode,
      isDefault: addresses?.length === 0, // Default if first address
    });
  };

  const handlePlaceOrder = () => {
    if (!selectedAddressId) {
      setErrorMessage('Please select or add a delivery address.');
      return;
    }
    setErrorMessage(null);
    initiateOrderMutation.mutate(selectedAddressId);
  };

  const handlePaymentComplete = async (
    razorpayPaymentId: string,
    signature: string,
    status: 'success' | 'failure'
  ) => {
    setIsPaymentOpen(false);
    
    if (status === 'failure') {
      setErrorMessage('Payment was cancelled or failed. Please try again.');
      return;
    }

    setVerifyingPayment(true);
    try {
      const res = await api.post('/checkout/verify-payment', {
        orderId: orderPaymentData.orderId,
        razorpayPaymentId,
        razorpaySignature: signature,
        simulateStatus: 'success',
      });
      
      const order = res.data.data.order;
      // Invalidate cart queries
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      // Redirect to success
      navigate(`/checkout/success?orderNumber=${order.orderNumber}`);
    } catch (err: any) {
      setErrorMessage(err.message || 'Payment verification failed.');
    } finally {
      setVerifyingPayment(false);
    }
  };

  if (cartLoading || addressesLoading || verifyingPayment) {
    return (
      <div className="h-96 flex items-center justify-center flex-col gap-3">
        <Loader2 className="animate-spin text-brand-500" size={36} />
        <p className="text-sm text-dark-400">
          {verifyingPayment 
            ? 'Confirming payment authorization...' 
            : 'Assembling checkout quote...'}
        </p>
      </div>
    );
  }

  if (cart.items.length === 0) {
    return (
      <div className="h-96 flex flex-col items-center justify-center text-center gap-4">
        <ShoppingBag size={32} className="text-dark-500" />
        <h3 className="text-sm font-semibold text-white">Your checkout session is empty</h3>
        <button onClick={() => navigate('/products')} className="btn-secondary py-1.5 px-4 text-xs font-semibold">
          Return to Storefront
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16">
      
      <div className="flex items-center gap-2">
        <button 
          onClick={() => navigate(-1)}
          className="text-slate-500 hover:text-slate-900 transition-colors p-1 hover:bg-slate-100 rounded-lg"
        >
          <ArrowLeft size={16} />
        </button>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Checkout Order Review</h1>
      </div>

      {errorMessage && (
        <div className="flex items-start gap-2.5 p-4 rounded-xl bg-red-50 border border-red-200 text-red-750 text-sm">
          <AlertTriangle size={18} className="shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Main Grid: Left address and details, Right Price Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Address Section */}
          <div className="space-y-4">
            <h3 className="text-md font-bold text-slate-900 flex items-center gap-2">
              <MapPin size={18} className="text-brand-600" />
              1. Delivery Address
            </h3>

            {addresses && addresses.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {addresses.map((addr: any) => (
                  <div
                    key={addr.id}
                    onClick={() => setSelectedAddressId(addr.id)}
                    className={`p-4 rounded-xl cursor-pointer border transition-all flex flex-col justify-between min-h-[140px] shadow-sm ${
                      selectedAddressId === addr.id
                        ? 'border-brand-600 bg-brand-50'
                        : 'border-slate-200 bg-white hover:border-slate-350'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">{addr.label}</span>
                        {addr.isDefault && (
                          <span className="text-[10px] text-brand-700 bg-brand-50 border border-brand-100 px-1.5 py-0.5 rounded font-bold">Default</span>
                        )}
                      </div>
                      <p className="text-xs text-slate-800 mt-2 font-bold">{addr.recipient}</p>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                        {addr.lines.join(', ')}, {addr.city}, {addr.state} - {addr.postalCode}
                      </p>
                    </div>
                    <p className="text-[10px] text-slate-400 font-mono mt-2">{addr.phone}</p>
                  </div>
                ))}

                {/* Add new address placeholder */}
                {!showAddressForm && (
                  <button
                    onClick={() => setShowAddressForm(true)}
                    className="p-4 rounded-xl border border-dashed border-slate-300 hover:border-slate-450 bg-white flex flex-col items-center justify-center gap-2 text-slate-500 hover:text-slate-800 transition-all min-h-[140px]"
                  >
                    <Plus size={20} />
                    <span className="text-xs font-semibold">Add New Address</span>
                  </button>
                )}
              </div>
            ) : (
              // Prompt address creation form directly if empty
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                <p className="text-xs text-slate-505 font-normal">You don't have any shipping addresses saved. Please add one to proceed.</p>
                {!showAddressForm && (
                  <button 
                    onClick={() => setShowAddressForm(true)}
                    className="btn-primary py-2 text-xs font-semibold"
                  >
                    Create Address
                  </button>
                )}
              </div>
            )}

            {/* Address Form Sheet */}
            {showAddressForm && (
              <form onSubmit={handleAddressSubmit} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4 animate-in fade-in slide-in-from-top duration-200">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h4 className="text-sm font-bold text-slate-900">Add Shipping Address</h4>
                  <button 
                    type="button"
                    onClick={() => setShowAddressForm(false)}
                    className="text-xs text-slate-450 hover:text-slate-700"
                  >
                    Cancel
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-500">Address Label</label>
                    <select
                      value={label}
                      onChange={(e) => setLabel(e.target.value)}
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
                      value={recipient}
                      onChange={(e) => setRecipient(e.target.value)}
                      className={`w-full input-field py-2 text-xs ${addressErrors.recipient ? 'border-red-500' : ''}`}
                      required
                    />
                    {addressErrors.recipient && <p className="text-[10px] text-red-650">{addressErrors.recipient}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-500">Phone Number (10 digits)</label>
                    <input
                      type="tel"
                      placeholder="9876543210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className={`w-full input-field py-2 text-xs ${addressErrors.phone ? 'border-red-500' : ''}`}
                      required
                    />
                    {addressErrors.phone && <p className="text-[10px] text-red-650">{addressErrors.phone}</p>}
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-500">Pincode (6 digits)</label>
                    <input
                      type="text"
                      placeholder="560001"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      className={`w-full input-field py-2 text-xs ${addressErrors.postalCode ? 'border-red-500' : ''}`}
                      required
                    />
                    {addressErrors.postalCode && <p className="text-[10px] text-red-650">{addressErrors.postalCode}</p>}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-500">Address Lines (One line per row)</label>
                  <textarea
                    placeholder="e.g. Flat 302, Green Glen Apartments, Outer Ring Road"
                    rows={2}
                    value={addressLines}
                    onChange={(e) => setAddressLines(e.target.value)}
                    className={`w-full input-field py-2 text-xs ${addressErrors.lines ? 'border-red-500' : ''}`}
                    required
                  />
                  {addressErrors.lines && <p className="text-[10px] text-red-650">{addressErrors.lines}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-500">City</label>
                    <input
                      type="text"
                      placeholder="e.g. Bengaluru"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className={`w-full input-field py-2 text-xs ${addressErrors.city ? 'border-red-500' : ''}`}
                      required
                    />
                    {addressErrors.city && <p className="text-[10px] text-red-650">{addressErrors.city}</p>}
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-500">State</label>
                    <input
                      type="text"
                      placeholder="e.g. Karnataka"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className={`w-full input-field py-2 text-xs ${addressErrors.state ? 'border-red-500' : ''}`}
                      required
                    />
                    {addressErrors.state && <p className="text-[10px] text-red-650">{addressErrors.state}</p>}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={createAddressMutation.isPending}
                  className="w-full btn-primary py-2.5 text-xs font-bold"
                >
                  {createAddressMutation.isPending ? 'Saving...' : 'Save & Select Address'}
                </button>
              </form>
            )}
          </div>

          {/* Bag items list review */}
          <div className="space-y-4">
            <h3 className="text-md font-bold text-slate-900 flex items-center gap-2">
              <ShoppingBag size={18} className="text-brand-600" />
              2. Review Bag Items
            </h3>
            <div className="rounded-xl border border-slate-200 bg-white overflow-hidden divide-y divide-slate-100 shadow-sm">
              {cart.items.map((item: any) => (
                <div key={`${item.productId}-${item.variantId || ''}`} className="p-4 flex gap-4 items-center justify-between">
                  <div className="flex gap-4 items-center min-w-0">
                    <div className="w-12 h-12 bg-white border border-slate-200 rounded-lg overflow-hidden shrink-0">
                      <img src={item.product.image} alt={item.product.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-slate-900 truncate">{item.product.title}</h4>
                      {item.product.variantLabel && (
                        <p className="text-[10px] text-slate-500 mt-0.5">{item.product.variantLabel}</p>
                      )}
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5">Qty: {item.qty} × {formatINR(item.product.unitPricePaise)}</p>
                    </div>
                  </div>

                  <span className="text-xs font-bold text-brand-650">
                    {formatINR(item.product.unitPricePaise * item.qty)}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column (Price Summary / Checkout Box) */}
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-xl border border-slate-200 space-y-5 bg-white shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider pb-3 border-b border-slate-100">
              Order Pricing
            </h3>

            {/* Price breakdown */}
            <div className="space-y-3 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="text-slate-900 font-semibold">{formatINR(cart.totals.subtotalPaise)}</span>
              </div>
              {cart.totals.discountPaise > 0 && (
                <div className="flex justify-between text-brand-600 font-semibold">
                  <span>Coupon Discount ({cart.couponCode})</span>
                  <span className="font-bold">-{formatINR(cart.totals.discountPaise)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping Fees</span>
                <span className="text-slate-900 font-semibold">
                  {cart.totals.shippingPaise === 0 ? 'FREE' : formatINR(cart.totals.shippingPaise)}
                </span>
              </div>
              <div className="flex justify-between text-[10px] text-slate-400 border-t border-slate-200/80 pt-3">
                <span>GST Component (18% inc.)</span>
                <span>{formatINR(cart.totals.taxPaise)}</span>
              </div>
              <div className="flex justify-between text-sm text-slate-900 font-bold pt-1">
                <span>Total Amount Due</span>
                <span className="text-brand-600 text-base font-extrabold">{formatINR(cart.totals.totalPaise)}</span>
              </div>
            </div>

            {/* Checkout Action */}
            <button
              onClick={handlePlaceOrder}
              disabled={initiateOrderMutation.isPending}
              className="w-full btn-primary py-3.5 text-sm font-semibold flex items-center justify-center gap-2"
            >
              <CreditCard size={16} />
              {initiateOrderMutation.isPending ? 'Initiating...' : 'Authorize Test Payment'}
            </button>

            {/* Verification policies hint */}
            <div className="text-[10px] text-slate-400 leading-relaxed space-y-1">
              <p>By completing this simulated checkout, you agree to the mock licensing terms of the showcase.</p>
              <p className="underline cursor-pointer hover:text-slate-650">Read Returns Policy</p>
            </div>
          </div>
        </div>

      </div>

      {/* Reusable Razorpay payment simulation frame */}
      <RazorpayModal
        isOpen={isPaymentOpen}
        orderData={orderPaymentData}
        onClose={() => setIsPaymentOpen(false)}
        onPaymentComplete={handlePaymentComplete}
      />

    </div>
  );
};
