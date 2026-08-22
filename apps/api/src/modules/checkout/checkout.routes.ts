import { Router } from 'express';
import { CheckoutController } from './checkout.controller';
import { authenticate } from '../../middleware/auth';

const router = Router();

// Protect all checkout and order paths
router.use(authenticate);

router.post('/checkout/quote', CheckoutController.getQuote);
router.post('/checkout/payment-order', CheckoutController.createPaymentOrder);
router.post('/checkout/verify-payment', CheckoutController.verifyPayment);

router.get('/orders', CheckoutController.getCustomerOrders);
router.get('/orders/:id', CheckoutController.getOrderDetails);
router.post('/orders/:id/cancel', CheckoutController.cancelOrder);

export default router;
