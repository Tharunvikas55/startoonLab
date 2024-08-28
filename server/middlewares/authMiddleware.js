const jwt = require('jsonwebtoken');
const { jwtAccessTokenSecret, jwtRefreshTokenSecret } = require('../config/auth');
const UserModel = require('../models/User');
const { renewToken } = require('../utils/tokenUtils');

// Middleware for Verifying User
const verifyUser = async (req, res, next) => {
    const accessToken = req.cookies.accessToken;

    if (!accessToken) {
        const tokenRefreshed = await renewToken(req, res);
        if (tokenRefreshed) return next();
        return res.status(403).json({ valid: false, message: "Invalid or missing access token" });
    }

    // jwt.verify(accessToken, jwtAccessTokenSecret, (err, decoded) => {
    //     if (err) {
    //         const tokenRefreshed = renewToken(req, res);
    //         if (tokenRefreshed) return next();
    //         return res.status(403).json({ valid: false, message: "Invalid access token" });
    //     }

    //     req.email = decoded.email;
    //     req.isAdmin = decoded.isAdmin;
    //     next();

    jwt.verify(accessToken, jwtAccessTokenSecret, async (err, decoded) => {
    if (err) {
        const tokenRefreshed = await renewToken(req, res);
        if (tokenRefreshed) return next();
        return res.status(403).json({ valid: false, message: "Invalid access token" });
    }
    req.email = decoded.email;
    req.isAdmin = decoded.isAdmin;
    next();
});
    });
};

// Middleware for Checking Admin Role
const isAdmin = (req, res, next) => {
    if (!req.isAdmin) return res.status(403).json({ valid: false, message: "Unauthorized Access" });
    next();
};

module.exports = { verifyUser, isAdmin };
