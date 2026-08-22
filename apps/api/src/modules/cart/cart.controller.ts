import { Response, NextFunction } from 'express';
import { ExtendedRequest } from '../../middleware/error';
import { CartRepository, ProductRepository, CouponRepository, WishlistRepository } from '../../db/repositories';
import { cartItemSchema, applyCouponSchema, Product } from '@ecom/contracts';
import { AppError } from '../../lib/errors';

// Helper to calculate totals and hydrate items
export const getHydratedCart = async (userId: string) => {
  const cart = await CartRepository.findByUser(userId);
  if (!cart) {
    return { items: [], couponCode: undefined, totals: { subtotalPaise: 0, discountPaise: 0, shippingPaise: 0, taxPaise: 0, totalPaise: 0 } };
  }

  const hydratedItems: any[] = [];
  let subtotalPaise = 0;
  let itemsCount = 0;

  for (const item of cart.items) {
    const product = await ProductRepository.findById(item.productId);
    if (!product || product.status !== 'published') continue;

    let itemPricePaise = product.pricePaise;
    let variantLabel = '';
    let variantSku = product.sku;
    let availableStock = product.stock;

    if (item.variantId) {
      const variant = product.variants.find(v => v.id === item.variantId);
      if (variant) {
        itemPricePaise += variant.priceDeltaPaise;
        variantLabel = variant.label;
        variantSku = variant.sku;
        availableStock = variant.stock;
      }
    }

    const itemTotalPaise = itemPricePaise * item.qty;
    subtotalPaise += itemTotalPaise;
    itemsCount += item.qty;

    hydratedItems.push({
      productId: item.productId,
      variantId: item.variantId,
      qty: item.qty,
      addedAt: item.addedAt,
      product: {
        title: product.title,
        slug: product.slug,
        brand: product.brand,
        image: product.images[0]?.url || '',
        basePricePaise: product.pricePaise,
        unitPricePaise: itemPricePaise,
        variantLabel,
        sku: variantSku,
        stock: availableStock,
      }
    });
  }

  // Calculate Discount
  let discountPaise = 0;
  let couponCode = cart.couponCode;

  if (couponCode) {
    const coupon = await CouponRepository.findByCode(couponCode);
    const now = new Date();
    
    if (
      coupon &&
      coupon.active &&
      new Date(coupon.startsAt).getTime() <= now.getTime() &&
      new Date(coupon.endsAt).getTime() >= now.getTime() &&
      coupon.usageCount < coupon.usageLimit &&
      subtotalPaise >= coupon.minSubtotal
    ) {
      if (coupon.type === 'fixed') {
        discountPaise = coupon.value;
      } else {
        discountPaise = Math.round((subtotalPaise * coupon.value) / 100);
      }
      
      if (coupon.maxDiscount && discountPaise > coupon.maxDiscount) {
        discountPaise = coupon.maxDiscount;
      }

      // Ensure discount doesn't exceed subtotal
      if (discountPaise > subtotalPaise) {
        discountPaise = subtotalPaise;
      }
    } else {
      // Coupon has become invalid, clear it
      couponCode = undefined;
      await CartRepository.upsert(userId, cart.items, undefined);
    }
  }

  // Flat Rs 100 shipping fee. Free above Rs 1000 (100000 paise)
  const shippingPaise = subtotalPaise > 0 && subtotalPaise < 100000 ? 10000 : 0;
  
  // Tax: 18% GST (Included in price)
  const taxableAmount = subtotalPaise - discountPaise;
  const taxPaise = Math.round(taxableAmount - (taxableAmount / 1.18));
  
  const totalPaise = taxableAmount + shippingPaise;

  return {
    items: hydratedItems,
    couponCode,
    totals: {
      subtotalPaise,
      discountPaise,
      shippingPaise,
      taxPaise,
      totalPaise,
    }
  };
};

