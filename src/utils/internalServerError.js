import AppError from './appError.js';

class InternalServerError extends AppError {
  constructor(error) {
    const message =
      error.message ||
      "It's not you, it's our server where something went wrong";
    super(message, 500);
  }
}

export default InternalServerError;
