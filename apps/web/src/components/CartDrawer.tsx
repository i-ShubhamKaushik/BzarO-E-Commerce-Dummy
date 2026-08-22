import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../app/store';
import { toggleCartDrawer } from '../features/ui/uiSlice';
import { useCart } from '../hooks/useCart';
import { useNavigate } from 'react-router-dom';
import { X, ShoppingBag, Plus, Minus, Trash2, Tag, Ticket, ArrowRight, Loader2 } from 'lucide-react';

export const formatINR = (paise: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(paise / 100);
};

export const CartDrawer: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartDrawerOpen = useSelector((state: RootState) => state.ui.cartDrawerOpen);
  
  const { cart, isLoading, syncCart, removeFromCart, applyCoupon, removeCoupon, isUpdating } = useCart();
  
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState<string | null>(null);

  if (!cartDrawerOpen) return null;

  const handleClose = () => {
    dispatch(toggleCartDrawer(false));
  };

  const handleQtyChange = async (item: any, newQty: number) => {
    if (newQty < 1) return;
    if (newQty > item.product.stock) return;

    // Build the full updated items list to synchronize
    const updatedItems = cart.items.map((i: any) => {
      if (i.productId === item.productId && i.variantId === item.variantId) {
        return { productId: i.productId, variantId: i.variantId, qty: newQty };
      }
      return { productId: i.productId, variantId: i.variantId, qty: i.qty };
    });

    try {
      await syncCart(updatedItems);
    } catch (err: any) {
      console.error(err);
    }
  };

  const handleRemoveItem = async (item: any) => {
    try {
      await removeFromCart({ productId: item.productId, variantId: item.variantId });
    } catch (err: any) {
      console.error(err);
    }
  };

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    setCouponError(null);
    try {
      await applyCoupon(couponCode);
      setCouponCode('');
    } catch (err: any) {
      setCouponError(err.message || 'Invalid coupon code');
    }
  };

  const handleCheckoutClick = () => {
    handleClose();
    navigate('/checkout');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Background overlay */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-300"
        onClick={handleClose}
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-slate-200 shadow-2xl flex flex-col h-full animate-in slide-in-from-right duration-300">
          
          {/* Header */}
          <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag size={20} className="text-brand-600" />
              <h2 className="text-lg font-bold text-slate-900">Your Shopping Bag</h2>
              <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">
                {cart.items.reduce((sum: number, item: any) => sum + item.qty, 0)}
              </span>
            </div>
            <button 
              onClick={handleClose}
              className="text-slate-400 hover:text-slate-700 transition-colors p-1 hover:bg-slate-100 rounded-lg"
            >
              <X size={20} />
            </button>
          </div>

          {/* Cart Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {isLoading ? (
              <div className="h-full flex items-center justify-center flex-col gap-2">
                <Loader2 className="animate-spin text-brand-600" size={32} />
                <p className="text-sm text-slate-500">Retrieving your bag...</p>
              </div>
            ) : cart.items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center gap-4 py-12">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                  <ShoppingBag size={32} />
                </div>
                <div className="space-y-1">
                  <h3 className="text-md font-semibold text-slate-900">Your bag is empty</h3>
                  <p className="text-sm text-slate-500">Explore the catalogue and add items to get started.</p>
                </div>
                <button 
                  onClick={handleClose}
                  className="btn-secondary py-2 text-xs font-medium"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.items.map((item: any) => (
                  <div 
                    key={`${item.productId}-${item.variantId || ''}`}
                    className="flex gap-4 p-4 rounded-xl bg-slate-50/50 border border-slate-200/80 hover:border-slate-300 transition-all duration-200 shadow-sm"
                  >
                    {/* Item Image */}
                    <div className="w-20 h-20 bg-white rounded-lg overflow-hidden border border-slate-200 shrink-0">
                      <img 
                        src={item.product.image || 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=200'} 
                        alt={item.product.title} 
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Item details */}
                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      <div>
                        <div className="flex justify-between items-start gap-1">
                          <h4 className="text-sm font-semibold text-slate-900 truncate hover:text-brand-600 transition-colors cursor-pointer">
                            {item.product.title}
                          </h4>
                          <button 
                            onClick={() => handleRemoveItem(item)}
                            className="text-slate-400 hover:text-red-600 transition-colors p-1"
                            disabled={isUpdating}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                        {item.product.variantLabel && (
                          <p className="text-xs text-slate-500 mt-0.5">{item.product.variantLabel}</p>
                        )}
                        <p className="text-xs text-slate-400 font-mono mt-0.5">{item.product.sku}</p>
                      </div>

                      <div className="flex justify-between items-center mt-2">
                        {/* Quantity controls */}
                        <div className="flex items-center bg-white border border-slate-200 rounded-lg overflow-hidden">
                          <button 
                            onClick={() => handleQtyChange(item, item.qty - 1)}
                            disabled={item.qty <= 1 || isUpdating}
                            className="p-1.5 text-slate-500 hover:text-slate-900 transition-colors hover:bg-slate-100 disabled:opacity-30"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="px-2.5 text-xs font-semibold text-slate-950 font-mono">{item.qty}</span>
                          <button 
                            onClick={() => handleQtyChange(item, item.qty + 1)}
                            disabled={item.qty >= item.product.stock || isUpdating}
                            className="p-1.5 text-slate-500 hover:text-slate-900 transition-colors hover:bg-slate-100 disabled:opacity-30"
                          >
                            <Plus size={12} />
                          </button>
                        </div>

                        {/* Price */}
                        <span className="text-sm font-semibold text-brand-600">
                          {formatINR(item.product.unitPricePaise * item.qty)}
                        </span>
                      </div>

                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer (Totals & Checkout) */}
          {cart.items.length > 0 && (
            <div className="border-t border-slate-200 bg-slate-50/80 p-6 space-y-4 shrink-0 shadow-inner">
              
              {/* Coupon input */}
              {cart.couponCode ? (
                <div className="flex items-center justify-between p-3 rounded-lg bg-brand-50 border border-brand-200">
                  <div className="flex items-center gap-2 text-xs text-brand-700">
                    <Ticket size={14} className="animate-pulse" />
                    <span>Coupon <span className="font-semibold">{cart.couponCode}</span> applied</span>
                  </div>
                  <button 
                    onClick={() => removeCoupon()}
                    className="text-xs text-brand-600 hover:text-brand-700 font-medium underline"
                    disabled={isUpdating}
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="space-y-1.5">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter promo code (e.g. FIRST500)"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      className="flex-1 input-field py-2 text-xs uppercase"
                      disabled={isUpdating}
                    />
                    <button
                      type="submit"
                      disabled={!couponCode.trim() || isUpdating}
                      className="btn-secondary py-2 px-4 text-xs font-semibold"
                    >
                      Apply
                    </button>
                  </div>
                  {couponError && <p className="text-xs text-red-600">{couponError}</p>}
                </form>
              )}

              {/* Price Breakdown */}
              <div className="space-y-2 text-sm text-slate-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-slate-900 font-semibold">{formatINR(cart.totals.subtotalPaise)}</span>
                </div>
                {cart.totals.discountPaise > 0 && (
                  <div className="flex justify-between text-brand-600">
                    <span>Discount</span>
                    <span className="font-semibold">-{formatINR(cart.totals.discountPaise)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-slate-900 font-semibold">
                    {cart.totals.shippingPaise === 0 ? 'FREE' : formatINR(cart.totals.shippingPaise)}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-slate-400 border-t border-slate-200/80 pt-2">
                  <span>GST Included (18%)</span>
                  <span>{formatINR(cart.totals.taxPaise)}</span>
                </div>
                <div className="flex justify-between text-base text-slate-900 font-bold pt-1">
                  <span>Total Amount</span>
                  <span className="text-brand-600">{formatINR(cart.totals.totalPaise)}</span>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                onClick={handleCheckoutClick}
                disabled={isUpdating}
                className="w-full btn-primary py-3.5 text-sm font-semibold flex items-center justify-center gap-2 mt-2"
              >
                Proceed to Checkout
                <ArrowRight size={16} />
              </button>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
