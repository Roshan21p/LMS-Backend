import { Router } from 'express';

import {
  buySubscription,
  getRazorpayApiKey
} from '../controllers/paymentController.js';
import { isLoggedIn } from '../middlewares/authMiddleware.js';

const paymentRouter = Router();

paymentRouter.get('/razorpay-key', isLoggedIn, getRazorpayApiKey);
paymentRouter.post('/subscribe', isLoggedIn, buySubscription);

export default paymentRouter;
