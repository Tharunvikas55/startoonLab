const express = require('express');
const { verifyUser, isAdmin } = require('../middlewares/authMiddleware');
const { getUserDashboard, getAdminDashboard } = require('../controllers/userController');

const router = express.Router();

// Route for user dashboard
router.get('/dashboard', verifyUser, getUserDashboard);

// Route for admin dashboard
router.get('/admin-dashboard', verifyUser, isAdmin, getAdminDashboard);

module.exports = router;
