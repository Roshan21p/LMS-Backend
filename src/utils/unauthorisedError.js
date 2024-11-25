import AppError from './appError.js';

class UnAuthorisedError extends AppError {
  constructor(message) {
    super(message || 'User is not authorised properly', 401);
  }
}

export default UnAuthorisedError;
