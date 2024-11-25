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
    // console.log(error);

    if (error.name === 'TokenExpiredError') {
      res.cookie('authToken', '', {
        httpOnly: true,
        secure: process.env.COOKIE_SECURE,
        sameSite: 'None',
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      });

      res.status(200).json({
        success: true,
        message: 'Log out Successfully'
      });
    }

    return res.status(401).json({
      succes: false,
      error: error,
      message: 'Invalid Token provided'
    });
  }
};

export default isLoggedIn;
