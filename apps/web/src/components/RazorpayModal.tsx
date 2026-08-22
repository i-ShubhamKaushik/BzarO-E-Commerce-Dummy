import React, { useState } from 'react';
import { ShieldCheck, CreditCard, Smartphone, Check, Loader2, X } from 'lucide-react';
import { formatINR } from './CartDrawer';

interface RazorpayModalProps {
  isOpen: boolean;
  orderData: {
    orderId: string;
    orderNumber: string;
    providerOrderId: string;
    amountPaise: number;
  } | null;
  onClose: () => void;
  onPaymentComplete: (razorpayPaymentId: string, signature: string, status: 'success' | 'failure') => void;
}

export const RazorpayModal: React.FC<RazorpayModalProps> = ({
  isOpen,
  orderData,
  onClose,
  onPaymentComplete
}) => {
  const [activeTab, setActiveTab] = useState<'card' | 'upi'>('card');
  const [cardNumber, setCardNumber] = useState('4319 4982 1032 4921');
  const [expiry, setExpiry] = useState('12/28');
  const [cvv, setCvv] = useState('321');
  const [cardName, setCardName] = useState('Rahul Varma');
  const [upiId, setUpiId] = useState('rahul@okaxis');
  const [processing, setProcessing] = useState(false);

  if (!isOpen || !orderData) return null;

  const handlePay = (simulateStatus: 'success' | 'failure') => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      const mockPaymentId = `pay_mock_${Math.random().toString(36).substring(2, 10)}`;
      const mockSignature = `sig_mock_${Math.random().toString(36).substring(2, 18)}`;
      onPaymentComplete(mockPaymentId, mockSignature, simulateStatus);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-xs" onClick={onClose} />

      {/* Razorpay frame replica container */}
      <div className="relative w-full max-w-sm bg-white rounded-xl overflow-hidden shadow-2xl flex flex-col font-sans text-dark-900 border border-slate-200">
        
        {/* Header (Razorpay brand color blue-600) */}
        <div className="bg-[#1f72e6] text-white p-5 space-y-2 relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-white/70 hover:text-white hover:bg-white/10 p-1 rounded"
          >
            <X size={16} />
          </button>
          
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider font-semibold opacity-85">BzarO E-Commerce</span>
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-500 text-[10px] uppercase font-bold tracking-wider">
              Test Mode
            </div>
          </div>
          
          <div className="flex items-baseline justify-between pt-1">
            <span className="text-sm opacity-90">Amount to Pay</span>
            <span className="text-xl font-bold font-mono">{formatINR(orderData.amountPaise)}</span>
          </div>
        </div>

        {/* Tab selection */}
        <div className="flex border-b border-slate-200 text-xs">
          <button
            onClick={() => setActiveTab('card')}
            className={`flex-1 py-3 text-center font-medium border-b-2 flex items-center justify-center gap-1.5 transition-colors ${
              activeTab === 'card' 
                ? 'border-[#1f72e6] text-[#1f72e6]' 
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <CreditCard size={14} />
            Card Details
          </button>
          <button
            onClick={() => setActiveTab('upi')}
            className={`flex-1 py-3 text-center font-medium border-b-2 flex items-center justify-center gap-1.5 transition-colors ${
              activeTab === 'upi' 
                ? 'border-[#1f72e6] text-[#1f72e6]' 
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Smartphone size={14} />
            UPI ID
          </button>
        </div>

        {/* Content */}
        <div className="p-5 flex-1 min-h-[160px] flex flex-col justify-between">
          
          {processing ? (
            <div className="flex flex-col items-center justify-center py-8 gap-3 text-center">
              <Loader2 className="animate-spin text-[#1f72e6]" size={32} />
              <div>
                <p className="text-sm font-semibold text-slate-800">Processing Payment</p>
                <p className="text-xs text-slate-500 mt-1">Verifying credentials with Razorpay gateways...</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {activeTab === 'card' ? (
                <div className="space-y-3">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-400">Card Number</label>
                    <input 
                      type="text" 
                      value={cardNumber} 
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-[#1f72e6]" 
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] uppercase font-bold text-slate-400">Expiry (MM/YY)</label>
                      <input 
                        type="text" 
                        value={expiry} 
                        onChange={(e) => setExpiry(e.target.value)}
                        className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-[#1f72e6]" 
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold text-slate-400">CVV</label>
                      <input 
                        type="password" 
                        value={cvv} 
                        onChange={(e) => setCvv(e.target.value)}
                        className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-[#1f72e6]" 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-400">Cardholder Name</label>
                    <input 
                      type="text" 
                      value={cardName} 
                      onChange={(e) => setCardName(e.target.value)}
                      className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-[#1f72e6]" 
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-slate-400">Virtual Payment Address (VPA)</label>
                  <input 
                    type="text" 
                    value={upiId} 
                    onChange={(e) => setUpiId(e.target.value)}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-[#1f72e6] font-mono" 
                  />
                  <p className="text-[10px] text-slate-400">Example: username@upi, username@okaxis</p>
                </div>
              )}
            </div>
          )}

          {/* Action triggers */}
          {!processing && (
            <div className="flex gap-3 pt-6">
              <button
                onClick={() => handlePay('failure')}
                className="flex-1 py-2 px-3 text-xs font-semibold rounded bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 transition-colors"
              >
                Simulate Fail
              </button>
              
              <button
                onClick={() => handlePay('success')}
                className="flex-1 py-2 px-3 text-xs font-semibold rounded bg-emerald-600 hover:bg-emerald-500 text-white shadow transition-colors flex items-center justify-center gap-1"
              >
                <Check size={12} />
                Simulate Pass
              </button>
            </div>
          )}

        </div>

        {/* Security badge */}
        <div className="bg-slate-50 border-t border-slate-100 p-3 flex items-center justify-center gap-1.5 text-[10px] text-slate-400">
          <ShieldCheck size={14} className="text-emerald-500" />
          <span>PCI-DSS Compliant 256-bit SSL simulated encryption</span>
        </div>

      </div>
    </div>
  );
};
