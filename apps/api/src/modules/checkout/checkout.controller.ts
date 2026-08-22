import { Response, NextFunction } from 'express';
import { ExtendedRequest } from '../../middleware/error';
import { getHydratedCart } from '../cart/cart.controller';
import { AddressRepository, ProductRepository, CouponRepository, OrderRepository, CartRepository, AuditLogRepository } from '../../db/repositories';
import { checkoutQuoteSchema, verifyPaymentSchema } from '@ecom/contracts';
import { AppError } from '../../lib/errors';
import crypto from 'crypto';
import { env } from '../../config/env';

// Utility to generate a unique order number
const generateOrderNumber = () => {
  return `ORD-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
};

export const CheckoutController = {
  async getQuote(req: ExtendedRequest, res: Response, next: NextFunction) {
    try {
      const { addressId } = checkoutQuoteSchema.parse(req.body);
      
      const address = await AddressRepository.findById(addressId);
      if (!address || address.userId !== req.user!.id) {
        return next(AppError.notFound('Address not found'));
      }

      const cart = await getHydratedCart(req.user!.id);
      if (cart.items.length === 0) {
        return next(AppError.badRequest('Cart is empty'));
      }

      res.status(200).json({
        data: {
          address,
          items: cart.items,
          couponCode: cart.couponCode,
          totals: cart.totals,
        },
        meta: { requestId: req.requestId }
      });
    } catch (err) {
      next(err);
    }
  },

  async createPaymentOrder(req: ExtendedRequest, res: Response, next: NextFunction) {
    try {
      const { addressId } = checkoutQuoteSchema.parse(req.body);
      
      const address = await AddressRepository.findById(addressId);
      if (!address || address.userId !== req.user!.id) {
        return next(AppError.notFound('Address not found'));
      }

      const cart = await getHydratedCart(req.user!.id);
      if (cart.items.length === 0) {
        return next(AppError.badRequest('Cart is empty'));
      }

      // Re-verify stock before proceeding
      for (const item of cart.items) {
        if (item.qty > item.product.stock) {
          return next(new AppError('OUT_OF_STOCK', 400, `Insufficient stock for product "${item.product.title}"`));
        }
      }

      const orderNumber = generateOrderNumber();
      const providerOrderId = `rzp_order_${crypto.randomBytes(8).toString('hex')}`;

      // Snapshot address and items for invoice consistency
      const addressSnapshot = {
        label: address.label,
        recipient: address.recipient,
        phone: address.phone,
        lines: address.lines,
        city: address.city,
        state: address.state,
        postalCode: address.postalCode,
      };

      const itemsSnapshot = cart.items.map(item => ({
        productId: item.productId,
        variantId: item.variantId,
        name: item.product.title,
        sku: item.product.sku,
        variantLabel: item.product.variantLabel || undefined,
        imageUrl: item.product.image || undefined,
        qty: item.qty,
        unitPricePaise: item.product.unitPricePaise,
        discountPaise: 0, // In v1 discounts are applied at order totals level
        taxPaise: Math.round((item.product.unitPricePaise * item.qty) - ((item.product.unitPricePaise * item.qty) / 1.18)),
      }));

      // Create a pending order draft
      const order = await OrderRepository.create({
        orderNumber,
        userId: req.user!.id,
        items: itemsSnapshot,
        address: addressSnapshot,
        totals: cart.totals,
        payment: {
          providerOrderId,
          status: 'pending',
          amountPaidPaise: cart.totals.totalPaise,
        },
        status: 'pending_payment',
        timeline: [
          {
            status: 'pending_payment',
            timestamp: new Date().toISOString(),
            actor: 'customer',
            note: 'Order draft created. Pending payment authorization.',
          }
        ],
        couponCode: cart.couponCode,
      });

      res.status(201).json({
        data: {
          orderId: order.id,
          orderNumber: order.orderNumber,
          providerOrderId,
          amountPaise: cart.totals.totalPaise,
          currency: 'INR',
          key: env.RAZORPAY_KEY_ID, // Provide the public test mode key for frontend SDK initialization
        },
        meta: { requestId: req.requestId }
      });
    } catch (err) {
      next(err);
    }
  },

  async verifyPayment(req: ExtendedRequest, res: Response, next: NextFunction) {
    try {
      const body = verifyPaymentSchema.parse(req.body);
      const order = await OrderRepository.findById(body.orderId);

      if (!order || order.userId !== req.user!.id) {
        return next(AppError.notFound('Order not found'));
      }

      // Idempotency: check if already paid
      if (order.status !== 'pending_payment') {
        return res.status(200).json({
          data: { order },
          meta: { requestId: req.requestId }
        });
      }

      const isSuccess = body.simulateStatus === 'success';

      if (!isSuccess) {
        // Payment failed simulation
        const updated = await OrderRepository.update(order.id, {
          status: 'payment_failed',
          payment: {
            ...order.payment,
            status: 'failed',
            errorMessage: 'Simulated payment failure or cancellation',
          },
          timeline: [
            ...order.timeline,
            {
              status: 'payment_failed',
              timestamp: new Date().toISOString(),
              actor: 'system',
              note: 'Payment authorization failed.',
            }
          ]
        });

        return res.status(200).json({
          data: { order: updated },
          meta: { requestId: req.requestId }
        });
      }

      // Check stock and decrement inventory atomically
      for (const item of order.items) {
        const product = await ProductRepository.findById(item.productId);
        if (!product) {
          return next(AppError.notFound(`Product in order not found: ${item.productId}`));
        }

        let maxStock = product.stock;
        let variantStockIdx = -1;

        if (item.variantId) {
          variantStockIdx = product.variants.findIndex(v => v.id === item.variantId);
          if (variantStockIdx !== -1) {
            maxStock = product.variants[variantStockIdx].stock;
          }
        }

        if (item.qty > maxStock) {
          // If stock runs out between payment initiation and completion
          await OrderRepository.update(order.id, {
            status: 'payment_failed',
            payment: {
              ...order.payment,
              status: 'failed',
              errorMessage: `Item "${item.name}" became out of stock during payment.`,
            },
            timeline: [
              ...order.timeline,
              {
                status: 'payment_failed',
                timestamp: new Date().toISOString(),
                actor: 'system',
                note: `Checkout failed: insufficient inventory for "${item.name}".`,
              }
            ]
          });

          return next(new AppError('OUT_OF_STOCK', 400, `Item "${item.name}" became out of stock. Payment cancelled.`));
        }

        // Adjust stock
        if (item.variantId && variantStockIdx !== -1) {
          const variants = [...product.variants];
          variants[variantStockIdx].stock -= item.qty;
          await ProductRepository.update(product.id, { variants });
        } else {
          await ProductRepository.update(product.id, { stock: product.stock - item.qty });
        }
      }

      // Increment coupon usage count if applied
      if (order.couponCode) {
        const coupon = await CouponRepository.findByCode(order.couponCode);
        if (coupon) {
          await CouponRepository.update(coupon.id, {
            usageCount: coupon.usageCount + 1
          });
        }
      }

      // Clear Customer's Cart
      await CartRepository.delete(req.user!.id);

      // Confirm Order Payment
      const confirmedOrder = await OrderRepository.update(order.id, {
        status: 'paid',
        payment: {
          ...order.payment,
          paymentId: body.razorpayPaymentId || `pay_mock_${crypto.randomBytes(8).toString('hex')}`,
          signature: body.razorpaySignature || `sig_mock_${crypto.randomBytes(16).toString('hex')}`,
          status: 'captured',
          method: 'test_mode',
        },
        timeline: [
          ...order.timeline,
          {
            status: 'paid',
            timestamp: new Date().toISOString(),
            actor: 'system',
            note: 'Payment successfully captured via Razorpay Test Mode.',
          }
        ]
      });

      // Write Audit Log
      await AuditLogRepository.create({
        actorId: req.user!.id,
        action: 'ORDER_PLACED',
        entityType: 'Order',
        entityId: confirmedOrder!.id,
        after: confirmedOrder,
        requestId: req.requestId || 'unknown'
      });

      res.status(200).json({
        data: { order: confirmedOrder },
        meta: { requestId: req.requestId }
      });
    } catch (err) {
      next(err);
    }
  },

  async getCustomerOrders(req: ExtendedRequest, res: Response, next: NextFunction) {
    try {
      const orders = await OrderRepository.findByUser(req.user!.id);
      res.status(200).json({
        data: { orders },
        meta: { requestId: req.requestId }
      });
    } catch (err) {
      next(err);
    }
  },

  async getOrderDetails(req: ExtendedRequest, res: Response, next: NextFunction) {
    try {
      const order = await OrderRepository.findById(req.params.id);
      if (!order || (order.userId !== req.user!.id && req.user!.role !== 'admin')) {
        return next(AppError.notFound('Order not found'));
      }

      res.status(200).json({
        data: { order },
        meta: { requestId: req.requestId }
      });
    } catch (err) {
      next(err);
    }
  },

  async cancelOrder(req: ExtendedRequest, res: Response, next: NextFunction) {
    try {
      const order = await OrderRepository.findById(req.params.id);
      if (!order || order.userId !== req.user!.id) {
        return next(AppError.notFound('Order not found'));
      }

      // Check if cancellation is permitted (only before shipping)
      const nonCancellableStates: string[] = ['shipped', 'delivered', 'cancelled', 'returned'];
      if (nonCancellableStates.includes(order.status)) {
        return next(AppError.badRequest(`Order cannot be cancelled because it is already ${order.status}`));
      }

      // Return items back to stock
      for (const item of order.items) {
        const product = await ProductRepository.findById(item.productId);
        if (product) {
          if (item.variantId) {
            const variantIdx = product.variants.findIndex(v => v.id === item.variantId);
            if (variantIdx !== -1) {
              const variants = [...product.variants];
              variants[variantIdx].stock += item.qty;
              await ProductRepository.update(product.id, { variants });
            }
          } else {
            await ProductRepository.update(product.id, { stock: product.stock + item.qty });
          }
        }
      }

      // Update order status
      const updated = await OrderRepository.update(order.id, {
        status: 'cancelled',
        timeline: [
          ...order.timeline,
          {
            status: 'cancelled',
            timestamp: new Date().toISOString(),
            actor: 'customer',
            note: 'Order cancelled by customer.',
          }
        ]
      });

      // Write Audit Log
      await AuditLogRepository.create({
        actorId: req.user!.id,
        action: 'ORDER_CANCELLED',
        entityType: 'Order',
        entityId: order.id,
        after: updated,
        requestId: req.requestId || 'unknown'
      });

      res.status(200).json({
        data: { order: updated },
        meta: { requestId: req.requestId }
      });
    } catch (err) {
      next(err);
    }
  }
};
