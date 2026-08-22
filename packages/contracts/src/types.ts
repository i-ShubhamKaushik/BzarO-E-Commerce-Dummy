export type UserRole = 'customer' | 'admin';

export interface UserPreferences {
  marketingEmails: boolean;
}

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: UserRole;
  status?: 'active' | 'blocked';
  avatar?: string;
  emailVerifiedAt?: string;
  preferences: UserPreferences;
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  id: string;
  userId: string;
  label: string;
  recipient: string;
  phone: string;
  lines: string[];
  city: string;
  state: string;
  postalCode: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string | null;
  parentId?: string | null;
  active: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductImage {
  publicId: string;
  url: string;
  alt?: string;
  width?: number;
  height?: number;
  sortOrder: number;
}

export interface ProductVariant {
  id: string;
  label: string;
  sku: string;
  priceDeltaPaise: number;
  stock: number;
  imageIndex?: number;
}

export interface RatingSummary {
  averageRating: number;
  totalReviews: number;
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  sku: string;
  brand: string;
  categoryId: string;
  description: string;
  specs: Record<string, string>;
  images: ProductImage[];
  pricePaise: number;
  compareAtPaise?: number | null;
  stock: number;
  variants: ProductVariant[];
  tags: string[];
  ratingSummary: RatingSummary;
  status: 'draft' | 'published' | 'archived';
  seo: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  productId: string;
  variantId?: string; // Optional if product has no variants
  qty: number;
  addedAt: string;
}

export interface Cart {
  userId: string;
  items: CartItem[];
  couponCode?: string;
  updatedAt: string;
}

export interface Wishlist {
  userId: string;
  productIds: string[];
  updatedAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  type: 'fixed' | 'percent';
  value: number; // Paise for fixed, percentage (0-100) for percent
  minSubtotal: number; // Paise
  maxDiscount?: number | null; // Paise
  startsAt: string;
  endsAt: string;
  usageLimit: number;
  usageCount: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export type OrderStatus =
  | 'pending_payment'
  | 'paid'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'payment_failed'
  | 'cancelled'
  | 'returned';

export interface OrderItemSnapshot {
  productId: string;
  variantId?: string;
  name: string;
  sku: string;
  variantLabel?: string;
  imageUrl?: string;
  qty: number;
  unitPricePaise: number;
  discountPaise: number;
  taxPaise: number;
}

export interface OrderTotals {
  subtotalPaise: number;
  discountPaise: number;
  shippingPaise: number;
  taxPaise: number;
  totalPaise: number;
}

export interface OrderPaymentInfo {
  providerOrderId?: string;
  paymentId?: string;
  signature?: string;
  status: 'pending' | 'captured' | 'failed';
  amountPaidPaise: number;
  method?: string;
  errorMessage?: string;
}

export interface OrderTimelineEvent {
  status: OrderStatus;
  timestamp: string;
  actor: string; // 'customer' | 'admin' | 'system'
  note?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  items: OrderItemSnapshot[];
  address: Omit<Address, 'id' | 'userId' | 'isDefault' | 'createdAt' | 'updatedAt'>;
  totals: OrderTotals;
  payment: OrderPaymentInfo;
  status: OrderStatus;
  timeline: OrderTimelineEvent[];
  couponCode?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string; // Snapshotted user name
  orderId: string;
  rating: number;
  body: string;
  status: 'pending' | 'approved' | 'rejected' | 'hidden';
  moderation?: {
    moderatedBy: string;
    moderatedAt: string;
    reason: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Promotion {
  id: string;
  title: string;
  placement: 'hero' | 'deal_strip' | 'spotlight';
  image: string;
  destination: string; // route link e.g. /products?category=phones
  startsAt: string;
  endsAt: string;
  active: boolean;
  sortOrder: number;
}

export interface AuditLog {
  id: string;
  actorId: string;
  action: string;
  entityType: string;
  entityId: string;
  before?: any;
  after?: any;
  requestId: string;
  createdAt: string;
}
