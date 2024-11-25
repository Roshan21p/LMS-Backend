import { Router } from 'express';

import {
  createCourse,
  getAllCourses
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

export default courseRouter;
