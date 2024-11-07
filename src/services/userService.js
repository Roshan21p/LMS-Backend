import { createUser, findUser } from "../repositories/userRepository.js"
import AppError from "../utils/appError.js";
import BadRequestError from "../utils/badRequestError.js";

const registerUser = async (userDetails) => {

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
            public_id: userDetails.email,
            secure_url: 'https://res.cloudinary.com/du9jzqlpt/image/upload/v1674647316/avatar_drzgxv.jpg',
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

export {
    registerUser,
}