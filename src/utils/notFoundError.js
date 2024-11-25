import AppError from './appError.js';

class NotFoundError extends AppError {
  constructor(resource) {
    super(resource, 404);
  }
}

export default NotFoundError;
