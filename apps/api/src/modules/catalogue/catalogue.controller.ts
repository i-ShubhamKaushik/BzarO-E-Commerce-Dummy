import { Response, NextFunction } from 'express';
import { ExtendedRequest } from '../../middleware/error';
import { CategoryRepository, ProductRepository, ReviewRepository, OrderRepository, PromotionRepository } from '../../db/repositories';
import { reviewSchema } from '@ecom/contracts';
import { AppError } from '../../lib/errors';

export const CatalogueController = {
  async getPromotions(req: ExtendedRequest, res: Response, next: NextFunction) {
    try {
      const promotions = await PromotionRepository.getAllActive();
      res.status(200).json({
        data: { promotions },
        meta: { requestId: req.requestId }
      });
    } catch (err) {
      next(err);
    }
  },

  async getCategories(req: ExtendedRequest, res: Response, next: NextFunction) {
    try {
      const categories = await CategoryRepository.getAll();
      const activeCategories = categories.filter(c => c.active);
      res.status(200).json({
        data: { categories: activeCategories },
        meta: { requestId: req.requestId }
      });
    } catch (err) {
      next(err);
    }
  },

  async getCategoryBySlug(req: ExtendedRequest, res: Response, next: NextFunction) {
    try {
      const category = await CategoryRepository.findBySlug(req.params.slug);
      if (!category || !category.active) {
        return next(AppError.notFound('Category not found'));
      }
      res.status(200).json({
        data: { category },
        meta: { requestId: req.requestId }
      });
    } catch (err) {
      next(err);
    }
  },

  async getProducts(req: ExtendedRequest, res: Response, next: NextFunction) {
    try {
      const {
        category,
        brand,
        minPrice,
        maxPrice,
        rating,
        inStock,
        sort,
        page,
        limit
      } = req.query;

      const brands = brand ? (Array.isArray(brand) ? brand : [brand]) as string[] : undefined;

      const filters = {
        category: category as string,
        brand: brands,
        minPrice: minPrice ? parseInt(minPrice as string) : undefined,
        maxPrice: maxPrice ? parseInt(maxPrice as string) : undefined,
        rating: rating ? parseFloat(rating as string) : undefined,
        inStock: inStock === 'true' ? true : inStock === 'false' ? false : undefined,
        sort: sort as string,
        page: page ? parseInt(page as string) : 1,
        limit: limit ? parseInt(limit as string) : 12,
        status: 'published' as const
      };

      const result = await ProductRepository.getAll(filters);

      res.status(200).json({
        data: result.products,
        meta: {
          page: filters.page,
          limit: filters.limit,
          total: result.total,
          totalPages: result.pages,
          requestId: req.requestId
        }
      });
    } catch (err) {
      next(err);
    }
  },

  async getProductBySlug(req: ExtendedRequest, res: Response, next: NextFunction) {
    try {
      const product = await ProductRepository.findBySlug(req.params.slug);
      if (!product || product.status !== 'published') {
        return next(AppError.notFound('Product not found'));
      }
      res.status(200).json({
        data: { product },
        meta: { requestId: req.requestId }
      });
    } catch (err) {
      next(err);
    }
  },

  async searchProducts(req: ExtendedRequest, res: Response, next: NextFunction) {
    try {
      const {
        q,
        category,
        brand,
        minPrice,
        maxPrice,
        rating,
        inStock,
        sort,
        page,
        limit
      } = req.query;

      const brands = brand ? (Array.isArray(brand) ? brand : [brand]) as string[] : undefined;

      const filters = {
        search: q as string,
        category: category as string,
        brand: brands,
        minPrice: minPrice ? parseInt(minPrice as string) : undefined,
        maxPrice: maxPrice ? parseInt(maxPrice as string) : undefined,
        rating: rating ? parseFloat(rating as string) : undefined,
        inStock: inStock === 'true' ? true : inStock === 'false' ? false : undefined,
        sort: sort as string,
        page: page ? parseInt(page as string) : 1,
        limit: limit ? parseInt(limit as string) : 12,
        status: 'published' as const
      };

      const result = await ProductRepository.getAll(filters);

      res.status(200).json({
        data: result.products,
        meta: {
          page: filters.page,
          limit: filters.limit,
          total: result.total,
          totalPages: result.pages,
          requestId: req.requestId
        }
      });
    } catch (err) {
      next(err);
    }
  },

  async getProductReviews(req: ExtendedRequest, res: Response, next: NextFunction) {
    try {
      const reviews = await ReviewRepository.findByProduct(req.params.id);
      res.status(200).json({
        data: { reviews },
        meta: { requestId: req.requestId }
      });
    } catch (err) {
      next(err);
    }
  },

  async createReview(req: ExtendedRequest, res: Response, next: NextFunction) {
    try {
      const productId = req.params.id;
      const userId = req.user!.id;
      const userName = req.user!.email.split('@')[0]; // Simple fallback name
      
      const body = reviewSchema.parse(req.body);

      // Verify the product is valid
      const product = await ProductRepository.findById(productId);
      if (!product || product.status !== 'published') {
        return next(AppError.notFound('Product not found'));
      }

      // Check if user has already reviewed this product
      const existingReview = await ReviewRepository.findByProductAndUser(productId, userId);
      if (existingReview) {
        return next(AppError.conflict('You have already submitted a review for this product'));
      }

      // Verify the customer purchased and received the product
      const userOrders = await OrderRepository.findByUser(userId);
      const hasDeliveredOrder = userOrders.some(order => 
        order.id === body.orderId &&
        order.status === 'delivered' &&
        order.items.some(item => item.productId === productId)
      );

      if (!hasDeliveredOrder) {
        return next(AppError.badRequest('You can only review items that you have purchased and received.'));
      }

      const review = await ReviewRepository.create({
        productId,
        userId,
        userName,
        orderId: body.orderId,
        rating: body.rating,
        body: body.body,
        status: 'pending' // Enters moderation queue
      });

      res.status(201).json({
        data: { review },
        meta: { requestId: req.requestId }
      });
    } catch (err) {
      next(err);
    }
  },

  async editReview(req: ExtendedRequest, res: Response, next: NextFunction) {
    try {
      const reviewId = req.params.id;
      const userId = req.user!.id;

      const review = await ReviewRepository.findById(reviewId);
      if (!review || review.userId !== userId) {
        return next(AppError.notFound('Review not found or unauthorized'));
      }

      if (review.status !== 'pending') {
        return next(AppError.badRequest('Only pending reviews can be edited'));
      }

      const body = reviewSchema.parse(req.body);
      const updated = await ReviewRepository.update(reviewId, {
        rating: body.rating,
        body: body.body
      });

      res.status(200).json({
        data: { review: updated },
        meta: { requestId: req.requestId }
      });
    } catch (err) {
      next(err);
    }
  },

  async deleteReview(req: ExtendedRequest, res: Response, next: NextFunction) {
    try {
      const reviewId = req.params.id;
      const userId = req.user!.id;

      const review = await ReviewRepository.findById(reviewId);
      if (!review || review.userId !== userId) {
        return next(AppError.notFound('Review not found or unauthorized'));
      }

      await ReviewRepository.delete(reviewId);

      // If approved review was deleted, recalculate rating aggregates
      if (review.status === 'approved') {
        await recalculateProductRating(review.productId);
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

// Recalculates product average rating and reviews count from approved reviews
export const recalculateProductRating = async (productId: string) => {
  const reviews = await ReviewRepository.findByProduct(productId);
  const totalReviews = reviews.length;
  
  let averageRating = 0;
  if (totalReviews > 0) {
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    averageRating = Math.round((sum / totalReviews) * 10) / 10;
  }

  await ProductRepository.update(productId, {
    ratingSummary: { averageRating, totalReviews }
  });
};
