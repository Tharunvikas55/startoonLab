const express = require('express');
const { login, register, logout } = require('../controllers/authController');
// const { verifyUser } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.post('/logout', logout);
router.get('/',(req,res)=>{})

module.exports = router;
