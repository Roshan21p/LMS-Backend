import { Router } from 'express';

import {
  buySubscription,
  cancelSubscription,
  getAllPayments,
  getRazorpayApiKey,
  verifySubscription
} from '../controllers/paymentController.js';
import {
  authorizeRoles,
  authorizeSubscribers,
  isLoggedIn
} from '../middlewares/authMiddleware.js';

const paymentRouter = Router();

paymentRouter.get('/razorpay-key', isLoggedIn, getRazorpayApiKey);
paymentRouter.post('/subscribe', isLoggedIn, buySubscription);
paymentRouter.post('/verify', isLoggedIn, verifySubscription);
paymentRouter.get('/', isLoggedIn, authorizeRoles('ADMIN'), getAllPayments);
paymentRouter.post(
  '/unsubscribe',
  isLoggedIn,
  authorizeSubscribers,
  cancelSubscription
);

export default paymentRouter;
