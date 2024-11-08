import loginUser from "../services/authService.js";

const login = async (req, res) => {
    try {
        const response = await loginUser(req.body);

        res.cookie("authToken", response.token, {
            httpOnly: true,
            secure: process.env.COOKIE_SECURE,
            sameSite: "None",
            maxAge: 7 * 24* 60 *60 * 1000,            
        })

        res.status(200).json({
        success: true,
        message: "Logged in Successfully",
        data: {
            userRole : response.userRole,
            userData: response.userData,
        },
        error: {}
        })
    } catch (error) {
        res.status(error.statusCode).json({
            success: false,
            message: error.message,
            error: error,
            data: {},
        });
    }
};

const logout = (req, res) => {

    res.cookie("authToken", "", {
        httpOnly: true,
        secure: process.env.COOKIE_SECURE, 
        sameSite: "None",
         maxAge: Date.now() + 24 * 60 * 60 * 1000
    });

    res.status(200).json({
    success: true,
    message: "Logout Successfully",
    data: {},
    error: {}
    })
};

export {
    login,
    logout,
}