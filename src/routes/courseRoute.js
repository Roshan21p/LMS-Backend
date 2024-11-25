import { Router } from 'express';

import { createCourse } from '../controllers/courseController.js';
import isLoggedIn from '../middlewares/authMiddleware.js';
import upload from '../middlewares/multerMiddleware.js';

const courseRouter = Router();

courseRouter
  .route('/')
  .post(isLoggedIn, upload.single('thumbnail'), createCourse);

export default courseRouter;
