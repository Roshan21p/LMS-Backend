import { Router } from 'express';

import {
  contactUs,
  userStats
} from '../controllers/miscellaneousController.js';
import { authorizeRoles, isLoggedIn } from '../middlewares/authMiddleware.js';

const miscRouter = Router();

miscRouter.post('/contact', contactUs);
miscRouter.get(
  '/admin/stats/users',
  isLoggedIn,
  authorizeRoles('ADMIN'),
  userStats
);

export default miscRouter;
