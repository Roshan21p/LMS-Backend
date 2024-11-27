import {
  getContactInfo,
  getUserStats
} from '../services/miscellaneousService.js';
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
    if (error instanceof AppError) {
      return res.status(error.statusCode).json(customErrorResponse(error));
    }
    return res.status(500).json(new InternalServerError(error));
  }
};

const userStats = async (req, res) => {
  try {
    const response = await getUserStats();
    return res.status(200).json({
      success: true,
      message: 'All registered users count',
      data: response
    });
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json(customErrorResponse(error));
    }
    return res.status(500).json(new InternalServerError(error));
  }
};

export { contactUs, userStats };
