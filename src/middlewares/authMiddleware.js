import UnAuthorisedError from "../utils/unauthorisedError.js";
import jwt from "jsonwebtoken";


const isLoggedIn = async (req, res, next) => {

    const { authToken } = req.cookies;

    if(!authToken){
        return next (new UnAuthorisedError());
    }


    const userDetails = await jwt.verify(authToken, process.env.JWT_SECRET);

    req.user = userDetails;

    next();
}

export default isLoggedIn;