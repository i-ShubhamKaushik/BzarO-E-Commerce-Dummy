import { isMongooseMode } from './index';
import {
  MongooseUser, MongooseAddress, MongooseCategory, MongooseProduct,
  MongooseCart, MongooseWishlist, MongooseCoupon, MongooseOrder,
  MongooseReview, MongoosePromotion, MongooseAuditLog, MongooseSession
} from './mongoose';
import {
  jsonUsers, jsonAddresses, jsonCategories, jsonProducts,
  jsonCarts, jsonWishlists, jsonCoupons, jsonOrders,
  jsonReviews, jsonPromotions, jsonAuditLogs, jsonSessions
} from './jsonDb';
import { User, Address, Category, Product, Cart, Wishlist, Coupon, Order, Review, Promotion, AuditLog } from '@ecom/contracts';

// Helper to format mongoose documents to plain TypeScript objects with 'id'
const toObj = (doc: any) => {
  if (!doc) return doc;
  const obj = doc.toObject ? doc.toObject() : doc;
  if (obj._id) {
    obj.id = obj._id.toString();
  }
  return obj;
};

export const UserRepository = {
  async findByEmail(email: string): Promise<(User & { passwordHash: string }) | null> {
    if (isMongooseMode) {
      return toObj(await MongooseUser.findOne({ email: email.toLowerCase() }));
    } else {
      return jsonUsers.findOne(u => u.email.toLowerCase() === email.toLowerCase()) || null;
    }
  },

  async findById(id: string): Promise<User | null> {
    if (isMongooseMode) {
      return toObj(await MongooseUser.findById(id));
    } else {
      return jsonUsers.findById(id) || null;
    }
  },

  async create(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'> & { passwordHash: string }): Promise<User> {
    if (isMongooseMode) {
      const doc = new MongooseUser({ ...user, email: user.email.toLowerCase() });
      await doc.save();
      return toObj(doc);
    } else {
      return jsonUsers.insert({ ...user, email: user.email.toLowerCase() } as any);
    }
  },

  async update(id: string, updates: Partial<User & { passwordHash?: string }>): Promise<User | null> {
    if (isMongooseMode) {
      return toObj(await MongooseUser.findByIdAndUpdate(id, updates, { new: true }));
    } else {
      return jsonUsers.update(id, updates as any);
    }
  },

  async getAll(): Promise<User[]> {
    if (isMongooseMode) {
      const docs = await MongooseUser.find({});
      return docs.map(toObj);
    } else {
      return jsonUsers.getAll();
    }
  },

  async getAllPaginated(filters: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    role?: string;
  }): Promise<{ users: User[]; total: number; pages: number }> {
    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const skip = (page - 1) * limit;

    if (isMongooseMode) {
      const query: any = {};
      if (filters.status) query.status = filters.status;
      if (filters.role) query.role = filters.role;
      if (filters.search) {
        query.$or = [
          { name: { $regex: filters.search, $options: 'i' } },
          { email: { $regex: filters.search, $options: 'i' } },
          { _id: filters.search.match(/^[0-9a-fA-F]{24}$/) ? filters.search : undefined }
        ].filter(Boolean);
      }

      const total = await MongooseUser.countDocuments(query);
      const docs = await MongooseUser.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      return {
        users: docs.map(toObj),
        total,
        pages: Math.ceil(total / limit)
      };
    } else {
      let list = jsonUsers.getAll();
      if (filters.status) {
        list = list.filter(u => (u.status || 'active') === filters.status);
      }
      if (filters.role) {
        list = list.filter(u => u.role === filters.role);
      }
      if (filters.search) {
        const s = filters.search.toLowerCase();
        list = list.filter(u => 
          u.name.toLowerCase().includes(s) || 
          u.email.toLowerCase().includes(s) || 
          u.id === filters.search ||
          u._id === filters.search
        );
      }

      const total = list.length;
      const paginated = list
        .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
        .slice(skip, skip + limit);

      return {
        users: paginated,
        total,
        pages: Math.ceil(total / limit)
      };
    }
  }
};

