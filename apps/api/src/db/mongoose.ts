import mongoose, { Schema, Document } from 'mongoose';
import { User, Address, Category, Product, Cart, Wishlist, Coupon, Order, Review, Promotion, AuditLog } from '@ecom/contracts';

// User Schema
const UserSchema = new Schema<User & Document>({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  name: { type: String, required: true },
  phone: { type: String },
  role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
  status: { type: String, enum: ['active', 'blocked'], default: 'active' },
  avatar: { type: String },
  emailVerifiedAt: { type: String },
  preferences: {
    marketingEmails: { type: Boolean, default: true }
  }
}, { timestamps: true });

UserSchema.index({ email: 1 });
UserSchema.index({ role: 1 });

// Address Schema
const AddressSchema = new Schema<Address & Document>({
  userId: { type: String, required: true },
  label: { type: String, required: true },
  recipient: { type: String, required: true },
  phone: { type: String, required: true },
  lines: [{ type: String, required: true }],
  city: { type: String, required: true },
  state: { type: String, required: true },
  postalCode: { type: String, required: true },
  isDefault: { type: Boolean, default: false }
}, { timestamps: true });

AddressSchema.index({ userId: 1 });

// Category Schema
const CategorySchema = new Schema<any>({
  _id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String },
  image: { type: String },
  parentId: { type: String },
  active: { type: Boolean, default: true },
  sortOrder: { type: Number, default: 0 }
}, { timestamps: true });

CategorySchema.index({ slug: 1 });
CategorySchema.index({ active: 1, sortOrder: 1 });

// Product Schema
const ProductSchema = new Schema<any>({
  _id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  sku: { type: String, required: true, unique: true },
  brand: { type: String, required: true },
  categoryId: { type: String, required: true },
  description: { type: String, required: true },
  specs: { type: Map, of: String, default: {} },
  images: [{
    publicId: { type: String, required: true },
    url: { type: String, required: true },
    alt: { type: String },
    width: { type: Number },
    height: { type: Number },
    sortOrder: { type: Number, default: 0 }
  }],
  pricePaise: { type: Number, required: true },
  compareAtPaise: { type: Number },
  stock: { type: Number, required: true, default: 0 },
  variants: [{
    id: { type: String, required: true },
    label: { type: String, required: true },
    sku: { type: String, required: true },
    priceDeltaPaise: { type: Number, default: 0 },
    stock: { type: Number, default: 0 },
    imageIndex: { type: Number }
  }],
  tags: [{ type: String }],
  ratingSummary: {
    averageRating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 }
  },
  status: { type: String, enum: ['draft', 'published', 'archived'], default: 'draft' },
  seo: {
    title: { type: String },
    description: { type: String },
    keywords: [{ type: String }]
  }
}, { timestamps: true });

ProductSchema.index({ slug: 1 });
ProductSchema.index({ sku: 1 });
ProductSchema.index({ status: 1, categoryId: 1, brand: 1, pricePaise: 1 });
ProductSchema.index({ title: 'text', brand: 'text', tags: 'text' });

// Cart Schema
const CartSchema = new Schema<Cart & Document>({
  userId: { type: String, required: true, unique: true },
  items: [{
    productId: { type: String, required: true },
    variantId: { type: String },
    qty: { type: Number, required: true, min: 1 },
    addedAt: { type: String, required: true }
  }],
  couponCode: { type: String }
}, { timestamps: true });

// Wishlist Schema
const WishlistSchema = new Schema<Wishlist & Document>({
  userId: { type: String, required: true, unique: true },
  productIds: [{ type: String }]
}, { timestamps: true });

// Coupon Schema
const CouponSchema = new Schema<any>({
  _id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
  code: { type: String, required: true, unique: true, uppercase: true },
  type: { type: String, enum: ['fixed', 'percent'], required: true },
  value: { type: Number, required: true },
  minSubtotal: { type: Number, required: true, default: 0 },
  maxDiscount: { type: Number },
  startsAt: { type: String, required: true },
  endsAt: { type: String, required: true },
  usageLimit: { type: Number, required: true },
  usageCount: { type: Number, default: 0 },
  active: { type: Boolean, default: true }
}, { timestamps: true });

CouponSchema.index({ code: 1 });
CouponSchema.index({ active: 1, startsAt: 1, endsAt: 1 });

