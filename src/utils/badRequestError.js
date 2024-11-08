import AppError from "./appError.js";

class BadRequestError extends AppError {
    constructor(invalidParams){
        // invalidParams: []

        if (!Array.isArray(invalidParams)) {
            invalidParams = [invalidParams];
        }
        
        let message = "";
        invalidParams.forEach(params => message += `${params}\n`);

        super(`The request has the following invalid parameters \n ${invalidParams}`, 400);

    }
}

export default BadRequestError;