export const CartController = {
  async getCart(req: ExtendedRequest, res: Response, next: NextFunction) {
    try {
      const cart = await getHydratedCart(req.user!.id);
      res.status(200).json({
        data: cart,
        meta: { requestId: req.requestId }
      });
    } catch (err) {
      next(err);
    }
  },

  async updateCart(req: ExtendedRequest, res: Response, next: NextFunction) {
    // Sync guest cart to server cart on login / update
    try {
      const items = req.body.items as any[];
      const validatedItems: any[] = [];
      const warnings: string[] = [];

      for (const item of items) {
        const parsed = cartItemSchema.parse(item);
        const product = await ProductRepository.findById(parsed.productId);

        if (!product || product.status !== 'published') {
          warnings.push(`Item ${parsed.productId} is no longer available.`);
          continue;
        }

        let maxStock = product.stock;
        if (parsed.variantId) {
          const variant = product.variants.find(v => v.id === parsed.variantId);
          if (variant) {
            maxStock = variant.stock;
          } else {
            warnings.push(`Variant for product "${product.title}" is invalid.`);
            continue;
          }
        }

        if (maxStock <= 0) {
          warnings.push(`"${product.title}" is out of stock.`);
          continue;
        }

        if (parsed.qty > maxStock) {
          warnings.push(`Quantity for "${product.title}" reduced to matches stock (${maxStock}).`);
          parsed.qty = maxStock;
        }

        validatedItems.push({
          ...parsed,
          addedAt: new Date().toISOString(),
        });
      }

      const cart = await CartRepository.findByUser(req.user!.id);
      const couponCode = cart?.couponCode;
      
      await CartRepository.upsert(req.user!.id, validatedItems, couponCode);
      const hydrated = await getHydratedCart(req.user!.id);

      res.status(200).json({
        data: {
          ...hydrated,
          warnings: warnings.length > 0 ? warnings : undefined,
        },
        meta: { requestId: req.requestId }
      });
    } catch (err) {
      next(err);
    }
  },

  async addToCart(req: ExtendedRequest, res: Response, next: NextFunction) {
    try {
      const body = cartItemSchema.parse(req.body);
      const product = await ProductRepository.findById(body.productId);

      if (!product || product.status !== 'published') {
        return next(AppError.notFound('Product is unavailable'));
      }

      let maxStock = product.stock;
      if (body.variantId) {
        const variant = product.variants.find(v => v.id === body.variantId);
        if (variant) {
          maxStock = variant.stock;
        } else {
          return next(AppError.badRequest('Invalid product variant'));
        }
      }

      if (maxStock <= 0) {
        return next(new AppError('OUT_OF_STOCK', 400, 'Product is out of stock'));
      }

      // Retrieve existing cart
      const cart = await CartRepository.findByUser(req.user!.id);
      const items = cart ? [...cart.items] : [];

      const existingIdx = items.findIndex(
        item => item.productId === body.productId && item.variantId === body.variantId
      );

      let targetQty = body.qty;
      if (existingIdx !== -1) {
        targetQty += items[existingIdx].qty;
      }

      if (targetQty > maxStock) {
        targetQty = maxStock;
      }

      if (existingIdx !== -1) {
        items[existingIdx].qty = targetQty;
      } else {
        items.push({
          productId: body.productId,
          variantId: body.variantId,
          qty: targetQty,
          addedAt: new Date().toISOString(),
        });
      }

      await CartRepository.upsert(req.user!.id, items, cart?.couponCode);
      const hydrated = await getHydratedCart(req.user!.id);

      res.status(200).json({
        data: hydrated,
        meta: { requestId: req.requestId }
      });
    } catch (err) {
      next(err);
    }
  },

  async removeFromCart(req: ExtendedRequest, res: Response, next: NextFunction) {
    try {
      const productId = req.query.productId as string;
      const variantId = req.query.variantId as string || undefined;

      const cart = await CartRepository.findByUser(req.user!.id);
      if (!cart) return next(AppError.notFound('Cart not found'));

      const filteredItems = cart.items.filter(
        item => !(item.productId === productId && item.variantId === variantId)
      );

      await CartRepository.upsert(req.user!.id, filteredItems, cart.couponCode);
      const hydrated = await getHydratedCart(req.user!.id);

      res.status(200).json({
        data: hydrated,
        meta: { requestId: req.requestId }
      });
    } catch (err) {
      next(err);
    }
  },

  async applyCoupon(req: ExtendedRequest, res: Response, next: NextFunction) {
    try {
      const { code } = applyCouponSchema.parse(req.body);
      const coupon = await CouponRepository.findByCode(code);

      if (!coupon || !coupon.active) {
        return next(new AppError('COUPON_INVALID', 400, 'Invalid coupon code'));
      }

      const now = new Date();
      if (new Date(coupon.startsAt).getTime() > now.getTime() || new Date(coupon.endsAt).getTime() < now.getTime()) {
        return next(new AppError('COUPON_INVALID', 400, 'Coupon is expired or not active yet'));
      }

      if (coupon.usageCount >= coupon.usageLimit) {
        return next(new AppError('COUPON_INVALID', 400, 'Coupon usage limit has been reached'));
      }

      const cart = await CartRepository.findByUser(req.user!.id);
      if (!cart || cart.items.length === 0) {
        return next(AppError.badRequest('Cart is empty'));
      }

      // Check minimum subtotal requirement
      const hydrated = await getHydratedCart(req.user!.id);
      if (hydrated.totals.subtotalPaise < coupon.minSubtotal) {
        return next(new AppError('COUPON_INVALID', 400, `Minimum subtotal of Rs. ${coupon.minSubtotal / 100} required to apply this coupon`));
      }

      await CartRepository.upsert(req.user!.id, cart.items, coupon.code);
      const updatedCart = await getHydratedCart(req.user!.id);

      res.status(200).json({
        data: updatedCart,
        meta: { requestId: req.requestId }
      });
    } catch (err) {
      next(err);
    }
  },

  async removeCoupon(req: ExtendedRequest, res: Response, next: NextFunction) {
    try {
      const cart = await CartRepository.findByUser(req.user!.id);
      if (cart) {
        await CartRepository.upsert(req.user!.id, cart.items, undefined);
      }

      const hydrated = await getHydratedCart(req.user!.id);
      res.status(200).json({
        data: hydrated,
        meta: { requestId: req.requestId }
      });
    } catch (err) {
      next(err);
    }
  },

  // WISHLIST METHODS
  async getWishlist(req: ExtendedRequest, res: Response, next: NextFunction) {
    try {
      const wishlist = await WishlistRepository.findByUser(req.user!.id);
      const productIds = wishlist ? wishlist.productIds : [];

      const hydratedProducts: Product[] = [];
      for (const pid of productIds) {
        const product = await ProductRepository.findById(pid);
        if (product && product.status === 'published') {
          hydratedProducts.push(product);
        }
      }

      res.status(200).json({
        data: { products: hydratedProducts },
        meta: { requestId: req.requestId }
      });
    } catch (err) {
      next(err);
    }
  },

  async addToWishlist(req: ExtendedRequest, res: Response, next: NextFunction) {
    try {
      const { productId } = req.params;
      const product = await ProductRepository.findById(productId);
      
      if (!product || product.status !== 'published') {
        return next(AppError.notFound('Product not found'));
      }

      const wishlist = await WishlistRepository.findByUser(req.user!.id);
      const productIds = wishlist ? [...wishlist.productIds] : [];

      if (!productIds.includes(productId)) {
        productIds.push(productId);
        await WishlistRepository.upsert(req.user!.id, productIds);
      }

      res.status(200).json({
        data: { success: true },
        meta: { requestId: req.requestId }
      });
    } catch (err) {
      next(err);
    }
  },

  async removeFromWishlist(req: ExtendedRequest, res: Response, next: NextFunction) {
    try {
      const { productId } = req.params;
      const wishlist = await WishlistRepository.findByUser(req.user!.id);

      if (wishlist) {
        const filtered = wishlist.productIds.filter(pid => pid !== productId);
        await WishlistRepository.upsert(req.user!.id, filtered);
      }

      res.status(200).json({
        data: { success: true },
        meta: { requestId: req.requestId }
      });
    } catch (err) {
      next(err);
    }
  }
};
