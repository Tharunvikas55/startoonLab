const jwt = require('jsonwebtoken');
const { jwtAccessTokenSecret, jwtRefreshTokenSecret, accessTokenExpiry, refreshTokenExpiry } = require('../config/auth');

// Function to Renew Access Token
const renewToken = (req, res) => {
    return new Promise((resolve, reject) => {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            res.clearCookie('accessToken');
            resolve(false);
        } else {
            jwt.verify(refreshToken, jwtRefreshTokenSecret, (err, decoded) => {
                if (err) {
                    res.clearCookie('accessToken');
                    resolve(false);
                } else {
                    const newAccessToken = jwt.sign({ email: decoded.email, isAdmin: decoded.isAdmin }, jwtAccessTokenSecret, { expiresIn: accessTokenExpiry });
                    res.cookie("accessToken", newAccessToken, { maxAge: 300000, httpOnly: false, secure: process.env.NODE_ENV === 'production', sameSite: 'None' });
                    resolve(true);
                }
            });
        }
    });
};

module.exports = { renewToken };
