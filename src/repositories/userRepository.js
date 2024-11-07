import User from "../models/userModel.js"
import BadRequestError from "../utils/badRequestError.js";
import InternalServerError from "../utils/internalServerError.js";

const createUser = async (userDetails) => {
    try {
        const response = await User.create(userDetails);
        return response;
    } catch (error) {
        if(error.name === 'ValidationError') {

            const errorMessageList = Object.keys(error.errors).map((property) => {
                return error.errors[property].message;
            });
            console.log(errorMessageList)
            throw new BadRequestError(errorMessageList);
        } 
        throw new InternalServerError(); 
    }
};

const findUser = async (parameters) => {
    try {
        const response = await User.findOne({...parameters});
        return response;
    } catch (error) {
        console.log(error);
        throw new InternalServerError(); 
    }
}

export {
    createUser,
    findUser,
}