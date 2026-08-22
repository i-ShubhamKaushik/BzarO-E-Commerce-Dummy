import { Router } from 'express';
import { CartController } from './cart.controller';
import { authenticate } from '../../middleware/auth';

const router = Router();

// Protect all cart and wishlist routes
router.use(authenticate);

router.get('/', CartController.getCart);
router.put('/', CartController.updateCart);
router.post('/items', CartController.addToCart);
router.delete('/items', CartController.removeFromCart);
router.post('/coupon', CartController.applyCoupon);
router.delete('/coupon', CartController.removeCoupon);

// Wishlist routes
router.get('/wishlist', CartController.getWishlist);
router.post('/wishlist/:productId', CartController.addToWishlist);
router.delete('/wishlist/:productId', CartController.removeFromWishlist);

export default router;
