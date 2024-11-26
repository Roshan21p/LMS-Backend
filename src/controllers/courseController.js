import {
  addLectureToCourse,
  deleteLectureByCourseId,
  findAllCourses,
  listOfLecturesByCourseId,
  processCourseCreation,
  updateCourse
} from '../services/courseService.js';
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

const getAllCourses = async (req, res) => {
  try {
    const response = await findAllCourses();

    return res
      .status(201)
      .json(successResponse(response, 'Courses fetched successfully'));
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json(customErrorResponse(error));
    }

    return res.status(500).json(InternalServerError(error));
  }
};

const addLectureToCourseById = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await addLectureToCourse(req.body, req.file, id);
    return res
      .status(200)
      .json(successResponse(response, 'Course lectures added successfully'));
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json(customErrorResponse(error));
    }
    console.log('con', error);

    return res.status(500).json(InternalServerError(error));
  }
};

const getLecturesByCourseId = async (req, res) => {
  try {
    const { id } = req.params;

    const response = await listOfLecturesByCourseId(id);
    return res
      .status(200)
      .json(successResponse(response, 'Course lecture fetched successfully'));
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json(customErrorResponse(error));
    }
    return res.status(500).json(InternalServerError(error));
  }
};

const updateCourseById = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await updateCourse(req.body, id);
    return res
      .status(200)
      .json(successResponse(response, 'Course updated successfully'));
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json(customErrorResponse(error));
    }
    return res.status(500).json(InternalServerError(error));
  }
};

const removeLectureFromCourse = async (req, res) => {
  try {
    const response = await deleteLectureByCourseId(req.query);
    return res
      .status(200)
      .json(successResponse(response, 'Course lecture removed successfully'));
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json(customErrorResponse(error));
    }
    return res.status(500).json(InternalServerError(error));
  }
};
export {
  addLectureToCourseById,
  createCourse,
  getAllCourses,
  getLecturesByCourseId,
  removeLectureFromCourse,
  updateCourseById
};
