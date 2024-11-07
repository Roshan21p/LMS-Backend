import { createUser, findUser, getUserProfileById } from "../repositories/userRepository.js"
import AppError from "../utils/appError.js";
import BadRequestError from "../utils/badRequestError.js";
import InternalServerError from "../utils/internalServerError.js";
import NotFoundError from "../utils/notFoundError.js";
import cloudinary from "cloudinary";
import fs from "fs/promises";


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

export {
    registerUser,
    getUserProfile,
}