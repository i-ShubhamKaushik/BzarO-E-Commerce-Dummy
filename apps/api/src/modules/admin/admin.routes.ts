import { Router } from 'express';
import { AdminController } from './admin.controller';
import { authenticate, authorize } from '../../middleware/auth';

const router = Router();

// Protect all admin endpoints
router.use(authenticate, authorize('admin'));

// Dashboard route
router.get('/dashboard', AdminController.getDashboard);

// Users operations
router.get('/users', AdminController.getUsers);
router.get('/users/:id', AdminController.getUserDetails);
router.patch('/users/:id/status', AdminController.updateUserStatus);
router.patch('/users/:id/role', AdminController.updateUserRole);

// Products operations
router.post('/products', AdminController.createProduct);
router.patch('/products/:id', AdminController.updateProduct);
router.delete('/products/:id', AdminController.deleteProduct);

// Categories operations
router.post('/categories', AdminController.createCategory);
router.patch('/categories/:id', AdminController.updateCategory);
router.delete('/categories/:id', AdminController.deleteCategory);

// Orders operations
router.get('/orders', AdminController.getOrders);
router.get('/orders/:id', AdminController.getOrderDetails);
router.patch('/orders/:id', AdminController.updateOrderStatus);

// Reviews operations
router.get('/reviews', AdminController.getReviews);
router.patch('/reviews/:id', AdminController.moderateReview);

// Coupons operations
router.get('/coupons', AdminController.getCoupons);
router.post('/coupons', AdminController.createCoupon);
router.patch('/coupons/:id', AdminController.updateCoupon);
router.delete('/coupons/:id', AdminController.deleteCoupon);

// Inventory adjustments
router.post('/inventory/adjustments', AdminController.adjustInventory);

// Audit logs
router.get('/audit-logs', AdminController.getAuditLogs);

// Analytics
router.get('/analytics', AdminController.getAnalytics);

export default router;
