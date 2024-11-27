import jwt from 'jsonwebtoken';

import { COOKIE_SECURE, JWT_SECRET } from '../config/serverConfig.js';
import UnAuthorisedError from '../utils/unauthorisedError.js';

const isLoggedIn = async (req, res, next) => {
  const { authToken } = req.cookies;

  if (!authToken) {
    return next(new UnAuthorisedError('No auth token is provided'));
  }

  try {
    const decoded = await jwt.verify(authToken, JWT_SECRET);

    if (!decoded) {
      throw new UnAuthorisedError();
    }

    // if we reached here, then user is authenticated allow then to access the api
    req.user = decoded;

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      res.cookie('authToken', '', {
        httpOnly: true,
        secure: COOKIE_SECURE,
        sameSite: 'None',
        expires: new Date(0)
      });

      res.status(200).json({
        success: true,
        message: 'Token has expired. Please log in again.'
      });
    } else {
      return res.status(401).json({
        success: false,
        error: error,
        message: 'Invalid Token provided'
      });
    }
  }
};

const authorizeRoles =
  (...roles) =>
  async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorised for this action',
        error: {
          statusCode: 403,
          reason: 'Unauthorised user for this action'
        }
      });
    }
    next();
  };

// Middleware to check if user has an active subscription or not
const authorizeSubscribers = async (req, res, next) => {
  // If user is not admin or does not have an active subscription then error else pass
  if (req.user.role !== 'ADMIN' && req.user.subscription.status !== 'active') {
    return res.status(403).json({
      success: false,
      message: 'Please subscribe to access this route',
      error: {
        statusCode: 403,
        reason: 'Unauthorised Admin for this action'
      }
    });
  }

  next();
};

export { authorizeRoles, authorizeSubscribers, isLoggedIn };
