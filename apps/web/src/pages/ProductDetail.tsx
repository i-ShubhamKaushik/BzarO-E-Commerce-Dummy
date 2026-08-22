import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import { useCart } from '../hooks/useCart';
import { formatINR } from '../components/CartDrawer';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../app/store';
import { toggleAuthModal, toggleCartDrawer } from '../features/ui/uiSlice';
import { 
  ShoppingBag, Plus, Minus, Star, Heart, Check, 
  ShieldAlert, Sparkles, MessageSquare, PlusCircle, AlertCircle, Loader2
} from 'lucide-react';

export const ProductDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  const { addToCart, isUpdating: cartUpdating } = useCart();

  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [selectedVariantId, setSelectedVariantId] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  // Review submission state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewBody, setReviewBody] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);
  const [reviewSuccess, setReviewSuccess] = useState<string | null>(null);

  // Fetch product detail
  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product-detail', slug],
    queryFn: async () => {
      const res = await api.get(`/products/${slug}`);
      const prod = res.data.data.product;
      // Pre-select first variant if available
      if (prod.variants && prod.variants.length > 0) {
        setSelectedVariantId(prod.variants[0].id);
      }
      return prod;
    }
  });

  // Fetch reviews
  const { data: reviews, refetch: refetchReviews } = useQuery({
    queryKey: ['product-reviews', product?.id],
    queryFn: async () => {
      const res = await api.get(`/products/${product.id}/reviews`);
      return res.data.data.reviews;
    },
    enabled: !!product?.id
  });

  // Fetch user orders to verify purchase eligibility for writing a review
  const { data: userOrders } = useQuery({
    queryKey: ['user-orders-reviews'],
    queryFn: async () => {
      const res = await api.get('/orders');
      return res.data.data.orders;
    },
    enabled: isAuthenticated
  });

  // Fetch wishlist
  const { data: wishlist, refetch: refetchWishlist } = useQuery({
    queryKey: ['wishlist'],
    queryFn: async () => {
      const res = await api.get('/wishlist');
      return res.data.data.products;
    },
    enabled: isAuthenticated
  });

  const isInWishlist = wishlist?.some((prod: any) => prod.id === product?.id) || false;

  const toggleWishlistMutation = useMutation({
    mutationFn: async () => {
      if (isInWishlist) {
        return await api.delete(`/wishlist/${product?.id}`);
      } else {
        return await api.post(`/wishlist/${product?.id}`);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
      queryClient.invalidateQueries({ queryKey: ['profile-wishlist'] });
    }
  });

  const handleToggleWishlist = () => {
    if (!isAuthenticated) {
      dispatch(toggleAuthModal({ open: true, tab: 'login' }));
      return;
    }
    toggleWishlistMutation.mutate();
  };

  if (isLoading) {
    return (
      <div className="h-96 flex items-center justify-center flex-col gap-2">
        <Loader2 className="animate-spin text-brand-500" size={32} />
        <p className="text-xs text-dark-400">Loading product particulars...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="h-96 flex flex-col items-center justify-center text-center gap-4">
        <ShieldAlert size={32} className="text-red-400" />
        <h3 className="text-sm font-semibold text-white">Product not found</h3>
        <button onClick={() => navigate('/products')} className="btn-secondary py-1.5 px-4 text-xs font-semibold">
          Return to Catalogue
        </button>
      </div>
    );
  }

  // Calculate pricing based on variant selection
  const selectedVariant = product.variants?.find((v: any) => v.id === selectedVariantId);
  const pricePaise = product.pricePaise + (selectedVariant ? selectedVariant.priceDeltaPaise : 0);
  const compareAtPaise = product.compareAtPaise 
    ? product.compareAtPaise + (selectedVariant ? selectedVariant.priceDeltaPaise : 0)
    : undefined;
  const activeStock = selectedVariant ? selectedVariant.stock : product.stock;
  const activeSku = selectedVariant ? selectedVariant.sku : product.sku;

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      dispatch(toggleAuthModal({ open: true, tab: 'login' }));
      return;
    }

    setAdding(true);
    try {
      await addToCart({
        productId: product.id,
        variantId: selectedVariantId || undefined,
        qty: quantity
      });
      // Open cart drawer
      dispatch(toggleCartDrawer(true));
    } catch (err) {
      console.error(err);
    } finally {
      setAdding(false);
    }
  };

  // Find if user has a delivered order for this product that has NOT been reviewed yet
  const eligibleOrder = userOrders?.find((order: any) => 
    order.status === 'delivered' &&
    order.items.some((item: any) => item.productId === product.id)
  );

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eligibleOrder) return;
    
    setSubmittingReview(true);
    setReviewError(null);
    setReviewSuccess(null);

    try {
      await api.post(`/products/${product.id}/reviews`, {
        rating: reviewRating,
        body: reviewBody,
        orderId: eligibleOrder.id
      });
      
      setReviewSuccess('Review submitted! It will appear after moderation.');
      setReviewBody('');
      refetchReviews();
    } catch (err: any) {
      setReviewError(err.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="space-y-12 pb-16">
      
      {/* Product shell layout */}
      <div className="flex flex-col lg:flex-row gap-12">
        
        {/* Left: Images gallery */}
        <div className="flex-1 space-y-4">
          <div className="aspect-[4/3] bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
            <img 
              src={product.images[activeImageIdx]?.url || 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=600'} 
              alt={product.images[activeImageIdx]?.alt || product.title} 
              className="w-full h-full object-cover"
            />
          </div>

          {/* Thumbnail list */}
          {product.images.length > 1 && (
            <div className="flex gap-4">
              {product.images.map((img: any, idx: number) => (
                <button
                  key={img.publicId}
                  onClick={() => setActiveImageIdx(idx)}
                  className={`w-20 h-16 rounded-xl overflow-hidden bg-white border transition-all ${
                    activeImageIdx === idx 
                      ? 'border-brand-600 ring-1 ring-brand-600' 
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <img src={img.url} alt={img.alt} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: details configuration */}
        <div className="flex-1 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-bold tracking-widest text-brand-600 font-mono">
                {product.brand}
              </span>
              <div className="w-1 h-1 bg-slate-300 rounded-full" />
              <span className="text-xs text-slate-400 font-mono">SKU: {activeSku}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">{product.title}</h1>
            
            {/* Reviews count */}
            <div className="flex items-center gap-1.5 text-sm text-amber-500">
              <Star size={16} fill="currentColor" className="stroke-[1.5]" />
              <span className="font-bold text-slate-700 mt-0.5">{product.ratingSummary.averageRating}</span>
              <span className="text-slate-400 text-xs mt-0.5">({product.ratingSummary.totalReviews} customer reviews)</span>
            </div>
          </div>

          {/* Pricing */}
          <div className="flex items-baseline gap-3.5 p-4 rounded-xl bg-slate-50 border border-slate-200/85 max-w-sm">
            <span className="text-2xl font-bold text-slate-900">{formatINR(pricePaise)}</span>
            {compareAtPaise && (
              <>
                <span className="text-sm text-slate-400 line-through">{formatINR(compareAtPaise)}</span>
                <span className="text-xs font-semibold text-brand-700 bg-brand-50 border border-brand-100 px-2 py-0.5 rounded">
                  Save {Math.round(((compareAtPaise - pricePaise) / compareAtPaise) * 100)}%
                </span>
              </>
            )}
          </div>

          <p className="text-sm text-slate-600 leading-relaxed font-normal">{product.description}</p>

          {/* Variant Selector */}
          {product.variants && product.variants.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold tracking-wider uppercase text-slate-500">Select Specification</h4>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((v: any) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariantId(v.id)}
                    className={`px-4 py-2 text-xs font-semibold rounded-lg border transition-all ${
                      selectedVariantId === v.id
                        ? 'border-brand-600 bg-brand-50 text-brand-700'
                        : 'border-slate-200 bg-white text-slate-600 hover:text-slate-905 hover:border-slate-300'
                    }`}
                  >
                    {v.label} {v.priceDeltaPaise > 0 && `(+${formatINR(v.priceDeltaPaise)})`}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Buy actions */}
          <div className="space-y-4 pt-4 border-t border-slate-200">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              
              {/* Quantity */}
              <div className="flex items-center self-start bg-white border border-slate-200 rounded-lg overflow-hidden h-12">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  disabled={quantity <= 1 || activeStock <= 0}
                  className="p-3 text-slate-500 hover:text-slate-900 transition-colors hover:bg-slate-100 disabled:opacity-30"
                >
                  <Minus size={14} />
                </button>
                <span className="w-12 text-center text-sm font-semibold text-slate-900 font-mono">{quantity}</span>
                <button
                  onClick={() => setQuantity(q => Math.min(activeStock, q + 1))}
                  disabled={quantity >= activeStock || activeStock <= 0}
                  className="p-3 text-slate-500 hover:text-slate-900 transition-colors hover:bg-slate-100 disabled:opacity-30"
                >
                  <Plus size={14} />
                </button>
              </div>

              {/* Add to Cart CTA */}
              <button
                onClick={handleAddToCart}
                disabled={activeStock <= 0 || adding || cartUpdating}
                className="flex-1 btn-primary h-12 flex items-center justify-center gap-2 font-semibold"
              >
                <ShoppingBag size={18} />
                {activeStock <= 0 
                  ? 'Out of Stock' 
                  : adding ? 'Adding to bag...' : 'Add to Shopping Bag'
                }
              </button>

              {/* Toggle Wishlist */}
              <button
                onClick={handleToggleWishlist}
                disabled={toggleWishlistMutation.isPending}
                className={`w-12 h-12 flex items-center justify-center rounded-lg border transition-all ${
                  isInWishlist
                    ? 'border-brand-600 bg-brand-50 text-brand-700 hover:bg-brand-100'
                    : 'border-slate-200 bg-white hover:border-slate-300 text-slate-500 hover:text-slate-800'
                }`}
                title={isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
              >
                {toggleWishlistMutation.isPending ? (
                  <Loader2 className="animate-spin text-brand-600" size={18} />
                ) : (
                  <Heart size={18} fill={isInWishlist ? 'currentColor' : 'none'} className={isInWishlist ? 'text-brand-600' : ''} />
                )}
              </button>

            </div>

            {/* Availability message */}
            <div className="text-xs flex items-center gap-2">
              {activeStock > 0 ? (
                <>
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-600 animate-ping" />
                  <span className="text-brand-600 font-semibold">In Stock and ready to dispatch ({activeStock} items remaining)</span>
                </>
              ) : (
                <>
                  <div className="w-1.5 h-1.5 rounded-full bg-red-600" />
                  <span className="text-red-600 font-semibold">Temporarily out of stock</span>
                </>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Specifications & description */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-slate-200 pt-12">
        <div className="md:col-span-2 space-y-4">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Sparkles size={18} className="text-brand-600" />
            Product Overview & Experience
          </h3>
          <p className="text-sm text-slate-600 leading-relaxed font-normal">
            Every product in the BzarO collection represents our commitment to design excellence and mechanical precision. Crafted for the minimalist desk setups, creative studios, and professional developer workspaces. Includes dedicated support and a standard warranty against hardware failure.
          </p>
        </div>

        {/* Specs Table */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-900">Technical Specs</h3>
          <div className="rounded-xl overflow-hidden border border-slate-205 text-xs font-medium">
            <table className="w-full text-left border-collapse">
              <tbody>
                {Object.entries(product.specs).map(([key, val], idx) => (
                  <tr key={key} className={idx % 2 === 0 ? 'bg-slate-50/50' : 'bg-transparent'}>
                    <td className="p-3 text-slate-500 border-b border-slate-100 font-semibold w-1/3">{key}</td>
                    <td className="p-3 text-slate-800 border-b border-slate-100 font-mono">{val}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Customer Reviews Section */}
      <div className="border-t border-slate-200 pt-12 space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <MessageSquare size={18} className="text-brand-600" />
              Customer Evaluations
            </h3>
            <p className="text-xs text-slate-500">Authentic shopping reviews submitted by verified purchasers.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Reviews list */}
          <div className="lg:col-span-2 space-y-4">
            {!reviews || reviews.length === 0 ? (
              <div className="p-8 rounded-xl border border-dashed border-slate-200 text-center text-xs text-slate-500 bg-white">
                No approved evaluations have been submitted for this item yet.
              </div>
            ) : (
              reviews.map((rev: any) => (
                <div key={rev.id} className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-sm space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">{rev.userName}</span>
                      <span className="text-[10px] text-brand-700 bg-brand-50 border border-brand-100 px-1.5 py-0.5 rounded font-extrabold uppercase tracking-wider">
                        Verified Buyer
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {new Date(rev.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Stars */}
                  <div className="flex gap-0.5 text-xs text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        size={12} 
                        className={i < rev.rating ? 'fill-current stroke-[1.5]' : 'text-slate-200'} 
                      />
                    ))}
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed font-normal font-sans">{rev.body}</p>
                </div>
              ))
            )}
          </div>

          {/* Write a review (Verified Only) */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-slate-900">Share Your Evaluation</h4>
            
            {isAuthenticated ? (
              eligibleOrder ? (
                <form onSubmit={handleSubmitReview} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                  {reviewError && (
                    <div className="p-3 rounded bg-red-50 border border-red-200 text-red-700 text-xs flex gap-2">
                      <AlertCircle size={14} className="shrink-0 mt-0.5" />
                      <span>{reviewError}</span>
                    </div>
                  )}

                  {reviewSuccess && (
                    <div className="p-3 rounded bg-brand-50 border border-brand-200 text-brand-700 text-xs flex gap-2">
                      <Check size={14} className="shrink-0 mt-0.5" />
                      <span>{reviewSuccess}</span>
                    </div>
                  )}

                  {/* Rating Selector */}
                  <div className="space-y-1.5">
                    <label className="text-xs text-slate-500 font-semibold">Rating</label>
                    <div className="flex gap-1.5">
                      {[1, 2, 3, 4, 5].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setReviewRating(num)}
                          className="p-1 hover:scale-110 transition-transform"
                        >
                          <Star 
                            size={20} 
                            className={num <= reviewRating ? 'text-amber-500 fill-current stroke-[1.5]' : 'text-slate-300'} 
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Body Text */}
                  <div className="space-y-1.5">
                    <label className="text-xs text-slate-500 font-semibold">Your Review</label>
                    <textarea
                      placeholder="Write your product experience here..."
                      rows={4}
                      value={reviewBody}
                      onChange={(e) => setReviewBody(e.target.value)}
                      className="w-full input-field p-3 text-xs placeholder:text-slate-300"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="w-full btn-primary py-2 text-xs font-bold"
                  >
                    {submittingReview ? 'Submitting...' : 'Submit Verified Evaluation'}
                  </button>
                </form>
              ) : (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-205 text-xs text-slate-500 leading-relaxed text-center space-y-1">
                  <p className="font-bold text-slate-900">Verification Required</p>
                  <p className="font-normal">You can only submit reviews for products you have purchased and received.</p>
                </div>
              )
            ) : (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-205 text-xs text-slate-500 text-center space-y-2">
                <p className="font-normal">Sign in to submit a verified purchase review.</p>
                <button
                  onClick={() => dispatch(toggleAuthModal({ open: true, tab: 'login' }))}
                  className="btn-secondary py-1.5 w-full text-xs font-bold"
                >
                  Sign In
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
};
