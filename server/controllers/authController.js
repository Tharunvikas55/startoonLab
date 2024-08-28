const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/User');
const { jwtAccessTokenSecret, jwtRefreshTokenSecret, accessTokenExpiry, refreshTokenExpiry } = require('../config/auth');

// Login Function
// const login = async (req, res, next) => {
//     const { email, password } = req.body;

//     try {
//         const user = await UserModel.findOne({ email });
//         if (!user) return res.json({ Login: false, message: "User account not found" });

//         const isMatch = await bcrypt.compare(password, user.password);
//         if (!isMatch) return res.json({ Login: false, message: "Password Incorrect" });

//         const accessToken = jwt.sign({ email, isAdmin: user.isAdmin }, jwtAccessTokenSecret, { expiresIn: accessTokenExpiry });
//         const refreshToken = jwt.sign({ email, isAdmin: user.isAdmin }, jwtRefreshTokenSecret, { expiresIn: refreshTokenExpiry });

//         res.cookie("accessToken", accessToken, { maxAge: 300000, httpOnly: true, secure: true, sameSite: 'strict' });
//         res.cookie("refreshToken", refreshToken, { maxAge: 1800000, httpOnly: true, secure: true, sameSite: 'strict' });

//         user.count += 1;
//         user.lastLoginDate = new Date();
//         await user.save();

//         res.json({ Login: true, user: { name: user.name, email: user.email, isAdmin: user.isAdmin } });
//     } catch (err) {
//         console.error("Error in login process:", err);
//         res.status(500).json({ Login: false, message: "Error during login process", error: err.message });
//     }
// };


const login = async (req, res, next) => {
    const { email, password } = req.body;
    const isProduction = process.env.NODE_ENV === 'production'; // Check if running in production environment

    try {
        const user = await UserModel.findOne({ email });
        if (!user) return res.json({ Login: false, message: "User account not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.json({ Login: false, message: "Password Incorrect" });

        const accessToken = jwt.sign({ email, isAdmin: user.isAdmin }, jwtAccessTokenSecret, { expiresIn: accessTokenExpiry });
        const refreshToken = jwt.sign({ email, isAdmin: user.isAdmin }, jwtRefreshTokenSecret, { expiresIn: refreshTokenExpiry });

        // Set cookies with the `secure` flag based on the environment
        res.cookie("accessToken", accessToken, { 
            maxAge: 300000, 
            httpOnly: true, 
            secure: isProduction, 
            sameSite: 'strict' 
        });
        res.cookie("refreshToken", refreshToken, { 
            maxAge: 1800000, 
            httpOnly: true, 
            secure: isProduction, 
            sameSite: 'strict' 
        });

        user.count += 1;
        user.lastLoginDate = new Date();
        await user.save();

        res.json({ Login: true, user: { name: user.name, email: user.email, isAdmin: user.isAdmin } });
    } catch (err) {
        console.error("Error in login process:", err);
        res.status(500).json({ Login: false, message: "Error during login process", error: err.message });
    }
};

// Register Function
const register = async (req, res) => {
    const { name, gender, email, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await UserModel.create({ name, gender, email, password: hashedPassword });
        res.status(201).json(user);
    } catch (error) {
        console.error("Error in registration process:", error);
        res.status(500).json({ error: error.message });
    }
};

// Logout Function
const logout = (req, res) => {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    res.json({ success: true, message: "Logged out successfully" });
};

module.exports = { login, register, logout };