export const AddressRepository = {
  async findByUser(userId: string): Promise<Address[]> {
    if (isMongooseMode) {
      const docs = await MongooseAddress.find({ userId });
      return docs.map(toObj);
    } else {
      return jsonAddresses.find(a => a.userId === userId);
    }
  },

  async findById(id: string): Promise<Address | null> {
    if (isMongooseMode) {
      return toObj(await MongooseAddress.findById(id));
    } else {
      return jsonAddresses.findById(id) || null;
    }
  },

  async create(address: Omit<Address, 'id' | 'createdAt' | 'updatedAt'>): Promise<Address> {
    if (isMongooseMode) {
      const doc = new MongooseAddress(address);
      await doc.save();
      return toObj(doc);
    } else {
      return jsonAddresses.insert(address as any);
    }
  },

  async update(id: string, updates: Partial<Address>): Promise<Address | null> {
    if (isMongooseMode) {
      return toObj(await MongooseAddress.findByIdAndUpdate(id, updates, { new: true }));
    } else {
      return jsonAddresses.update(id, updates);
    }
  },

  async delete(id: string): Promise<boolean> {
    if (isMongooseMode) {
      const res = await MongooseAddress.findByIdAndDelete(id);
      return !!res;
    } else {
      return jsonAddresses.delete(id);
    }
  },

  async setAllNonDefault(userId: string): Promise<void> {
    if (isMongooseMode) {
      await MongooseAddress.updateMany({ userId }, { isDefault: false });
    } else {
      jsonAddresses.find(a => a.userId === userId).forEach(a => {
        a.isDefault = false;
      });
      jsonAddresses.save();
    }
  }
};

export const CategoryRepository = {
  async getAll(): Promise<Category[]> {
    if (isMongooseMode) {
      const docs = await MongooseCategory.find({}).sort({ sortOrder: 1 });
      return docs.map(toObj);
    } else {
      return jsonCategories.getAll().sort((a, b) => a.sortOrder - b.sortOrder);
    }
  },

  async findBySlug(slug: string): Promise<Category | null> {
    if (isMongooseMode) {
      return toObj(await MongooseCategory.findOne({ slug }));
    } else {
      return jsonCategories.findOne(c => c.slug === slug) || null;
    }
  },

  async findById(id: string): Promise<Category | null> {
    if (isMongooseMode) {
      return toObj(await MongooseCategory.findById(id));
    } else {
      return jsonCategories.findById(id) || null;
    }
  },

  async create(category: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>): Promise<Category> {
    if (isMongooseMode) {
      const doc = new MongooseCategory(category);
      await doc.save();
      return toObj(doc);
    } else {
      return jsonCategories.insert(category as any);
    }
  },

  async update(id: string, updates: Partial<Category>): Promise<Category | null> {
    if (isMongooseMode) {
      return toObj(await MongooseCategory.findByIdAndUpdate(id, updates, { new: true }));
    } else {
      return jsonCategories.update(id, updates);
    }
  },

  async delete(id: string): Promise<boolean> {
    if (isMongooseMode) {
      const res = await MongooseCategory.findByIdAndDelete(id);
      return !!res;
    } else {
      return jsonCategories.delete(id);
    }
  }
};

export interface ProductFilters {
  category?: string;
  brand?: string[];
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  inStock?: boolean;
  search?: string;
  sort?: string;
  page?: number;
  limit?: number;
  status?: 'published' | 'draft' | 'archived';
}

