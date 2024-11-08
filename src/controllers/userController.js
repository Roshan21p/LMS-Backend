import { getForgotPassword, getUserProfile, registerUser, setResetPassword } from "../services/userService.js";
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
        const statusCode = error.statusCode || 500;
        return res.status(statusCode).json({
            success: false,
            message: error.message,
            error: error,
        });
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
        const statusCode = error.statusCode || 500;
        return res.status(statusCode).json({
            success: false,
            message: error.message,
            data: {},
            error: error,
        });
    }
};

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

       await getForgotPassword(email);

        return res.status(200).json({
            success: true,
            message: `Reset password token has been sent to ${email} successfully`,
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
         const statusCode = error.statusCode || 500;
        return res.status(statusCode).json({
            success: false,
            message: error.message,
            data: {},
            error: error,

        });
    }
}

const resetPassword = async (req, res) => {
      try {
        const { resetToken } = req.params;
        const { password } = req.body
        await setResetPassword(resetToken, password);

        return res.status(200).json({
            success: true,
            message: `Password changed successfully`,
        })
      } catch (error) {
        console.log(error);

        if(error instanceof AppError){
            return  res.status(error.statusCode).json({
                success: false,
                message: error.message,
                data: {},
                error: error,
            });
        }
         const statusCode = error.statusCode || 500;
        return res.status(statusCode).json({
            success: false,
            message: error.message,
            data: {},
            error: error,

        });
      }  
}

export {
    register,
    getProfile,
    forgotPassword,
    resetPassword,
}