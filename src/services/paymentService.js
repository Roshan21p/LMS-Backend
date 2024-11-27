import crypto from 'crypto';

import razorpay from '../config/razorpayConfig.js';
import { RAZORPAY_PLAN_ID, RAZORPAY_SECRET } from '../config/serverConfig.js';
import Payment from '../models/paymentModel.js';
import { findUserById } from '../repositories/userRepository.js';
import AppError from '../utils/appError.js';
import BadRequestError from '../utils/badRequestError.js';
import InternalServerError from '../utils/internalServerError.js';
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

const findAllPaymentsRecord = async (payloadDetails) => {
  const { count, skip } = payloadDetails;

  let allPayments;
  try {
    allPayments = await razorpay.subscriptions.all({
      count: count ? count : 10, // If count is sent then use that else default to 10
      skip: skip ? skip : 0 // If skip is sent then use that else default to 0
    });
  } catch (error) {
    throw new InternalServerError(error.message);
  }

  // Initialize Month Data
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ];

  // finalMonths store the count of payments for each month, initialized to 0
  const finalMonths = {
    January: 0,
    February: 0,
    March: 0,
    April: 0,
    May: 0,
    June: 0,
    July: 0,
    August: 0,
    September: 0,
    October: 0,
    November: 0,
    December: 0
  };

  const monthlyWisePayments = allPayments.items
    .filter((payment) => payment.status !== 'null' && payment.start_at)
    .map((payment) => {
      // We are using payment.start_at which is in unix time, so we are converting it to Human readable format using Date()
      const monthsInNumbers = new Date(payment.start_at * 1000);

      return monthNames[monthsInNumbers.getMonth()];
    });

  monthlyWisePayments.map((month) => {
    Object.keys(finalMonths).forEach((objMonth) => {
      if (month === objMonth) {
        finalMonths[month] += 1;
      }
    });
  });

  const monthlySalesRecord = [];

  Object.keys(finalMonths).forEach((monthName) => {
    monthlySalesRecord.push(finalMonths[monthName]);
  });

  return {
    allPayments,
    finalMonths,
    monthlySalesRecord
  };
};

const processCancelSubscription = async (userId) => {
  const user = await findUserById(userId);

  if (!user) {
    throw new UnAuthorisedError();
  }

  if (user.role === 'ADMIN') {
    throw new BadRequestError('Admin cannot cancel subscription');
  }

  const subscription_id = user.subscription.id;

  // Creating a subscription using razorpay that we imported from the razorpayConfig
  try {
    const subscription = await razorpay.subscriptions.cancel(
      subscription_id // subscription id
    );

    // Adding the subscription status to the user account
    user.subscription.status = subscription.status;

    // Saving the user object
    await user.save();
  } catch (error) {
    // Returning error if any, and this error is from razorpay so we have statusCode and message built in
    const statusCode = error.statusCode || 500;
    throw new AppError(error, statusCode);
  }

  // Finding the payment using the subscription ID
  const payment = await Payment.findOne({
    razorpay_subscription_id: subscription_id
  });

  // Getting the time from the date of successful payment (in milliseconds)
  const timeSinceSubscribed = Date.now() - payment.createdAt;

  // refund period which in our case is 14 days
  const refundPeriod = 14 * 24 * 60 * 60 * 1000;

  if (refundPeriod <= timeSinceSubscribed) {
    throw new BadRequestError(
      'Refund period is over, so there will not be any refumds provided.'
    );
  }

  try {
    // Process the refund via Razorpay
    await razorpay.payments.refund(payment.razorpay_payment_id, {
      speed: 'optimum' // This is required
    });
  } catch (error) {
    // Handle Razorpay errors during the refund process
    const statusCode = error.statusCode || 500;
    throw new AppError(error, statusCode);
  }

  user.subscription.id = undefined; // Remove the subscription ID from user DB
  user.subscription.status = undefined; // Change the subscription Status in user DB

  await user.save();
  await payment.deleteOne();
};
export {
  checkSubscriptionStatus,
  findAllPaymentsRecord,
  processCancelSubscription,
  purchaseSubscription
};