export const ProductRepository = {
  async getAll(filters: ProductFilters = {}): Promise<{ products: Product[]; total: number; pages: number }> {
    const page = filters.page || 1;
    const limit = filters.limit || 12;
    const skip = (page - 1) * limit;

    if (isMongooseMode) {
      const query: any = {};
      
      if (filters.status) query.status = filters.status;
      if (filters.category) query.categoryId = filters.category;
      
      if (filters.brand && filters.brand.length > 0) {
        query.brand = { $in: filters.brand };
      }
      
      if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
        query.pricePaise = {};
        if (filters.minPrice !== undefined) query.pricePaise.$gte = filters.minPrice;
        if (filters.maxPrice !== undefined) query.pricePaise.$lte = filters.maxPrice;
      }
      
      if (filters.rating !== undefined) {
        query['ratingSummary.averageRating'] = { $gte: filters.rating };
      }
      
      if (filters.inStock !== undefined) {
        query.stock = filters.inStock ? { $gt: 0 } : 0;
      }

      if (filters.search) {
        query.$text = { $search: filters.search };
      }

      let sortQuery: any = { createdAt: -1 };
      if (filters.sort) {
        switch (filters.sort) {
          case 'newest': sortQuery = { createdAt: -1 }; break;
          case 'price_asc': sortQuery = { pricePaise: 1 }; break;
          case 'price_desc': sortQuery = { pricePaise: -1 }; break;
          case 'rating': sortQuery = { 'ratingSummary.averageRating': -1 }; break;
          case 'relevance':
            if (filters.search) sortQuery = { score: { $meta: 'textScore' } };
            break;
        }
      }

      const total = await MongooseProduct.countDocuments(query);
      const docs = await MongooseProduct.find(query)
        .sort(sortQuery)
        .skip(skip)
        .limit(limit);
        
      return {
        products: docs.map(toObj),
        total,
        pages: Math.ceil(total / limit),
      };
    } else {
      let list = jsonProducts.getAll();

      // Apply Filters
      if (filters.status) list = list.filter(p => p.status === filters.status);
      if (filters.category) list = list.filter(p => p.categoryId === filters.category);
      if (filters.brand && filters.brand.length > 0) {
        list = list.filter(p => filters.brand!.includes(p.brand));
      }
      if (filters.minPrice !== undefined) list = list.filter(p => p.pricePaise >= filters.minPrice!);
      if (filters.maxPrice !== undefined) list = list.filter(p => p.pricePaise <= filters.maxPrice!);
      if (filters.rating !== undefined) list = list.filter(p => p.ratingSummary.averageRating >= filters.rating!);
      if (filters.inStock !== undefined) {
        list = list.filter(p => filters.inStock ? p.stock > 0 : p.stock === 0);
      }
      if (filters.search) {
        const q = filters.search.toLowerCase();
        list = list.filter(p =>
          p.title.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.tags.some((t: string) => t.toLowerCase().includes(q))
        );
      }

      // Sort
      if (filters.sort) {
        switch (filters.sort) {
          case 'newest':
            list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            break;
          case 'price_asc':
            list.sort((a, b) => a.pricePaise - b.pricePaise);
            break;
          case 'price_desc':
            list.sort((a, b) => b.pricePaise - a.pricePaise);
            break;
          case 'rating':
            list.sort((a, b) => b.ratingSummary.averageRating - a.ratingSummary.averageRating);
            break;
        }
      } else {
        list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      }

      const total = list.length;
      const paginated = list.slice(skip, skip + limit);
      
      return {
        products: paginated,
        total,
        pages: Math.ceil(total / limit),
      };
    }
  },

  async findBySlug(slug: string): Promise<Product | null> {
    if (isMongooseMode) {
      return toObj(await MongooseProduct.findOne({ slug }));
    } else {
      return jsonProducts.findOne(p => p.slug === slug) || null;
    }
  },

  async findById(id: string): Promise<Product | null> {
    if (isMongooseMode) {
      return toObj(await MongooseProduct.findById(id));
    } else {
      return jsonProducts.findById(id) || null;
    }
  },

  async create(product: Omit<Product, 'id' | 'ratingSummary' | 'createdAt' | 'updatedAt'>): Promise<Product> {
    const initialRating = { averageRating: 0, totalReviews: 0 };
    if (isMongooseMode) {
      const doc = new MongooseProduct({ ...product, ratingSummary: initialRating });
      await doc.save();
      return toObj(doc);
    } else {
      return jsonProducts.insert({ ...product, ratingSummary: initialRating } as any);
    }
  },

  async update(id: string, updates: Partial<Product>): Promise<Product | null> {
    if (isMongooseMode) {
      return toObj(await MongooseProduct.findByIdAndUpdate(id, updates, { new: true }));
    } else {
      return jsonProducts.update(id, updates);
    }
  },

  async delete(id: string): Promise<boolean> {
    if (isMongooseMode) {
      const res = await MongooseProduct.findByIdAndDelete(id);
      return !!res;
    } else {
      return jsonProducts.delete(id);
    }
  }
};

