import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../app/store';
import { toggleAuthModal, setAuthModalTab } from '../features/ui/uiSlice';
import { setCredentials } from '../features/auth/authSlice';
import { api } from '../lib/api';
import { X, Mail, Lock, User, Phone, CheckCircle, AlertTriangle } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const dispatch = useDispatch();
  const { authModalOpen, authModalTab } = useSelector((state: RootState) => state.ui);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Auto-close modal when user becomes authenticated (e.g. after login)
  useEffect(() => {
    if (isAuthenticated && authModalOpen && !successMsg) {
      dispatch(toggleAuthModal({ open: false }));
      setErrorMsg(null);
      setSuccessMsg(null);
      setFieldErrors({});
    }
  }, [isAuthenticated, authModalOpen, successMsg, dispatch]);

  if (!authModalOpen) return null;

  const handleClose = () => {
    dispatch(toggleAuthModal({ open: false }));
    setErrorMsg(null);
    setSuccessMsg(null);
    setFieldErrors({});
  };

  const handleSwitchTab = (tab: 'login' | 'register') => {
    dispatch(setAuthModalTab(tab));
    setErrorMsg(null);
    setSuccessMsg(null);
    setFieldErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setFieldErrors({});
    
    try {
      if (authModalTab === 'login') {
        const res = await api.post('/auth/login', { email, password });
        dispatch(setCredentials(res.data.data.user));
        handleClose();
      } else {
        const res = await api.post('/auth/register', { name, email, password, phone });
        dispatch(setCredentials(res.data.data.user));
        setSuccessMsg('Account registered successfully!');
        setTimeout(() => {
          handleClose();
        }, 1500);
      }
    } catch (err: any) {
      if (err.code === 'VALIDATION_ERROR' && err.fields) {
        setFieldErrors(err.fields);
        setErrorMsg('Please correct the highlighted fields.');
      } else {
        setErrorMsg(err.message || 'An error occurred during authentication.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Semi-transparent Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={isAuthenticated ? handleClose : undefined}
      />
      
      {/* Modal Container */}
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl border border-slate-200 shadow-brand-500/2 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h3 className="text-xl font-bold tracking-tight text-slate-900">
            {authModalTab === 'login' ? 'Welcome back' : 'Create an account'}
          </h3>
          {isAuthenticated && (
            <button 
              onClick={handleClose}
              className="text-slate-400 hover:text-slate-700 transition-colors p-1 hover:bg-slate-100 rounded-lg"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Tab Selector */}
        <div className="flex px-6 pt-6 gap-2">
          <button
            onClick={() => handleSwitchTab('login')}
            className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${
              authModalTab === 'login' 
                ? 'bg-slate-100 text-brand-600 border border-slate-200' 
                : 'text-slate-400 hover:text-slate-700 hover:bg-slate-50'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => handleSwitchTab('register')}
            className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${
              authModalTab === 'register' 
                ? 'bg-slate-100 text-brand-600 border border-slate-200' 
                : 'text-slate-400 hover:text-slate-700 hover:bg-slate-50'
            }`}
          >
            Register
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMsg && (
            <div className="flex items-start gap-2.5 p-3.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
              <AlertTriangle size={18} className="shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="flex items-start gap-2.5 p-3.5 rounded-lg bg-brand-50 border border-brand-200 text-brand-700 text-sm">
              <CheckCircle size={18} className="shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Registration Name Field */}
          {authModalTab === 'register' && (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-3.5 text-slate-400" size={16} />
                <input
                  type="text"
                  placeholder="e.g. Rahul Varma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full !pl-10 input-field ${fieldErrors.name ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                  required
                />
              </div>
              {fieldErrors.name && <p className="text-xs text-red-600">{fieldErrors.name}</p>}
            </div>
          )}

          {/* Email Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 text-slate-400" size={16} />
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full !pl-10 input-field ${fieldErrors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                required
              />
            </div>
            {fieldErrors.email && <p className="text-xs text-red-600">{fieldErrors.email}</p>}
          </div>

          {/* Phone Field (Optional for registration) */}
          {authModalTab === 'register' && (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Phone Number (optional)</label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-3.5 text-slate-400" size={16} />
                <input
                  type="tel"
                  placeholder="9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={`w-full !pl-10 input-field ${fieldErrors.phone ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                />
              </div>
              {fieldErrors.phone && <p className="text-xs text-red-600">{fieldErrors.phone}</p>}
            </div>
          )}

          {/* Password Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 text-slate-400" size={16} />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full !pl-10 input-field ${fieldErrors.password ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                required
              />
            </div>
            {fieldErrors.password && <p className="text-xs text-red-600">{fieldErrors.password}</p>}
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary py-3 text-sm mt-2 font-medium"
          >
            {loading 
              ? 'Processing...' 
              : authModalTab === 'login' ? 'Sign In to Shop' : 'Create My Account'
            }
          </button>
        </form>

        {/* Demo Hints Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 text-xs text-slate-500 text-center space-y-1">
          <p>Demo Admin: <span className="text-slate-800 font-semibold">admin@ecom.com</span> / password: <span className="text-slate-800 font-semibold">admin123</span></p>
          <p>Demo Customer: <span className="text-slate-800 font-semibold">customer@ecom.com</span> / password: <span className="text-slate-800 font-semibold">customer123</span></p>
        </div>

      </div>
    </div>
  );
};
