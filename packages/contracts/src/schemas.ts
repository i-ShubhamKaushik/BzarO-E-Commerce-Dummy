import { z } from 'zod';

// AUTH SCHEMAS
export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  phone: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters'),
});

// ADDRESS SCHEMAS
export const addressSchema = z.object({
  label: z.string().min(1, 'Label is required (e.g. Home, Office)'),
  recipient: z.string().min(2, 'Recipient name is required'),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format'),
  lines: z.array(z.string().min(1, 'Address line cannot be empty')).min(1, 'At least one address line is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  postalCode: z.string().regex(/^[1-9][0-9]{5}$/, 'Invalid Indian Pincode format (6 digits)'),
  isDefault: z.boolean().default(false),
});

// CART SCHEMAS
export const cartItemSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  variantId: z.string().optional(),
  qty: z.number().int().min(1, 'Quantity must be at least 1'),
});

export const applyCouponSchema = z.object({
  code: z.string().min(1, 'Coupon code is required'),
});

// PRODUCT ADMIN SCHEMAS
export const productSeoSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  keywords: z.array(z.string()).optional(),
});

export const productImageSchema = z.object({
  publicId: z.string().min(1),
  url: z.string().url('Invalid image URL'),
  alt: z.string().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
  sortOrder: z.number().default(0),
});

export const productVariantSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1, 'Variant label is required'),
  sku: z.string().min(1, 'Variant SKU is required'),
  priceDeltaPaise: z.number().int().default(0),
  stock: z.number().int().nonnegative('Stock cannot be negative'),
  imageIndex: z.number().optional(),
});

export const productAdminSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters'),
  sku: z.string().min(3, 'SKU must be at least 3 characters'),
  brand: z.string().min(1, 'Brand is required'),
  categoryId: z.string().min(1, 'Category is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  specs: z.record(z.string(), z.string()).default({}),
  images: z.array(productImageSchema).min(1, 'At least one image is required'),
  pricePaise: z.number().int().positive('Price must be greater than 0'),
  compareAtPaise: z.number().int().positive().optional().nullable(),
  stock: z.number().int().nonnegative('Stock cannot be negative'),
  variants: z.array(productVariantSchema).default([]),
  tags: z.array(z.string()).default([]),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
  seo: productSeoSchema.default({}),
});

// REVIEW SCHEMAS
export const reviewSchema = z.object({
  rating: z.number().int().min(1).max(5, 'Rating must be between 1 and 5'),
  body: z.string().min(5, 'Review must be at least 5 characters').max(500, 'Review cannot exceed 500 characters'),
  orderId: z.string().min(1, 'Order ID is required to verify purchase'),
});

export const reviewModerationSchema = z.object({
  status: z.enum(['approved', 'rejected', 'hidden']),
  reason: z.string().min(5, 'Moderation reason must be at least 5 characters'),
});

// COUPON SCHEMAS
export const couponSchema = z.object({
  code: z.string().min(3, 'Code must be at least 3 characters').regex(/^[A-Z0-9_-]+$/, 'Code must be alphanumeric uppercase'),
  type: z.enum(['fixed', 'percent']),
  value: z.number().positive('Value must be positive'),
  minSubtotal: z.number().int().nonnegative('Minimum subtotal cannot be negative'),
  maxDiscount: z.number().int().positive().optional().nullable(),
  startsAt: z.string().datetime('Invalid ISO date format for startsAt'),
  endsAt: z.string().datetime('Invalid ISO date format for endsAt'),
  usageLimit: z.number().int().positive('Usage limit must be positive'),
  active: z.boolean().default(true),
});

// CATEGORY SCHEMAS
export const categorySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().optional(),
  image: z.string().url('Invalid image URL').optional().nullable(),
  parentId: z.string().optional().nullable(),
  active: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
});

// PROMOTION SCHEMAS
export const promotionSchema = z.object({
  title: z.string().min(2),
  placement: z.enum(['hero', 'deal_strip', 'spotlight']),
  image: z.string().url(),
  destination: z.string().min(1),
  startsAt: z.string().datetime(),
  endsAt: z.string().datetime(),
  active: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
});

// CHECKOUT SCHEMAS
export const checkoutQuoteSchema = z.object({
  addressId: z.string().min(1, 'Delivery address is required'),
});

export const verifyPaymentSchema = z.object({
  orderId: z.string().min(1, 'Backend Order ID is required'),
  razorpayPaymentId: z.string().optional(),
  razorpayOrderId: z.string().optional(),
  razorpaySignature: z.string().optional(),
  simulateStatus: z.enum(['success', 'failure']).default('success'), // Used for dummy simulation if no signature provided
});

// INVENTORY ADJUSTMENT SCHEMA
export const inventoryAdjustmentSchema = z.object({
  productId: z.string().min(1),
  variantId: z.string().optional(),
  adjustment: z.number().int().refine((val) => val !== 0, 'Adjustment cannot be zero'),
  reason: z.string().min(3),
});