export const CartRepository = {
  async findByUser(userId: string): Promise<Cart | null> {
    if (isMongooseMode) {
      return toObj(await MongooseCart.findOne({ userId }));
    } else {
      return jsonCarts.findOne(c => c.userId === userId) || null;
    }
  },

  async upsert(userId: string, items: Cart['items'], couponCode?: string): Promise<Cart> {
    if (isMongooseMode) {
      const doc = await MongooseCart.findOneAndUpdate(
        { userId },
        { userId, items, couponCode },
        { upsert: true, new: true }
      );
      return toObj(doc);
    } else {
      const existing = jsonCarts.findOne(c => c.userId === userId);
      if (existing) {
        return jsonCarts.update(existing.id, { items, couponCode })!;
      } else {
        return jsonCarts.insert({ userId, items, couponCode } as any);
      }
    }
  },

  async delete(userId: string): Promise<boolean> {
    if (isMongooseMode) {
      const res = await MongooseCart.findOneAndDelete({ userId });
      return !!res;
    } else {
      return jsonCarts.deleteMany(c => c.userId === userId) > 0;
    }
  }
};

export const WishlistRepository = {
  async findByUser(userId: string): Promise<Wishlist | null> {
    if (isMongooseMode) {
      return toObj(await MongooseWishlist.findOne({ userId }));
    } else {
      return jsonWishlists.findOne(w => w.userId === userId) || null;
    }
  },

  async upsert(userId: string, productIds: string[]): Promise<Wishlist> {
    if (isMongooseMode) {
      const doc = await MongooseWishlist.findOneAndUpdate(
        { userId },
        { userId, productIds },
        { upsert: true, new: true }
      );
      return toObj(doc);
    } else {
      const existing = jsonWishlists.findOne(w => w.userId === userId);
      if (existing) {
        return jsonWishlists.update(existing.id, { productIds })!;
      } else {
        return jsonWishlists.insert({ userId, productIds } as any);
      }
    }
  }
};

export const CouponRepository = {
  async findByCode(code: string): Promise<Coupon | null> {
    if (isMongooseMode) {
      return toObj(await MongooseCoupon.findOne({ code: code.toUpperCase() }));
    } else {
      return jsonCoupons.findOne(c => c.code.toUpperCase() === code.toUpperCase()) || null;
    }
  },

  async findById(id: string): Promise<Coupon | null> {
    if (isMongooseMode) {
      return toObj(await MongooseCoupon.findById(id));
    } else {
      return jsonCoupons.findById(id) || null;
    }
  },

  async getAll(): Promise<Coupon[]> {
    if (isMongooseMode) {
      const docs = await MongooseCoupon.find({});
      return docs.map(toObj);
    } else {
      return jsonCoupons.getAll();
    }
  },

  async create(coupon: Omit<Coupon, 'id' | 'usageCount' | 'createdAt' | 'updatedAt'>): Promise<Coupon> {
    if (isMongooseMode) {
      const doc = new MongooseCoupon({ ...coupon, code: coupon.code.toUpperCase(), usageCount: 0 });
      await doc.save();
      return toObj(doc);
    } else {
      return jsonCoupons.insert({ ...coupon, code: coupon.code.toUpperCase(), usageCount: 0 } as any);
    }
  },

  async update(id: string, updates: Partial<Coupon>): Promise<Coupon | null> {
    if (isMongooseMode) {
      if (updates.code) updates.code = updates.code.toUpperCase();
      return toObj(await MongooseCoupon.findByIdAndUpdate(id, updates, { new: true }));
    } else {
      if (updates.code) updates.code = updates.code.toUpperCase();
      return jsonCoupons.update(id, updates);
    }
  },

  async delete(id: string): Promise<boolean> {
    if (isMongooseMode) {
      const res = await MongooseCoupon.findByIdAndDelete(id);
      return !!res;
    } else {
      return jsonCoupons.delete(id);
    }
  }
};

