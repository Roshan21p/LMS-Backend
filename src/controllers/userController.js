import { registerUser } from "../services/userService.js";
import AppError from "../utils/appError.js";

const register = async (req, res) => {
    try {
        const response = await registerUser(req.body);
        return res.status(201).json({
            success: true,
            message: "User registered Successfully",
            data: response,
            error: {},
        })
    } catch (error) {
        if(error instanceof AppError){
            return  res.status(error.statusCode).json({
                success: false,
                message: error.message,
                data: {},
                error: error,
            });
        }
        return res.status(error.statusCode).json({
            success: false,
            message: error.message,
            data: {},
            error: error,

        })
    }
};



export {
    register,

}