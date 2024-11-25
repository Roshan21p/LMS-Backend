import { processCourseCreation } from '../services/courseService.js';
import AppError from '../utils/appError.js';
import customErrorResponse from '../utils/customErrorResponse.js';
import InternalServerError from '../utils/internalServerError.js';
import successResponse from '../utils/successResponse.js';

const createCourse = async (req, res) => {
  try {
    const response = await processCourseCreation(req.body, req.file);

    return res
      .status(201)
      .json(successResponse(response, 'Course created successfully'));
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json(customErrorResponse(error));
    }

    return res.status(500).json(InternalServerError(error));
  }
};

export { createCourse };
