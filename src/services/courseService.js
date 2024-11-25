import cloudinary from 'cloudinary';
import fs from 'fs/promises';
import path from 'path';

import Course from '../models/courseModel.js';
import {
  saveCourse,
  updateCourseWithLectureId
} from '../repositories/courseRepository.js';
import BadRequestError from '../utils/badRequestError.js';
import InternalServerError from '../utils/internalServerError.js';
import NotFoundError from '../utils/notFoundError.js';

const processCourseCreation = async (courseData, image) => {
  const course = await saveCourse({
    title: courseData.title,
    description: courseData.description,
    category: courseData.category,
    createdBy: courseData.createdBy
  });

  if (!course) {
    throw new BadRequestError('Course could not be created, please try again');
  }

  if (image) {
    try {
      const result = await cloudinary.v2.uploader.upload(image?.path, {
        folder: 'lms'
      });

      if (result) {
        course.thumbnail.public_id = result.public_id;
        course.thumbnail.secure_url = result.secure_url;
      }

      // After successful upload remove the file from local storage
      fs.rm(`uploads/${image.filename}`);
    } catch (error) {
      console.log(error);

      // Empty the uploads directory without deleting the uploads directory
      for (const file of await fs.readdir('uploads/')) {
        await fs.unlink(path.join('uploads/', file));
      }
      throw new InternalServerError('Image is not uploaded, please try again');
    }
  }

  await course.save();

  return course;
};

const findAllCourses = async () => {
  const courses = Course.find({}).select('-lectures');

  if (!courses) {
    NotFoundError('Not able to find courses');
  }

  return courses;
};

const addLectureToCourse = async (lectureDetails, lectureVideo, courseId) => {
  const { title, description } = lectureDetails;
  console.log(lectureVideo);

  let lectureData = {};

  if (!title || !description) {
    throw new BadRequestError('Both title and description are required');
  }

  const course = await updateCourseWithLectureId(courseId);

  if (!course) {
    throw new NotFoundError(
      'Course not found. Please check the course ID and try again.'
    );
  }

  if (lectureVideo) {
    try {
      const result = await cloudinary.v2.uploader.upload(lectureVideo?.path, {
        folder: 'lms',
        chunk_size: 52428800, // 50 mb size
        resource_type: 'video'
      });

      if (result) {
        lectureData.public_id = result.public_id;
        lectureData.secure_url = result.secure_url;
      }

      // After successful upload remove the file from local storage
      fs.rm(`uploads/${lectureVideo.filename}`);
    } catch (error) {
      console.log(error);
      // Empty the uploads directory without deleting the uploads directory
      for (const file of await fs.readdir('uploads/')) {
        await fs.unlink(path.join('uploads/', file));
      }
      throw new InternalServerError('File not uploaded, please try again');
    }
  }

  course.lectures.push({ title, description, lecture: lectureData });

  course.numberOfLectures = course.lectures.length;

  await course.save();

  return course;
};

export { addLectureToCourse, findAllCourses, processCourseCreation };
