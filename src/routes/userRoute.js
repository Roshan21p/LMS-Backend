import { Router } from "express";
import { register, getProfile, forgotPassword, resetPassword, changePassword } from "../controllers/userController.js";
import isLoggedIn from "../middlewares/authMiddleware.js";
import upload from "../middlewares/multerMiddleware.js";

const userRouter = Router()

userRouter.post('/register', upload.single("avatar"), register);
userRouter.get('/getUserProfile', isLoggedIn, getProfile);
userRouter.post('/forgotPassword', forgotPassword);
userRouter.post("/resetPassword/:resetToken", resetPassword);
userRouter.post("/changePassword", isLoggedIn, changePassword);
export default userRouter;

