import Course from '../models/courseModel.js';
import BadRequestError from '../utils/badRequestError.js';
import InternalServerError from '../utils/internalServerError.js';

const saveCourse = async (courseData) => {
  try {
    const response = await Course.create(courseData);
    return response;
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errorMessageList = Object.keys(error.errors).map((property) => {
        return error.errors[property].message;
      });
      console.log(errorMessageList);
      throw new BadRequestError(errorMessageList);
    }
    throw new InternalServerError();
  }
};

const findCourseWithCourseId = async (courseId) => {
  try {
    const response = await Course.findById(courseId);
    return response;
  } catch (error) {
    console.log(error);
    throw new InternalServerError(error);
  }
};

const findCourseAndUpdate = async (courseData, courseId) => {
  try {
    const response = await Course.findByIdAndUpdate(
      courseId,
      {
        $set: courseData
      },
      {
        runValidators: true,
        new: true
      }
    );
    return response;
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errorMessageList = Object.keys(error.errors).map((property) => {
        return error.errors[property].message;
      });
      console.log(errorMessageList);
      throw new BadRequestError(errorMessageList);
    }
    throw new InternalServerError();
  }
};

export { findCourseAndUpdate, findCourseWithCourseId, saveCourse };