export const OrderRepository = {
  async findByUser(userId: string): Promise<Order[]> {
    if (isMongooseMode) {
      const docs = await MongooseOrder.find({ userId }).sort({ createdAt: -1 });
      return docs.map(toObj);
    } else {
      return jsonOrders.find(o => o.userId === userId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
  },

  async findById(id: string): Promise<Order | null> {
    if (isMongooseMode) {
      return toObj(await MongooseOrder.findById(id));
    } else {
      return jsonOrders.findById(id) || null;
    }
  },

  async findByOrderNumber(orderNumber: string): Promise<Order | null> {
    if (isMongooseMode) {
      return toObj(await MongooseOrder.findOne({ orderNumber }));
    } else {
      return jsonOrders.findOne(o => o.orderNumber === orderNumber) || null;
    }
  },

  async create(order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<Order> {
    if (isMongooseMode) {
      const doc = new MongooseOrder(order);
      await doc.save();
      return toObj(doc);
    } else {
      return jsonOrders.insert(order as any);
    }
  },

  async update(id: string, updates: Partial<Order>): Promise<Order | null> {
    if (isMongooseMode) {
      return toObj(await MongooseOrder.findByIdAndUpdate(id, updates, { new: true }));
    } else {
      return jsonOrders.update(id, updates);
    }
  },

  async getAll(page = 1, limit = 20): Promise<{ orders: Order[]; total: number; pages: number }> {
    const skip = (page - 1) * limit;
    if (isMongooseMode) {
      const total = await MongooseOrder.countDocuments({});
      const docs = await MongooseOrder.find({})
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
      return {
        orders: docs.map(toObj),
        total,
        pages: Math.ceil(total / limit)
      };
    } else {
      const list = jsonOrders.getAll().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      const total = list.length;
      return {
        orders: list.slice(skip, skip + limit),
        total,
        pages: Math.ceil(total / limit)
      };
    }
  },

  async getStats(): Promise<{ ordersCount: number; revenuePaise: number; avgOrderValPaise: number; lowStockCount: number }> {
    if (isMongooseMode) {
      const aggregate = await MongooseOrder.aggregate([
        { $match: { status: { $in: ['paid', 'processing', 'shipped', 'delivered'] } } },
        {
          $group: {
            _id: null,
            count: { $sum: 1 },
            revenue: { $sum: '$totals.totalPaise' }
          }
        }
      ]);
      const activeProductsLowStock = await MongooseProduct.countDocuments({ status: 'published', stock: { $lte: 5 } });
      const stats = aggregate[0] || { count: 0, revenue: 0 };
      return {
        ordersCount: stats.count,
        revenuePaise: stats.revenue,
        avgOrderValPaise: stats.count > 0 ? Math.round(stats.revenue / stats.count) : 0,
        lowStockCount: activeProductsLowStock
      };
    } else {
      const activeOrders = jsonOrders.find(o => ['paid', 'processing', 'shipped', 'delivered'].includes(o.status));
      const revenue = activeOrders.reduce((sum, o) => sum + o.totals.totalPaise, 0);
      const lowStockProducts = jsonProducts.find(p => p.status === 'published' && p.stock <= 5);
      return {
        ordersCount: activeOrders.length,
        revenuePaise: revenue,
        avgOrderValPaise: activeOrders.length > 0 ? Math.round(revenue / activeOrders.length) : 0,
        lowStockCount: lowStockProducts.length
      };
    }
  }
};

export const ReviewRepository = {
  async findByProduct(productId: string): Promise<Review[]> {
    if (isMongooseMode) {
      const docs = await MongooseReview.find({ productId, status: 'approved' }).sort({ createdAt: -1 });
      return docs.map(toObj);
    } else {
      return jsonReviews.find(r => r.productId === productId && r.status === 'approved')
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
  },

  async findById(id: string): Promise<Review | null> {
    if (isMongooseMode) {
      return toObj(await MongooseReview.findById(id));
    } else {
      return jsonReviews.findById(id) || null;
    }
  },

  async findByProductAndUser(productId: string, userId: string): Promise<Review | null> {
    if (isMongooseMode) {
      return toObj(await MongooseReview.findOne({ productId, userId }));
    } else {
      return jsonReviews.findOne(r => r.productId === productId && r.userId === userId) || null;
    }
  },

  async create(review: Omit<Review, 'id' | 'createdAt' | 'updatedAt'>): Promise<Review> {
    if (isMongooseMode) {
      const doc = new MongooseReview(review);
      await doc.save();
      return toObj(doc);
    } else {
      return jsonReviews.insert(review as any);
    }
  },

  async update(id: string, updates: Partial<Review>): Promise<Review | null> {
    if (isMongooseMode) {
      return toObj(await MongooseReview.findByIdAndUpdate(id, updates, { new: true }));
    } else {
      return jsonReviews.update(id, updates);
    }
  },

  async delete(id: string): Promise<boolean> {
    if (isMongooseMode) {
      const res = await MongooseReview.findByIdAndDelete(id);
      return !!res;
    } else {
      return jsonReviews.delete(id);
    }
  },

  async getAll(page = 1, limit = 20): Promise<{ reviews: Review[]; total: number; pages: number }> {
    const skip = (page - 1) * limit;
    if (isMongooseMode) {
      const total = await MongooseReview.countDocuments({});
      const docs = await MongooseReview.find({})
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
      return {
        reviews: docs.map(toObj),
        total,
        pages: Math.ceil(total / limit)
      };
    } else {
      const list = jsonReviews.getAll().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      const total = list.length;
      return {
        reviews: list.slice(skip, skip + limit),
        total,
        pages: Math.ceil(total / limit)
      };
    }
  }
};

export const PromotionRepository = {
  async getAllActive(): Promise<Promotion[]> {
    if (isMongooseMode) {
      const now = new Date().toISOString();
      const docs = await MongoosePromotion.find({
        active: true,
        startsAt: { $lte: now },
        endsAt: { $gte: now }
      }).sort({ sortOrder: 1 });
      return docs.map(toObj);
    } else {
      const now = new Date().toISOString();
      return jsonPromotions.find(p => p.active && p.startsAt <= now && p.endsAt >= now)
        .sort((a, b) => a.sortOrder - b.sortOrder);
    }
  },

  async create(promo: Omit<Promotion, 'id' | 'createdAt' | 'updatedAt'>): Promise<Promotion> {
    if (isMongooseMode) {
      const doc = new MongoosePromotion(promo);
      await doc.save();
      return toObj(doc);
    } else {
      return jsonPromotions.insert(promo as any);
    }
  },

  async getAll(): Promise<Promotion[]> {
    if (isMongooseMode) {
      const docs = await MongoosePromotion.find({}).sort({ sortOrder: 1 });
      return docs.map(toObj);
    } else {
      return jsonPromotions.getAll().sort((a, b) => a.sortOrder - b.sortOrder);
    }
  },

  async update(id: string, updates: Partial<Promotion>): Promise<Promotion | null> {
    if (isMongooseMode) {
      return toObj(await MongoosePromotion.findByIdAndUpdate(id, updates, { new: true }));
    } else {
      return jsonPromotions.update(id, updates);
    }
  },

  async delete(id: string): Promise<boolean> {
    if (isMongooseMode) {
      const res = await MongoosePromotion.findByIdAndDelete(id);
      return !!res;
    } else {
      return jsonPromotions.delete(id);
    }
  }
};

export const AuditLogRepository = {
  async create(log: Omit<AuditLog, 'id' | 'createdAt'>): Promise<AuditLog> {
    if (isMongooseMode) {
      const doc = new MongooseAuditLog(log);
      await doc.save();
      return toObj(doc);
    } else {
      return jsonAuditLogs.insert(log as any);
    }
  },

  async getAll(page = 1, limit = 50): Promise<AuditLog[]> {
    const skip = (page - 1) * limit;
    if (isMongooseMode) {
      const docs = await MongooseAuditLog.find({})
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
      return docs.map(toObj);
    } else {
      return jsonAuditLogs.getAll()
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(skip, skip + limit);
    }
  },

  async getAllPaginated(filters: {
    page?: number;
    limit?: number;
    action?: string;
    actorId?: string;
    entityType?: string;
    from?: string;
    to?: string;
  }): Promise<{ logs: AuditLog[]; total: number; pages: number }> {
    const page = filters.page || 1;
    const limit = filters.limit || 50;
    const skip = (page - 1) * limit;

    if (isMongooseMode) {
      const query: any = {};
      if (filters.action) query.action = filters.action;
      if (filters.actorId) query.actorId = filters.actorId;
      if (filters.entityType) query.entityType = filters.entityType;
      
      if (filters.from || filters.to) {
        query.createdAt = {};
        if (filters.from) query.createdAt.$gte = new Date(filters.from);
        if (filters.to) query.createdAt.$lte = new Date(filters.to);
      }

      const total = await MongooseAuditLog.countDocuments(query);
      const docs = await MongooseAuditLog.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      return {
        logs: docs.map(toObj),
        total,
        pages: Math.ceil(total / limit)
      };
    } else {
      let list = jsonAuditLogs.getAll();
      if (filters.action) list = list.filter(l => l.action === filters.action);
      if (filters.actorId) list = list.filter(l => l.actorId === filters.actorId);
      if (filters.entityType) list = list.filter(l => l.entityType === filters.entityType);
      
      if (filters.from) {
        const fromTime = new Date(filters.from).getTime();
        list = list.filter(l => new Date(l.createdAt).getTime() >= fromTime);
      }
      if (filters.to) {
        const toTime = new Date(filters.to).getTime();
        list = list.filter(l => new Date(l.createdAt).getTime() <= toTime);
      }

      const total = list.length;
      const paginated = list
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(skip, skip + limit);

      return {
        logs: paginated,
        total,
        pages: Math.ceil(total / limit)
      };
    }
  }
};

export const SessionRepository = {
  async create(session: { userId: string; refreshTokenHash: string; expiresAt: Date; ipHash?: string; userAgent?: string }): Promise<any> {
    if (isMongooseMode) {
      const doc = new MongooseSession(session);
      await doc.save();
      return toObj(doc);
    } else {
      return jsonSessions.insert(session as any);
    }
  },

  async findByTokenHash(hash: string): Promise<any> {
    if (isMongooseMode) {
      return toObj(await MongooseSession.findOne({ refreshTokenHash: hash }));
    } else {
      return jsonSessions.findOne(s => s.refreshTokenHash === hash) || null;
    }
  },

  async revoke(hash: string): Promise<boolean> {
    if (isMongooseMode) {
      const res = await MongooseSession.findOneAndUpdate({ refreshTokenHash: hash }, { revokedAt: new Date() });
      return !!res;
    } else {
      const existing = jsonSessions.findOne(s => s.refreshTokenHash === hash);
      if (existing) {
        jsonSessions.update(existing.id, { revokedAt: new Date().toISOString() });
        return true;
      }
      return false;
    }
  },

  async revokeAllForUser(userId: string): Promise<void> {
    if (isMongooseMode) {
      await MongooseSession.updateMany({ userId }, { revokedAt: new Date() });
    } else {
      jsonSessions.find(s => s.userId === userId).forEach(s => {
        s.revokedAt = new Date().toISOString();
      });
      jsonSessions.save();
    }
  },

  async deleteExpired(): Promise<number> {
    const now = new Date();
    if (isMongooseMode) {
      const res = await MongooseSession.deleteMany({ expiresAt: { $lt: now } });
      return res.deletedCount || 0;
    } else {
      return jsonSessions.deleteMany(s => new Date(s.expiresAt).getTime() < now.getTime());
    }
  }
};
