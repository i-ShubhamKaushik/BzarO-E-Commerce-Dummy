import { Response, NextFunction } from 'express';
import { ExtendedRequest } from '../../middleware/error';
import {
  OrderRepository, ProductRepository, CategoryRepository,
  ReviewRepository, CouponRepository, AuditLogRepository, UserRepository,
  SessionRepository
} from '../../db/repositories';
import {
  productAdminSchema, categorySchema, reviewModerationSchema,
  couponSchema, inventoryAdjustmentSchema
} from '@ecom/contracts';
import { AppError } from '../../lib/errors';
import { recalculateProductRating } from '../catalogue/catalogue.controller';
import { z } from 'zod';

const updateOrderStatusSchema = z.object({
  status: z.enum(['paid', 'processing', 'shipped', 'delivered', 'cancelled', 'returned']),
  note: z.string().optional()
});

export const AdminController = {
  async getDashboard(req: ExtendedRequest, res: Response, next: NextFunction) {
    try {
      const stats = await OrderRepository.getStats();
      
      // Get 5 recent orders
      const ordersResult = await OrderRepository.getAll(1, 5);
      
      // Get 5 low stock products (published products with stock <= 5)
      const productsResult = await ProductRepository.getAll({
        status: 'published',
        limit: 5,
        sort: 'newest'
      });
      const lowStockProducts = productsResult.products.filter(p => p.stock <= 5);

      res.status(200).json({
        data: {
          stats,
          recentOrders: ordersResult.orders,
          lowStockProducts
        },
        meta: { requestId: req.requestId }
      });
    } catch (err) {
      next(err);
    }
  },

  // PRODUCTS CRUD
  async createProduct(req: ExtendedRequest, res: Response, next: NextFunction) {
    try {
      const body = productAdminSchema.parse(req.body);
      
      // Generate standard slug from title
      const slug = body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const existingSlug = await ProductRepository.findBySlug(slug);
      if (existingSlug) {
        return next(AppError.conflict('A product with a similar title already exists. Please choose a different title.'));
      }

      const product = await ProductRepository.create({
        ...body,
        slug,
      });

      // Write Audit Log
      await AuditLogRepository.create({
        actorId: req.user!.id,
        action: 'PRODUCT_CREATE',
        entityType: 'Product',
        entityId: product.id,
        after: product,
        requestId: req.requestId || 'unknown'
      });

      res.status(201).json({
        data: { product },
        meta: { requestId: req.requestId }
      });
    } catch (err) {
      next(err);
    }
  },

  async updateProduct(req: ExtendedRequest, res: Response, next: NextFunction) {
    try {
      const productId = req.params.id;
      const body = productAdminSchema.partial().parse(req.body);

      const existing = await ProductRepository.findById(productId);
      if (!existing) return next(AppError.notFound('Product not found'));

      let slug = existing.slug;
      if (body.title && body.title !== existing.title) {
        slug = body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        const existingSlug = await ProductRepository.findBySlug(slug);
        if (existingSlug && existingSlug.id !== productId) {
          return next(AppError.conflict('A product with a similar title already exists.'));
        }
      }

      const updated = await ProductRepository.update(productId, {
        ...body,
        slug
      });

      // Write Audit Log
      await AuditLogRepository.create({
        actorId: req.user!.id,
        action: 'PRODUCT_UPDATE',
        entityType: 'Product',
        entityId: productId,
        before: existing,
        after: updated,
        requestId: req.requestId || 'unknown'
      });

      res.status(200).json({
        data: { product: updated },
        meta: { requestId: req.requestId }
      });
    } catch (err) {
      next(err);
    }
  },

  async deleteProduct(req: ExtendedRequest, res: Response, next: NextFunction) {
    try {
      const productId = req.params.id;
      const existing = await ProductRepository.findById(productId);
      if (!existing) return next(AppError.notFound('Product not found'));

      // Rule from TRD: Check if referenced by an order
      // Since order snapshots item list inside order, check order collections
      // If we are in dummy mode, for ease we can simply check if any order has this productId
      // To satisfy: "Deleting a product is not permitted when referenced by an order; archive it instead."
      const allOrders = await OrderRepository.getAll(1, 1000);
      const isReferenced = allOrders.orders.some(order => 
        order.items.some(item => item.productId === productId)
      );

      if (isReferenced) {
        // Automatically archive it instead or block deletion
        await ProductRepository.update(productId, { status: 'archived' });
        
        await AuditLogRepository.create({
          actorId: req.user!.id,
          action: 'PRODUCT_ARCHIVE_AUTO',
          entityType: 'Product',
          entityId: productId,
          before: existing,
          after: { ...existing, status: 'archived' },
          requestId: req.requestId || 'unknown'
        });

        return res.status(200).json({
          data: { success: true, message: 'Product is referenced by orders. Automatically archived instead of deleted.' },
          meta: { requestId: req.requestId }
        });
      }

      await ProductRepository.delete(productId);

      // Write Audit Log
      await AuditLogRepository.create({
        actorId: req.user!.id,
        action: 'PRODUCT_DELETE',
        entityType: 'Product',
        entityId: productId,
        before: existing,
        requestId: req.requestId || 'unknown'
      });

      res.status(200).json({
        data: { success: true, message: 'Product deleted successfully.' },
        meta: { requestId: req.requestId }
      });
    } catch (err) {
      next(err);
    }
  },

  // CATEGORIES CRUD
  async createCategory(req: ExtendedRequest, res: Response, next: NextFunction) {
    try {
      const body = categorySchema.parse(req.body);
      const slug = body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      
      const existing = await CategoryRepository.findBySlug(slug);
      if (existing) return next(AppError.conflict('Category name slug already exists'));

      const category = await CategoryRepository.create({
        ...body,
        slug
      });

      res.status(201).json({
        data: { category },
        meta: { requestId: req.requestId }
      });
    } catch (err) {
      next(err);
    }
  },

  async updateCategory(req: ExtendedRequest, res: Response, next: NextFunction) {
    try {
      const catId = req.params.id;
      const body = categorySchema.partial().parse(req.body);

      const existing = await CategoryRepository.findById(catId);
      if (!existing) return next(AppError.notFound('Category not found'));

      let slug = existing.slug;
      if (body.name && body.name !== existing.name) {
        slug = body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        const existingSlug = await CategoryRepository.findBySlug(slug);
        if (existingSlug && existingSlug.id !== catId) {
          return next(AppError.conflict('Category slug already exists'));
        }
      }

      const updated = await CategoryRepository.update(catId, {
        ...body,
        slug
      });

      res.status(200).json({
        data: { category: updated },
        meta: { requestId: req.requestId }
      });
    } catch (err) {
      next(err);
    }
  },

  async deleteCategory(req: ExtendedRequest, res: Response, next: NextFunction) {
    try {
      const catId = req.params.id;
      const existing = await CategoryRepository.findById(catId);
      if (!existing) return next(AppError.notFound('Category not found'));

      await CategoryRepository.delete(catId);
      res.status(200).json({
        data: { success: true },
        meta: { requestId: req.requestId }
      });
    } catch (err) {
      next(err);
    }
  },

  // ORDER MANAGEMENT
  async getOrders(req: ExtendedRequest, res: Response, next: NextFunction) {
    try {
      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;

      const result = await OrderRepository.getAll(page, limit);
      res.status(200).json({
        data: result.orders,
        meta: {
          page,
          limit,
          total: result.total,
          totalPages: result.pages,
          requestId: req.requestId
        }
      });
    } catch (err) {
      next(err);
    }
  },

  async updateOrderStatus(req: ExtendedRequest, res: Response, next: NextFunction) {
    try {
      const orderId = req.params.id;
      const { status, note } = updateOrderStatusSchema.parse(req.body);

      const order = await OrderRepository.findById(orderId);
      if (!order) return next(AppError.notFound('Order not found'));

      // Validate transitions if necessary
      // pending_payment -> paid -> processing -> shipped -> delivered
      const previousStatus = order.status;
      
      const updated = await OrderRepository.update(orderId, {
        status,
        timeline: [
          ...order.timeline,
          {
            status,
            timestamp: new Date().toISOString(),
            actor: 'admin',
            note: note || `Order status updated to ${status}.`
          }
        ]
      });

      // Write Audit Log
      await AuditLogRepository.create({
        actorId: req.user!.id,
        action: 'ORDER_STATUS_UPDATE',
        entityType: 'Order',
        entityId: orderId,
        before: { status: previousStatus },
        after: { status, note },
        requestId: req.requestId || 'unknown'
      });

      res.status(200).json({
        data: { order: updated },
        meta: { requestId: req.requestId }
      });
    } catch (err) {
      next(err);
    }
  },

  // REVIEWS MODERATION
  async getReviews(req: ExtendedRequest, res: Response, next: NextFunction) {
    try {
      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;

      const result = await ReviewRepository.getAll(page, limit);
      res.status(200).json({
        data: result.reviews,
        meta: {
          page,
          limit,
          total: result.total,
          totalPages: result.pages,
          requestId: req.requestId
        }
      });
    } catch (err) {
      next(err);
    }
  },

  async moderateReview(req: ExtendedRequest, res: Response, next: NextFunction) {
    try {
      const reviewId = req.params.id;
      const { status, reason } = reviewModerationSchema.parse(req.body);

      const review = await ReviewRepository.findById(reviewId);
      if (!review) return next(AppError.notFound('Review not found'));

      const previousStatus = review.status;
      const updated = await ReviewRepository.update(reviewId, {
        status,
        moderation: {
          moderatedBy: req.user!.email,
          moderatedAt: new Date().toISOString(),
          reason
        }
      });

      // Recalculate average rating for product if status changed to/from 'approved'
      if (status === 'approved' || previousStatus === 'approved') {
        await recalculateProductRating(review.productId);
      }

      // Write Audit Log
      await AuditLogRepository.create({
        actorId: req.user!.id,
        action: 'REVIEW_MODERATED',
        entityType: 'Review',
        entityId: reviewId,
        before: { status: previousStatus },
        after: { status, reason },
        requestId: req.requestId || 'unknown'
      });

      res.status(200).json({
        data: { review: updated },
        meta: { requestId: req.requestId }
      });
    } catch (err) {
      next(err);
    }
  },

  // INVENTORY ADJUSTMENT
  async adjustInventory(req: ExtendedRequest, res: Response, next: NextFunction) {
    try {
      const { productId, variantId, adjustment, reason } = inventoryAdjustmentSchema.parse(req.body);
      
      const product = await ProductRepository.findById(productId);
      if (!product) return next(AppError.notFound('Product not found'));

      const beforeStock = product.stock;
      let afterProduct: any = null;

      if (variantId) {
        const variants = [...product.variants];
        const vIdx = variants.findIndex(v => v.id === variantId);
        if (vIdx === -1) return next(AppError.notFound('Variant not found'));

        const beforeVStock = variants[vIdx].stock;
        const newStock = beforeVStock + adjustment;
        if (newStock < 0) return next(AppError.badRequest('Adjustment would make stock negative'));
        
        variants[vIdx].stock = newStock;
        afterProduct = await ProductRepository.update(productId, { variants });
      } else {
        const newStock = beforeStock + adjustment;
        if (newStock < 0) return next(AppError.badRequest('Adjustment would make stock negative'));
        
        afterProduct = await ProductRepository.update(productId, { stock: newStock });
      }

      // Write Audit Log
      await AuditLogRepository.create({
        actorId: req.user!.id,
        action: 'INVENTORY_ADJUSTMENT',
        entityType: 'Product',
        entityId: productId,
        before: { stock: beforeStock },
        after: { stock: afterProduct.stock, adjustment, reason },
        requestId: req.requestId || 'unknown'
      });

      res.status(200).json({
        data: { product: afterProduct },
        meta: { requestId: req.requestId }
      });
    } catch (err) {
      next(err);
    }
  },

  // COUPOUNS CRUD
  async getCoupons(req: ExtendedRequest, res: Response, next: NextFunction) {
    try {
      const coupons = await CouponRepository.getAll();
      res.status(200).json({
        data: { coupons },
        meta: { requestId: req.requestId }
      });
    } catch (err) {
      next(err);
    }
  },

  async createCoupon(req: ExtendedRequest, res: Response, next: NextFunction) {
    try {
      const body = couponSchema.parse(req.body);
      const existing = await CouponRepository.findByCode(body.code);
      if (existing) return next(AppError.conflict('Coupon code already exists'));

      const coupon = await CouponRepository.create(body);
      res.status(201).json({
        data: { coupon },
        meta: { requestId: req.requestId }
      });
    } catch (err) {
      next(err);
    }
  },

  async updateCoupon(req: ExtendedRequest, res: Response, next: NextFunction) {
    try {
      const couponId = req.params.id;
      const body = couponSchema.partial().parse(req.body);

      const existing = await CouponRepository.findById(couponId);
      if (!existing) return next(AppError.notFound('Coupon not found'));

      const updated = await CouponRepository.update(couponId, body);
      res.status(200).json({
        data: { coupon: updated },
        meta: { requestId: req.requestId }
      });
    } catch (err) {
      next(err);
    }
  },

  async deleteCoupon(req: ExtendedRequest, res: Response, next: NextFunction) {
    try {
      const couponId = req.params.id;
      const existing = await CouponRepository.findById(couponId);
      if (!existing) return next(AppError.notFound('Coupon not found'));

      await CouponRepository.delete(couponId);
      res.status(200).json({
        data: { success: true },
        meta: { requestId: req.requestId }
      });
    } catch (err) {
      next(err);
    }
  },

  async getUsers(req: ExtendedRequest, res: Response, next: NextFunction) {
    try {
      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
      const search = req.query.search as string;
      const status = req.query.status as string;
      const role = req.query.role as string;

      const result = await UserRepository.getAllPaginated({ page, limit, search, status, role });
      res.status(200).json({
        data: result.users,
        meta: {
          page,
          limit,
          total: result.total,
          totalPages: result.pages,
          requestId: req.requestId
        }
      });
    } catch (err) {
      next(err);
    }
  },

  async getUserDetails(req: ExtendedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.params.id;
      const user = await UserRepository.findById(userId);
      if (!user) return next(AppError.notFound('User not found'));

      const orders = await OrderRepository.findByUser(userId);
      const totalSpentPaise = orders
        .filter(o => ['paid', 'processing', 'shipped', 'delivered'].includes(o.status))
        .reduce((sum, o) => sum + o.totals.totalPaise, 0);

      res.status(200).json({
        data: {
          user,
          orderCount: orders.length,
          totalSpentPaise,
          recentOrders: orders.slice(0, 5)
        },
        meta: { requestId: req.requestId }
      });
    } catch (err) {
      next(err);
    }
  },

  async updateUserStatus(req: ExtendedRequest, res: Response, next: NextFunction) {
    try {
      const targetUserId = req.params.id;
      const { status } = z.object({ status: z.enum(['active', 'blocked']) }).parse(req.body);

      const targetUser = await UserRepository.findById(targetUserId);
      if (!targetUser) return next(AppError.notFound('User not found'));

      if (req.user!.id === targetUserId) {
        return next(AppError.badRequest('You cannot block your own administrative account'));
      }

      if (status === 'blocked' && targetUser.role === 'admin') {
        const allUsers = await UserRepository.getAll();
        const activeAdmins = allUsers.filter(u => u.role === 'admin' && (u.status || 'active') === 'active');
        if (activeAdmins.length <= 1 && (targetUser.status || 'active') === 'active') {
          return next(AppError.badRequest('Cannot block the last active administrator. There must be at least one active administrator.'));
        }
      }

      const before = { status: targetUser.status || 'active' };
      const updatedUser = await UserRepository.update(targetUserId, { status });

      if (status === 'blocked') {
        await SessionRepository.revokeAllForUser(targetUserId);
      }

      await AuditLogRepository.create({
        actorId: req.user!.id,
        action: status === 'blocked' ? 'USER_BLOCK' : 'USER_UNBLOCK',
        entityType: 'User',
        entityId: targetUserId,
        before,
        after: { status },
        requestId: req.requestId || 'unknown'
      });

      res.status(200).json({
        data: { user: updatedUser },
        meta: { requestId: req.requestId }
      });
    } catch (err) {
      next(err);
    }
  },

  async updateUserRole(req: ExtendedRequest, res: Response, next: NextFunction) {
    try {
      const targetUserId = req.params.id;
      const { role } = z.object({ role: z.enum(['customer', 'admin']) }).parse(req.body);

      const targetUser = await UserRepository.findById(targetUserId);
      if (!targetUser) return next(AppError.notFound('User not found'));

      if (req.user!.id === targetUserId) {
        return next(AppError.badRequest('You cannot demote your own administrative role'));
      }

      if (role === 'customer' && targetUser.role === 'admin') {
        const allUsers = await UserRepository.getAll();
        const admins = allUsers.filter(u => u.role === 'admin');
        if (admins.length <= 1) {
          return next(AppError.badRequest('Cannot demote the last administrator. There must be at least one administrator.'));
        }
      }

      const before = { role: targetUser.role };
      const updatedUser = await UserRepository.update(targetUserId, { role });

      await AuditLogRepository.create({
        actorId: req.user!.id,
        action: 'ROLE_CHANGED',
        entityType: 'User',
        entityId: targetUserId,
        before,
        after: { role },
        requestId: req.requestId || 'unknown'
      });

      res.status(200).json({
        data: { user: updatedUser },
        meta: { requestId: req.requestId }
      });
    } catch (err) {
      next(err);
    }
  },

  async getOrderDetails(req: ExtendedRequest, res: Response, next: NextFunction) {
    try {
      const orderId = req.params.id;
      const order = await OrderRepository.findById(orderId);
      if (!order) return next(AppError.notFound('Order not found'));

      const customer = await UserRepository.findById(order.userId);

      res.status(200).json({
        data: {
          ...order,
          customer: customer ? {
            name: customer.name,
            email: customer.email,
            phone: customer.phone
          } : null
        },
        meta: { requestId: req.requestId }
      });
    } catch (err) {
      next(err);
    }
  },

  async getAuditLogs(req: ExtendedRequest, res: Response, next: NextFunction) {
    try {
      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
      const action = req.query.action as string;
      const actorId = req.query.actorId as string;
      const entityType = req.query.entityType as string;
      const from = req.query.from as string;
      const to = req.query.to as string;

      const result = await AuditLogRepository.getAllPaginated({
        page, limit, action, actorId, entityType, from, to
      });

      const allUsers = await UserRepository.getAll();
      const userMap = new Map(allUsers.map(u => [u.id, u]));

      const populatedLogs = result.logs.map(log => {
        const actor = userMap.get(log.actorId);
        return {
          ...log,
          actor: actor ? { name: actor.name, email: actor.email } : { name: 'Unknown Admin', email: 'unknown@ecom.com' }
        };
      });

      res.status(200).json({
        data: populatedLogs,
        meta: {
          page,
          limit,
          total: result.total,
          totalPages: result.pages,
          requestId: req.requestId
        }
      });
    } catch (err) {
      next(err);
    }
  },

  async getAnalytics(req: ExtendedRequest, res: Response, next: NextFunction) {
    try {
      const from = req.query.from as string;
      const to = req.query.to as string;
      const fromTime = from ? new Date(from).getTime() : Date.now() - 86400000 * 30;
      const toTime = to ? new Date(to).getTime() : Date.now();

      const allOrdersResult = await OrderRepository.getAll(1, 10000);
      const orders = allOrdersResult.orders.filter(o => {
        const created = new Date(o.createdAt).getTime();
        return created >= fromTime && created <= toTime;
      });

      const trendsMap = new Map<string, { date: string; revenue: number; ordersCount: number }>();
      orders.forEach(o => {
        const dateStr = new Date(o.createdAt).toISOString().split('T')[0];
        const isPaid = ['paid', 'processing', 'shipped', 'delivered'].includes(o.status);
        const value = isPaid ? o.totals.totalPaise / 100 : 0;
        
        const existing = trendsMap.get(dateStr) || { date: dateStr, revenue: 0, ordersCount: 0 };
        existing.revenue += value;
        if (isPaid) {
          existing.ordersCount += 1;
        }
        trendsMap.set(dateStr, existing);
      });
      const trends = Array.from(trendsMap.values()).sort((a, b) => a.date.localeCompare(b.date));

      const categories = await CategoryRepository.getAll();
      const catMap = new Map(categories.map(c => [c.id, c.name]));
      const categorySalesMap = new Map<string, { categoryName: string; revenue: number; ordersCount: number }>();
      
      const productsResult = await ProductRepository.getAll({ limit: 1000 });
      const productCategoryMap = new Map(productsResult.products.map(p => [p.id, p.categoryId]));

      orders.forEach(o => {
        if (!['paid', 'processing', 'shipped', 'delivered'].includes(o.status)) return;
        o.items.forEach(item => {
          const catId = productCategoryMap.get(item.productId) || 'cat_electronics';
          const catName = catMap.get(catId) || 'Electronics';
          const existing = categorySalesMap.get(catId) || { categoryName: catName, revenue: 0, ordersCount: 0 };
          existing.revenue += (item.unitPricePaise * item.qty - item.discountPaise) / 100;
          existing.ordersCount += item.qty;
          categorySalesMap.set(catId, existing);
        });
      });
      const categorySales = Array.from(categorySalesMap.values());

      const topProductsMap = new Map<string, { productName: string; unitsSold: number; revenue: number }>();
      orders.forEach(o => {
        if (!['paid', 'processing', 'shipped', 'delivered'].includes(o.status)) return;
        o.items.forEach(item => {
          const existing = topProductsMap.get(item.productId) || { productName: item.name, unitsSold: 0, revenue: 0 };
          existing.unitsSold += item.qty;
          existing.revenue += (item.unitPricePaise * item.qty - item.discountPaise) / 100;
          topProductsMap.set(item.productId, existing);
        });
      });
      const topProducts = Array.from(topProductsMap.values())
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 10);

      const uniqueCustomers = new Set(orders.map(o => o.userId));
      const allUsers = await UserRepository.getAll();
      const newCustomersCount = allUsers.filter(u => {
        const created = new Date(u.createdAt).getTime();
        return created >= fromTime && created <= toTime && u.role === 'customer';
      }).length;

      res.status(200).json({
        data: {
          trends,
          categorySales,
          topProducts,
          customerMetrics: {
            orderingCustomers: uniqueCustomers.size,
            newCustomers: newCustomersCount,
            totalUsersCount: allUsers.length
          }
        },
        meta: { requestId: req.requestId }
      });
    } catch (err) {
      next(err);
    }
  }
};
