import { RAZORPAY_KEY_ID } from '../config/serverConfig.js';

const getRazorpayApiKey = async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Razorpay API Key',
    key: RAZORPAY_KEY_ID
  });
};

export { getRazorpayApiKey };
