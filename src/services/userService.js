import User from "../models/userModel.js";
import { checkPasswordToken, createUser, findUser, getUserProfileById } from "../repositories/userRepository.js"
import AppError from "../utils/appError.js";
import BadRequestError from "../utils/badRequestError.js";
import InternalServerError from "../utils/internalServerError.js";
import NotFoundError from "../utils/notFoundError.js";
import cloudinary from "cloudinary";
import fs from "fs/promises";
import sendEmail from "../utils/sendEmail.js";
import crypto from "crypto";


const registerUser = async (userDetails, image) => {
    console.log("UserDetails", userDetails);
    

    const imagePath = image;
    if(imagePath){        
        try {
            const cloudinaryResponse = await cloudinary.v2.uploader.upload(imagePath?.path, {
                folder: 'lms', // Save files in a folder named lms
                width: 250,
                height: 250,
                gravity: 'faces', // This option tells cloudinary to center the image around detected faces (if any) after cropping or resizing the original image
                crop: 'fill',
            });

            if(cloudinaryResponse){
                var public_id = cloudinaryResponse.public_id;
                var secure_url = cloudinaryResponse.secure_url;

                // Remove file from server
                await fs.rm(`uploads/${imagePath.filename}`)
            }
        } catch (error) {
            throw new InternalServerError();
        }
    }


    // 1. we need to check if the user with this email already exists or not
    const user = await findUser({
        email: userDetails.email,
    });

    if(user){
        // we found a user
        throw new AppError('Email already exists', 409);
    }

    //2.If not then create the user in the database
    const newUser = await createUser({
        firstName: userDetails.firstName,
        lastName: userDetails.lastName,
        email: userDetails.email,
        password: userDetails.password,
        avatar : {
            public_id: public_id,
            secure_url: secure_url,
        }
    });

    if(!newUser){
        throw new BadRequestError('Something went wrong, cannot create user');
    }

    
    // Setting the password to undefined so it does not get sent in the response
    newUser.password = undefined;
    
    //3.return the details of created user
     return newUser;
}

const getUserProfile = async (userId) => {
    const response = await getUserProfileById(userId);    
    if(!response) {
        throw new NotFoundError('User profile details');
    }
    return response;
}

const getForgotPassword = async (email) => {
    if(!email){
        throw new BadRequestError('email is required');
    }

    const user = await User.findOne({ email });    

    if(!user){
        throw new BadRequestError('email is not registered'); 
    }

    // Generating the reset token via the method we have in user model
    const resetToken = await user.generatePasswordResetToken();    

    const resetPasswordUrl = `${process.env.FRONTEND_URL}/resetPassword/${resetToken}`;
    
    const subject = 'Reset Password';
    const message = `You can reset your password by clicking <a href=${resetPasswordUrl} target="_blank">Reset your password</a>\nIf the above link does not work for some reason then copy paste this link in new tab ${resetPasswordUrl}.\n If you have not requested this, kindly ignore.`;

    try {
        await sendEmail(email, subject, message);        
    } catch (error) {
         // If some error happened we need to clear the forgotPassword* fields in our DB         
        user.forgotPasswordToken = undefined;
        user.forgotPasswordExpiry = undefined;
        throw new InternalServerError();
    }
    await user.save();
}

const setResetPassword = async (resetToken, newPassword) => {
    
    if(!newPassword){
        throw new BadRequestError("Password is required")
    }
    // We are again hashing the resetToken using sha256 since we have stored our resetToken in DB using the same algorithm
    const forgotPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

    console.log("resetToken for", forgotPasswordToken);

    const user = await checkPasswordToken(forgotPasswordToken);    

    if(!user){        
        throw new BadRequestError('Token is invalid or expired, please try again');
    }

    user.password = newPassword;

    // making forgotPassword* valus undefined in the DB
    user.forgotPasswordExpiry = undefined;
    user.forgotPasswordToken = undefined;

   // Saving the updated user values
   await user.save();
}

export {
    registerUser,
    getUserProfile,
    getForgotPassword,
    setResetPassword,
}