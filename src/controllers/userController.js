import {
  getForgotPassword,
  getUserProfile,
  registerUser,
  setPassword,
  setPasswordByToken,
  updateUserProfile
} from '../services/userService.js';
import AppError from '../utils/appError.js';
import customErrorResponse from '../utils/customErrorResponse.js';
import InternalServerError from '../utils/internalServerError.js';
import successResponse from '../utils/successResponse.js';

const register = async (req, res) => {
  try {
    const response = await registerUser(req.body, req.file);
    return res
      .status(201)
      .json(successResponse(response, 'User registered Successfully'));
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json(customErrorResponse(error));
    }

    return res.status(500).json(new InternalServerError(error));
  }
};

const getProfile = async (req, res) => {
  try {
    const response = await getUserProfile(req.user.id);
    return res
      .status(200)
      .json(successResponse(response, 'Profile details fetched Successfully'));
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json(customErrorResponse(error));
    }

    return res.status(500).json(new InternalServerError(error));
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    await getForgotPassword(email);

    return res.status(200).json({
      success: true,
      message: `Reset password token has been sent to ${email} successfully`
    });
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json(customErrorResponse(error));
    }
    return res.status(500).json(new InternalServerError(error));
  }
};

const resetPassword = async (req, res) => {
  try {
    const { resetToken } = req.params;
    const { password } = req.body;
    await setPasswordByToken(resetToken, password);

    return res.status(200).json({
      success: true,
      message: `Password changed successfully`
    });
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json(customErrorResponse(error));
    }

    return res.status(500).json(new InternalServerError(error));
  }
};

const changePassword = async (req, res) => {
  try {
    await setPassword(req.body, req.user.id);

    return res.status(200).json({
      success: true,
      message: `Password changed successfully`
    });
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json(customErrorResponse(error));
    }

    return res.status(500).json(new InternalServerError(error));
  }
};

const updateProfile = async (req, res) => {
  try {
    const response = await updateUserProfile(req);

    return res
      .status(200)
      .json(successResponse(response, 'Profile details updated successfully'));
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json(customErrorResponse(error));
    }
    return res.status(500).json(new InternalServerError(error));
  }
};

export {
  changePassword,
  forgotPassword,
  getProfile,
  register,
  resetPassword,
  updateProfile
};
