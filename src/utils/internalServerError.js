import AppError from './appError.js';

class InternalServerError extends AppError {
  constructor(message) {
    const error =
      message || "It's not you, it's our server where something went wrong";
    super(error, 500);
  }
}

export default InternalServerError;
