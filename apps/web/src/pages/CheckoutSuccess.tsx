import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle2, ShoppingBag, ArrowRight, ClipboardCheck } from 'lucide-react';

export const CheckoutSuccess: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderNumber = searchParams.get('orderNumber') || 'ORD-UNKNOWN';

  return (
    <div className="max-w-md mx-auto py-16 text-center space-y-8 animate-in fade-in zoom-in-95 duration-300">
      
      {/* Visual Success */}
      <div className="flex justify-center">
        <div className="w-20 h-20 rounded-full bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-600 relative shadow-sm">
          <CheckCircle2 size={44} className="stroke-[1.5]" />
          <div className="absolute inset-0 rounded-full bg-brand-500/5 animate-ping -z-10" />
        </div>
      </div>

      {/* Message */}
      <div className="space-y-3">
        <span className="text-[10px] uppercase font-extrabold tracking-widest text-brand-700 bg-brand-50 border border-brand-100 px-2.5 py-1 rounded-full">
          Authorized Test Success
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 pt-1">
          Thank you for your order!
        </h1>
        <p className="text-sm text-slate-600 max-w-sm mx-auto leading-relaxed font-normal">
          Your payment has been simulated successfully and is now processing in our warehouse queue.
        </p>
      </div>

      {/* Info Card */}
      <div className="p-5 rounded-xl border border-slate-200 bg-white text-left space-y-4 shadow-sm">
        <div className="flex justify-between items-center text-xs">
          <span className="text-slate-500 font-semibold">Order Reference</span>
          <span className="font-mono font-semibold text-slate-800 flex items-center gap-1">
            <ClipboardCheck size={14} className="text-brand-600" />
            {orderNumber}
          </span>
        </div>
        <div className="flex justify-between items-center text-xs border-t border-slate-100 pt-3">
          <span className="text-slate-500 font-semibold">Estimated Dispatch</span>
          <span className="text-slate-800 font-semibold">Within 24-48 Hours</span>
        </div>
        <div className="flex justify-between items-center text-xs border-t border-slate-100 pt-3">
          <span className="text-slate-500 font-semibold">Payment Status</span>
          <span className="text-brand-700 font-bold uppercase tracking-wider text-[10px] bg-brand-50 border border-brand-100 px-1.5 py-0.5 rounded">
            Paid (Test mode)
          </span>
        </div>
      </div>

      {/* CTAs */}
      <div className="flex flex-col gap-3">
        <button
          onClick={() => navigate('/profile/orders')}
          className="btn-primary py-3 flex items-center justify-center gap-2 font-semibold"
        >
          Track Shipment Progress
          <ArrowRight size={16} />
        </button>
        <button
          onClick={() => navigate('/')}
          className="btn-secondary py-3"
        >
          <ShoppingBag size={16} className="inline mr-1" />
          Continue Shopping
        </button>
      </div>

    </div>
  );
};
