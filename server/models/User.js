const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    count: { type: Number, default: 0 },
    gender: { type: String, required: true },
    lastLoginDate: { type: Date },
    isAdmin: { type: Boolean, default: false } // New field for admin users
});
const UserModel = mongoose.model('User', userSchema);


UserModel.handleLogin = async function(userId) {
    try {
        const user = await UserModel.findById(userId);

        if (user) {
            user.count += 1;
            user.lastLoginDate = new Date();
            await user.save();
            return user;
        } else {
            throw new Error('User not found');
        }
    } catch (err) {
        throw new Error(err.message);
    }
};

module.exports = UserModel;
