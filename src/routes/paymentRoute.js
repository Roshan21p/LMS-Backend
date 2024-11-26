import { Router } from 'express';

import { getRazorpayApiKey } from '../controllers/paymentController.js';
import { isLoggedIn } from '../middlewares/authMiddleware.js';

const paymentRouter = Router();

paymentRouter.get('/razorpay-key', isLoggedIn, getRazorpayApiKey);

export default paymentRouter;
