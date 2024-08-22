const express = require('express');
const { login, register, logout } = require('../controllers/authController');
// const { verifyUser } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/',(req, res,next) => res.json({message:"Hello world"}));
router.post('/login', login);
router.post('/register', register);
router.post('/logout', logout);

module.exports = router;
