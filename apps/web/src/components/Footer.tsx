import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Truck, RotateCcw, HelpCircle } from 'lucide-react';
import { BzarOLogo } from './BzarOLogo';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-200 mt-auto">
      
      {/* Service strip */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-b border-slate-100">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center lg:text-left">
          <div className="flex flex-col sm:flex-row items-center gap-3 justify-center lg:justify-start">
            <Truck className="text-brand-600 shrink-0" size={24} />
            <div>
              <h5 className="text-xs font-semibold text-slate-800 uppercase tracking-wider">Free Delivery</h5>
              <p className="text-xs text-slate-500 mt-0.5">On orders above Rs. 1,000</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 justify-center lg:justify-start">
            <RotateCcw className="text-brand-600 shrink-0" size={24} />
            <div>
              <h5 className="text-xs font-semibold text-slate-800 uppercase tracking-wider">7-Day Returns</h5>
              <p className="text-xs text-slate-500 mt-0.5">Easy returns and refund policy</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 justify-center lg:justify-start">
            <ShieldCheck className="text-brand-600 shrink-0" size={24} />
            <div>
              <h5 className="text-xs font-semibold text-slate-800 uppercase tracking-wider">100% Secure</h5>
              <p className="text-xs text-slate-500 mt-0.5">Razorpay Test Mode simulation</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 justify-center lg:justify-start">
            <HelpCircle className="text-brand-600 shrink-0" size={24} />
            <div>
              <h5 className="text-xs font-semibold text-slate-800 uppercase tracking-wider">Dedicated Support</h5>
              <p className="text-xs text-slate-500 mt-0.5">Monitored email ticket queue</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          
          <div className="col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <BzarOLogo className="w-8 h-8" />
              <span className="text-lg font-bold tracking-wider text-slate-900">
                BzarO
              </span>
            </div>
            <p className="text-sm text-slate-600 max-w-sm leading-relaxed">
              Crafting high-fidelity, Apple-inspired e-commerce experiences with modern styling, full-stack state coordination, and security-centric design patterns.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-widest mb-4">Shop Collections</h4>
            <ul className="space-y-2 text-sm text-slate-500">
              <li>
                <Link to="/products" className="hover:text-brand-600 transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/products?category=cat_electronics" className="hover:text-brand-600 transition-colors">
                  Electronics
                </Link>
              </li>
              <li>
                <Link to="/products?category=cat_audio" className="hover:text-brand-600 transition-colors">
                  Acoustics & Audio
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-widest mb-4">Customer Support</h4>
            <ul className="space-y-2 text-sm text-slate-500">
              <li>
                <Link to="/contact" className="hover:text-brand-600 transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="hover:text-brand-600 transition-colors">
                  Shipping Terms
                </Link>
              </li>
              <li>
                <Link to="/returns" className="hover:text-brand-600 transition-colors">
                  Returns & Refunds
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-brand-600 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-brand-600 transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Footer Base */}
        <div className="border-t border-slate-100 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} BzarO E-com. Portfolio Showcase project. No real products sold.</p>
          <div className="flex gap-4">
            <Link to="/terms" className="hover:text-slate-600">Terms</Link>
            <Link to="/privacy" className="hover:text-slate-600">Privacy</Link>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-slate-600">Github</a>
          </div>
        </div>

      </div>
    </footer>
  );
};
