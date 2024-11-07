import { Router } from "express";
import { register, getProfile } from "../controllers/userController.js";
import isLoggedIn from "../middlewares/authMiddleware.js";
import upload from "../middlewares/multerMiddleware.js";

const userRouter = Router()

userRouter.post('/register', upload.single("avatar"), register);
userRouter.get('/getUserProfile', isLoggedIn, getProfile);

export default userRouter;

