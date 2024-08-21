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


// Create the model
const UserModel = mongoose.model('User', userSchema);

// Function to update count and last login date on subsequent logins
UserModel.handleLogin = async function(userId) {
    try {
        // Find the user by their ID
        const user = await UserModel.findById(userId);

        if (user) {
            // Increment count by 1
            user.count += 1;
            
            // Update the lastLoginDate to the current date
            user.lastLoginDate = new Date();
            
            // Save the updated user document
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
