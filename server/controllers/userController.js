const UserModel = require('../models/User');

// Controller for user dashboard
exports.getUserDashboard = async (req, res) => {
    try {
        const user = await UserModel.findOne({ email: req.email });

        if (user) {
            return res.json({
                valid: true,
                message: "Authorized",
                user: {
                    name: user.name,
                    email: user.email,
                    gender: user.gender,
                    count: user.count,
                    lastLoginDate: user.lastLoginDate
                }
            });
        } else {
            return res.json({ valid: false, message: "User not found" });
        }
    } catch (err) {
        console.error("Error fetching user:", err);
        res.status(500).json({ valid: false, message: "Internal Server Error" });
    }
};

// Controller for admin dashboard
exports.getAdminDashboard = async (req, res) => {
    try {
        const keyword = req.query.keyword;

        const query = {
            isAdmin: false,
            ...(keyword ? { name: { $regex: keyword, $options: 'i' } } : {}),
        };

        const users = await UserModel.find(query, { isAdmin: 0 }); // Exclude isAdmin field
        res.json({ valid: true, users });
    } catch (err) {
        res.status(500).json({ valid: false, message: "Internal Server Error", error: err.message });
    }
};
