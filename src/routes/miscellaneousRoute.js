import { Router } from 'express';

import contactUs from '../controllers/miscellaneousController.js';

const miscRouter = Router();

miscRouter.post('/contact', contactUs);

export default miscRouter;
