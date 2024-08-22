const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/User');
const { jwtAccessTokenSecret, jwtRefreshTokenSecret, accessTokenExpiry, refreshTokenExpiry } = require('../config/auth');

const login = async (req, res,next) => {
    const { email, password } = req.body;

    try {
        const user = await UserModel.findOne({ email });
        if (!user) return res.json({ Login: false, message: "User account not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.json({ Login: false, message: "Password Incorrect" });

        const accessToken = jwt.sign({ email, isAdmin: user.isAdmin }, Tharun-access-token-secret-key, { expiresIn: accessTokenExpiry });
        const refreshToken = jwt.sign({ email, isAdmin: user.isAdmin }, Tharun-refresh-token-secret-key, { expiresIn: refreshTokenExpiry });

        res.cookie("accessToken", accessToken, { maxAge: 300000, httpOnly: true, secure: true, sameSite: 'strict' });
        res.cookie("refreshToken", refreshToken, { maxAge: 1800000, httpOnly: true, secure: true, sameSite: 'strict' });

        user.count += 1;
        user.lastLoginDate = new Date();
        await user.save();

        res.json({ Login: true, user: { name: user.name, email: user.email, isAdmin: user.isAdmin } });
    } catch (err) {
        res.status(500).json({ Login: false, message: "Error finding user", error: err.message });
    }
};

const register = async (req, res) => {
    const { name, gender, email, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await UserModel.create({ name, gender, email, password: hashedPassword });
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const logout = (req, res) => {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    res.json({ success: true, message: "Logged out successfully" });
};

module.exports = { login, register, logout };
