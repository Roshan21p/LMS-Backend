import { getUserProfile, registerUser } from "../services/userService.js";
import AppError from "../utils/appError.js";

const register = async (req, res) => {
    try {
        const response = await registerUser(req.body, req.file);
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



const getProfile = async (req, res) => {
    
    try {
        const response = await getUserProfile(req.user.id);
        return res.status(200).json({
            success: true,
            message: "Profile details fetched Successfully",
            data: response,
            error: {},
        })
    } catch (error) {
       throw new AppError("Failed to fectch profile details",404);
    }
};

export {
    register,
    getProfile,
}