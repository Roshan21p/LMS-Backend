import { Router } from 'express';

import {
  addLectureToCourseById,
  createCourse,
  getAllCourses,
  getLecturesByCourseId
} from '../controllers/courseController.js';
import { authorizeRoles, isLoggedIn } from '../middlewares/authMiddleware.js';
import upload from '../middlewares/multerMiddleware.js';

const courseRouter = Router();

courseRouter
  .route('/')
  .post(
    isLoggedIn,
    authorizeRoles('ADMIN'),
    upload.single('thumbnail'),
    createCourse
  )
  .get(getAllCourses);

courseRouter
  .route('/:id')
  .get(isLoggedIn, getLecturesByCourseId)
  .post(
    isLoggedIn,
    authorizeRoles('ADMIN'),
    upload.single('lecture'),
    addLectureToCourseById
  );

export default courseRouter;
