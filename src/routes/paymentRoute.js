import { Router } from 'express';

import {
  buySubscription,
  getAllPayments,
  getRazorpayApiKey,
  verifySubscription
} from '../controllers/paymentController.js';
import { authorizeRoles, isLoggedIn } from '../middlewares/authMiddleware.js';

const paymentRouter = Router();

paymentRouter.get('/razorpay-key', isLoggedIn, getRazorpayApiKey);
paymentRouter.post('/subscribe', isLoggedIn, buySubscription);
paymentRouter.post('/verify', isLoggedIn, verifySubscription);
paymentRouter.get('/', isLoggedIn, authorizeRoles('ADMIN'), getAllPayments);

export default paymentRouter;
