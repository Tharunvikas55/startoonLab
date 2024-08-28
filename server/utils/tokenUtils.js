const jwt = require('jsonwebtoken');
const { jwtAccessTokenSecret, jwtRefreshTokenSecret, accessTokenExpiry, refreshTokenExpiry } = require('../config/auth');

// Function to Renew Access Token
const renewToken = (req, res) => {
    return new Promise((resolve, reject) => {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            res.clearCookie('accessToken', { sameSite: 'None', secure: process.env.NODE_ENV === 'production' });
            resolve(false);
        } else {
            jwt.verify(refreshToken, jwtRefreshTokenSecret, (err, decoded) => {
                if (err) {
                    res.clearCookie('accessToken', { sameSite: 'None', secure: process.env.NODE_ENV === 'production' });
                    resolve(false);
                } else {
                    const newAccessToken = jwt.sign({ email: decoded.email, isAdmin: decoded.isAdmin }, jwtAccessTokenSecret, { expiresIn: accessTokenExpiry });
                    res.cookie("accessToken", newAccessToken, {
                        maxAge: 300000, // 5 minutes
                        httpOnly: false, // Make false if you need to access it via JS
                        secure: process.env.NODE_ENV === 'production', // Ensure secure flag is set in production
                        sameSite: 'None' // Important for cross-origin
                    });
                    resolve(true);
                }
            });
        }
    });
};

module.exports = { renewToken };
