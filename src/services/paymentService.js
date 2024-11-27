import razorpay from '../config/razorpayConfig.js';
import { RAZORPAY_PLAN_ID, RAZORPAY_SECRET } from '../config/serverConfig.js';
import Payment from '../models/paymentModel.js';
import { findUserById } from '../repositories/userRepository.js';
import BadRequestError from '../utils/badRequestError.js';
import UnAuthorisedError from '../utils/unauthorisedError.js';
import crypto from 'crypto';

const purchaseSubscription = async (userId) => {
  const user = await findUserById(userId);

  if (!user) {
    throw new UnAuthorisedError();
  }

  if (user.role === 'ADMIN') {
    throw new BadRequestError('Admin cannot purchase a subscription');
  }

  // Creating a subscription using razorpay that we imported from the razorpayConfig
  const subscription = await razorpay.subscriptions.create({
    plan_id: RAZORPAY_PLAN_ID, // The unique plan ID
    customer_notify: 1, // 1 means razorpay will handle notifying the customer, 0 means we will not notify the customer
    total_count: 12 // 12 means it will charge every month for a 1-year sub.
  });

  user.subscription.id = subscription.id;
  user.subscription.status = subscription.status;

  await user.save();

  return user;
};

const checkSubscriptionStatus = async (payloadDetails, userId) => {
  const { razorpay_payment_id, razorpay_subscription_id, razorpay_signature } =
    payloadDetails;

  const user = await findUserById(userId);

  if (!user) {
    throw new UnAuthorisedError();
  }

  // Getting the subscription Id from the user object
  const subscription_id = user.subscription.id;

  // Generating a signature with SHA256 for verification purposes
  // Here the subscriptionId should be the one which we saved in the DB
  // razorpay_payment_id is from the frontend and there should be a '|' character between this and subscriptionId
  // At the end convert it to Hex value
  const generatedSignature = crypto
    .createHmac('sha256', RAZORPAY_SECRET)
    .update(`${razorpay_payment_id}|${subscription_id}`)
    .digest('hex');

  // Check if generated signature and signature received from the frontend is the same or not
  if (generatedSignature !== razorpay_signature) {
    throw new BadRequestError('Payment not verified, please try again.');
  }

  // If they match create payment and store it in the DB
  await Payment.create({
    razorpay_payment_id: razorpay_payment_id,
    razorpay_subscription_id: razorpay_subscription_id,
    razorpay_signature: razorpay_signature
  });

  // Update the user subscription status to active
  user.subscription.status = 'active';

  // Save the user in the DB with any changes
  await user.save();
};

export { purchaseSubscription, checkSubscriptionStatus };