// Order Schema
const OrderSchema = new Schema<Order & Document>({
  orderNumber: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
  items: [{
    productId: { type: String, required: true },
    variantId: { type: String },
    name: { type: String, required: true },
    sku: { type: String, required: true },
    variantLabel: { type: String },
    imageUrl: { type: String },
    qty: { type: Number, required: true },
    unitPricePaise: { type: Number, required: true },
    discountPaise: { type: Number, default: 0 },
    taxPaise: { type: Number, default: 0 }
  }],
  address: {
    label: { type: String, required: true },
    recipient: { type: String, required: true },
    phone: { type: String, required: true },
    lines: [{ type: String, required: true }],
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true }
  },
  totals: {
    subtotalPaise: { type: Number, required: true },
    discountPaise: { type: Number, required: true },
    shippingPaise: { type: Number, required: true },
    taxPaise: { type: Number, required: true },
    totalPaise: { type: Number, required: true }
  },
  payment: {
    providerOrderId: { type: String },
    paymentId: { type: String },
    signature: { type: String },
    status: { type: String, enum: ['pending', 'captured', 'failed'], default: 'pending' },
    amountPaidPaise: { type: Number, required: true },
    method: { type: String },
    errorMessage: { type: String }
  },
  status: { type: String, required: true },
  timeline: [{
    status: { type: String, required: true },
    timestamp: { type: String, required: true },
    actor: { type: String, required: true },
    note: { type: String }
  }],
  couponCode: { type: String }
}, { timestamps: true });

OrderSchema.index({ orderNumber: 1 });
OrderSchema.index({ userId: 1 });
OrderSchema.index({ status: 1 });
OrderSchema.index({ 'payment.providerOrderId': 1 });

// Review Schema
const ReviewSchema = new Schema<Review & Document>({
  productId: { type: String, required: true },
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  orderId: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  body: { type: String, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected', 'hidden'], default: 'pending' },
  moderation: {
    moderatedBy: { type: String },
    moderatedAt: { type: String },
    reason: { type: String }
  }
}, { timestamps: true });

ReviewSchema.index({ productId: 1, userId: 1 }, { unique: true });
ReviewSchema.index({ productId: 1, status: 1 });

// Promotion Schema
const PromotionSchema = new Schema<any>({
  _id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
  title: { type: String, required: true },
  placement: { type: String, enum: ['hero', 'deal_strip', 'spotlight'], required: true },
  image: { type: String, required: true },
  destination: { type: String, required: true },
  startsAt: { type: String, required: true },
  endsAt: { type: String, required: true },
  active: { type: Boolean, default: true },
  sortOrder: { type: Number, default: 0 }
}, { timestamps: true });

PromotionSchema.index({ placement: 1, active: 1, sortOrder: 1 });

// Audit Log Schema
const AuditLogSchema = new Schema<AuditLog & Document>({
  actorId: { type: String, required: true },
  action: { type: String, required: true },
  entityType: { type: String, required: true },
  entityId: { type: String, required: true },
  before: { type: Schema.Types.Mixed },
  after: { type: Schema.Types.Mixed },
  requestId: { type: String, required: true }
}, { timestamps: true });

AuditLogSchema.index({ entityType: 1, createdAt: -1 });

// Add password hash specifically to mongoose User Schema (only needed on backend)
const UserWithHashSchema = new Schema<any>({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  name: { type: String, required: true },
  phone: { type: String },
  role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
  status: { type: String, enum: ['active', 'blocked'], default: 'active' },
  avatar: { type: String },
  emailVerifiedAt: { type: String },
  preferences: {
    marketingEmails: { type: Boolean, default: true }
  },
  passwordHash: { type: String, required: true }
}, { timestamps: true });

UserWithHashSchema.index({ email: 1 });
UserWithHashSchema.index({ role: 1 });

export const MongooseUser = mongoose.model<any>('User', UserWithHashSchema);
export const MongooseAddress = mongoose.model<Address & Document>('Address', AddressSchema);
export const MongooseCategory = mongoose.model<Category & Document>('Category', CategorySchema);
export const MongooseProduct = mongoose.model<Product & Document>('Product', ProductSchema);
export const MongooseCart = mongoose.model<Cart & Document>('Cart', CartSchema);
export const MongooseWishlist = mongoose.model<Wishlist & Document>('Wishlist', WishlistSchema);
export const MongooseCoupon = mongoose.model<Coupon & Document>('Coupon', CouponSchema);
export const MongooseOrder = mongoose.model<Order & Document>('Order', OrderSchema);
export const MongooseReview = mongoose.model<Review & Document>('Review', ReviewSchema);
export const MongoosePromotion = mongoose.model<Promotion & Document>('Promotion', PromotionSchema);
export const MongooseAuditLog = mongoose.model<AuditLog & Document>('AuditLog', AuditLogSchema);
export const MongooseSession = mongoose.model<any>('Session', new Schema({
  userId: { type: String, required: true },
  refreshTokenHash: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  revokedAt: { type: Date },
  ipHash: { type: String },
  userAgent: { type: String }
}, { timestamps: true }));
export type MongooseSessionDoc = Document & {
  userId: string;
  refreshTokenHash: string;
  expiresAt: Date;
  revokedAt?: Date;
  ipHash?: string;
  userAgent?: string;
};
export type MongooseUserDoc = Document & User & { passwordHash: string };
