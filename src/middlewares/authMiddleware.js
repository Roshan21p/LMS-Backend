import jwt from 'jsonwebtoken';

import UnAuthorisedError from '../utils/unauthorisedError.js';

const isLoggedIn = async (req, res, next) => {
  const { authToken } = req.cookies;

  if (!authToken) {
    return next(new UnAuthorisedError('No auth token is provided'));
  }

  try {
    const decoded = await jwt.verify(authToken, process.env.JWT_SECRET);

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
        secure: process.env.COOKIE_SECURE,
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

export { authorizeRoles, isLoggedIn };
