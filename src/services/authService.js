import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { JWT_EXPIRY, JWT_SECRET } from '../config/serverConfig.js';
import { findUser } from '../repositories/userRepository.js';
import NotFoundError from '../utils/notFoundError.js';
import UnAuthorisedError from '../utils/unauthorisedError.js';

const loginUser = async (payloadDetails) => {
  const email = payloadDetails.email;
  const plainPassword = payloadDetails.password;

  //1. Check if there is a registered user with the given email
  const user = await findUser({ email });

  if (!user) {
    throw new NotFoundError('Not able to find user with the given email');
  }

  //2. If the user is found we need to compare plainIncomingPassword with hashedPassword
  const isPasswordValidated = await bcrypt.compare(
    plainPassword,
    user.password
  );

  if (!isPasswordValidated) {
    throw new UnAuthorisedError();
  }

  const userRole = user.role ? user.role : 'USER';

  //3. If the password is validated, create a token and return it
  const token = jwt.sign(
    { id: user._id, role: userRole, subscription: user.subscription },
    JWT_SECRET,
    {
      expiresIn: JWT_EXPIRY
    }
  );

  return {
    token,
    userRole,
    userData: {
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName
    }
  };
};

export default loginUser;
