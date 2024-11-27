import { getContactInfo } from '../services/miscellaneousService.js';
import AppError from '../utils/appError.js';
import customErrorResponse from '../utils/customErrorResponse.js';
import InternalServerError from '../utils/internalServerError.js';

const contactUs = async (req, res) => {
  try {
    await getContactInfo(req.body);
    return res.status(200).json({
      success: true,
      message: 'Your request has been submitted successfully'
    });
  } catch (error) {
    console.log('controller', error);
    if (error instanceof AppError) {
      return res.status(error.statusCode).json(customErrorResponse(error));
    }
    return res.status(500).json(new InternalServerError(error));
  }
};

export default contactUs;
