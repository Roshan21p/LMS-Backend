import { Router } from "express";
import { register, getProfile } from "../controllers/userController.js";
import isLoggedIn from "../middlewares/authMiddleware.js";

const userRouter = Router()

userRouter.post('/register', register);
userRouter.get('/getUserProfile', isLoggedIn, getProfile);

export default userRouter;

