import { Router } from 'express';
import { CatalogueController } from './catalogue.controller';
import { authenticate } from '../../middleware/auth';

const router = Router();

// Public catalogue routes
router.get('/promotions', CatalogueController.getPromotions);
router.get('/categories', CatalogueController.getCategories);
router.get('/categories/:slug', CatalogueController.getCategoryBySlug);
router.get('/products', CatalogueController.getProducts);
router.get('/products/:slug', CatalogueController.getProductBySlug);
router.get('/search', CatalogueController.searchProducts);
router.get('/products/:id/reviews', CatalogueController.getProductReviews);

// Protected review write/edit/delete routes
router.post('/products/:id/reviews', authenticate, CatalogueController.createReview);
router.patch('/reviews/:id', authenticate, CatalogueController.editReview);
router.delete('/reviews/:id', authenticate, CatalogueController.deleteReview);

export default router;
