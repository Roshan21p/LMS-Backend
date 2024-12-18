import { COOKIE_SECURE } from '../config/serverConfig.js';
import loginUser from '../services/authService.js';
import AppError from '../utils/appError.js';
import customErrorResponse from '../utils/customErrorResponse.js';
import InternalServerError from '../utils/internalServerError.js';

const login = async (req, res) => {
  try {
    const response = await loginUser(req.body);    

    res.cookie('authToken', response.token, {
      httpOnly: true,
      secure: COOKIE_SECURE,
      sameSite: 'None',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    response.token = undefined,
    res.status(200).json({
      success: true,
      message: 'Logged in Successfully',
      data: response,
      error: {}
    });
  } catch (error) {
    if (error instanceof AppError) {      
      return res.status(error.statusCode).json(customErrorResponse(error));
    }
    return res.status(500).json(new InternalServerError(error.message));
  }
};

const logout = (req, res) => {
  res.cookie('authToken', '', {
    httpOnly: true,
    secure: COOKIE_SECURE,
    sameSite: 'None',
    maxAge: new Date(0),
  });

  res.status(200).json({
    success: true,
    message: 'Logout Successfully',
    data: {},
    error: {}
  });
};

export { login, logout };
