import RazorPay from 'razorpay';

import { RAZORPAY_KEY_ID, RAZORPAY_SECRET } from './serverConfig.js';

const razorpay = new RazorPay({
  key_id: RAZORPAY_KEY_ID,
  key_secret: RAZORPAY_SECRET
});

export default razorpay;
