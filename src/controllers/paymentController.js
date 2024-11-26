import { RAZORPAY_KEY_ID } from '../config/serverConfig.js';
import { purchaseSubscription } from '../services/paymentService.js';
import AppError from '../utils/appError.js';
import customErrorResponse from '../utils/customErrorResponse.js';
import InternalServerError from '../utils/internalServerError.js';

const getRazorpayApiKey = async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Razorpay API Key',
    key: RAZORPAY_KEY_ID
  });
};

const buySubscription = async (req, res) => {
  console.log(req.user.id);

  try {
    const response = await purchaseSubscription(req.user.id);
    res.status(200).json({
      success: true,
      message: 'Subscribed successfully',
      subscription_id: response.subscription.id
    });
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json(customErrorResponse(error));
    }
    return res.status(500).json(InternalServerError(error));
  }
};

export { buySubscription, getRazorpayApiKey };
