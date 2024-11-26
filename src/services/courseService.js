import fs from 'fs/promises';
import path from 'path';

import cloudinary from '../config/cloudinaryConfig.js';
import Course from '../models/courseModel.js';
import {
  findCourseAndUpdate,
  findCourseWithCourseId,
  saveCourse
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
        folder: 'lms/courses'
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

  let lectureData = {};

  if (!title || !description) {
    throw new BadRequestError('Both title and description are required');
  }

  const course = await findCourseWithCourseId(courseId);

  if (!course) {
    throw new NotFoundError(
      'Course not found. Please check the course ID and try again.'
    );
  }

  if (lectureVideo) {
    try {
      const result = await cloudinary.v2.uploader.upload(lectureVideo?.path, {
        folder: 'lms/courses',
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

const listOfLecturesByCourseId = async (courseId) => {
  const course = await findCourseWithCourseId(courseId);

  if (!course) {
    throw new NotFoundError('Invalid course id or course not found.');
  }

  return course.lectures;
};

const updateCourse = async (courseData, courseId) => {
  const course = await findCourseAndUpdate(courseData, courseId);

  if (!course) {
    throw new NotFoundError('Invalid course id or course not found.');
  }

  return course;
};

const deleteLectureByCourseId = async (courseDetails) => {
  const { courseId, lectureId } = courseDetails;

  if (!courseId) {
    throw new BadRequestError('Course ID is required');
  }

  if (!lectureId) {
    throw new BadRequestError('lecture ID is required');
  }

  const course = await findCourseWithCourseId(courseId);

  if (!course) {
    throw new NotFoundError('Invalid course Id or Course does not exist.');
  }

  // If course exist then find the index of the lecture using the lectureId
  const lectureIndex = course.lectures.findIndex(
    (lecture) => lecture._id.toString() === lectureId.toString()
  );

  // If lectureIndex is -1 then send error message
  if (lectureIndex === -1) {
    throw new NotFoundError('Lecture does not exist.');
  }

  // Delete the lecture from cloudinary
  await cloudinary.v2.uploader.destroy(
    course.lectures[lectureIndex].lecture.public_id,
    {
      resource_type: 'video'
    }
  );

  // Remove the lecture from the array
  course.lectures.splice(lectureIndex, 1);

  // update the number of lectures based on lectures array length
  course.numberOfLectures = course.lectures.length;

  // Save the course object
  await course.save();

  return course;
};

const deleteCourse = async (courseId) => {
  const course = await findCourseWithCourseId(courseId);

  if (!course) {
    throw new NotFoundError('Invalid course id or course not found.');
  }

  try {
    // Delete the course thumbnail from Cloudinary
    if (course.thumbnail?.public_id) {
      await cloudinary.v2.uploader.destroy(course.thumbnail.public_id);
    }

    if (course.lectures && course.lectures.length > 0) {
      for (const lecture of course.lectures) {
        if (lecture?.lecture?.public_id) {
          await cloudinary.v2.uploader.destroy(lecture.lecture.public_id, {
            resource_type: 'video'
          });
        }
      }
    }
  } catch (error) {
    console.log(error);
    throw new InternalServerError('Failed to delete course assets');
  }

  await course.deleteOne();

  return course;
};

export {
  addLectureToCourse,
  deleteCourse,
  deleteLectureByCourseId,
  findAllCourses,
  listOfLecturesByCourseId,
  processCourseCreation,
  updateCourse
};
