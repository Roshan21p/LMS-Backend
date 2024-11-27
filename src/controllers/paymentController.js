import { RAZORPAY_KEY_ID } from '../config/serverConfig.js';
import {
  checkSubscriptionStatus,
  findAllPaymentsRecord,
  processCancelSubscription,
  purchaseSubscription
} from '../services/paymentService.js';
import AppError from '../utils/appError.js';
import customErrorResponse from '../utils/customErrorResponse.js';
import InternalServerError from '../utils/internalServerError.js';

const getRazorpayApiKey = async (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Razorpay API Key',
    key: RAZORPAY_KEY_ID
  });
};

const buySubscription = async (req, res) => {
  try {
    const response = await purchaseSubscription(req.user.id);
    return res.status(200).json({
      success: true,
      message: 'Subscribed successfully',
      subscription_id: response.subscription.id
    });
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json(customErrorResponse(error));
    }
    return res.status(500).json(new InternalServerError(error));
  }
};

const verifySubscription = async (req, res) => {
  try {
    await checkSubscriptionStatus(req.body, req.user.id);
    return res.status(200).json({
      success: true,
      message: 'Payment verified successfully'
    });
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json(customErrorResponse(error));
    }
    return res.status(500).json(new InternalServerError(error));
  }
};

const getAllPayments = async (req, res) => {
  try {
    const response = await findAllPaymentsRecord(req.query);
    return res.status(200).json({
      success: true,
      message: 'Payment verified successfully',
      data: response
    });
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json(customErrorResponse(error));
    }
    return res.status(500).json(new InternalServerError(error));
  }
};

const cancelSubscription = async (req, res) => {
  try {
    await processCancelSubscription(req.user.id);
    return res.status(200).json({
      success: true,
      message: 'Subscription canceled successfully'
    });
  } catch (error) {
    console.log('controller', error);
    if (error instanceof AppError) {
      return res.status(error.statusCode).json(customErrorResponse(error));
    }
    return res.status(500).json(new InternalServerError(error));
  }
};

export {
  buySubscription,
  cancelSubscription,
  getAllPayments,
  getRazorpayApiKey,
  verifySubscription
};
