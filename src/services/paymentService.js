import razorpay from '../config/razorpayConfig.js';
import { RAZORPAY_PLAN_ID } from '../config/serverConfig.js';
import { findUserById } from '../repositories/userRepository.js';
import BadRequestError from '../utils/badRequestError.js';
import UnAuthorisedError from '../utils/unauthorisedError.js';

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

export { purchaseSubscription };
