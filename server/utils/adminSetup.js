const bcrypt = require('bcrypt');
const UserModel = require('../models/User');

const createAdmin = async (req,res,next) => {
    try {
        const adminExists = await UserModel.findOne({ email: 'admin@email.com' });
        if (!adminExists) {
            const hashedPassword = await bcrypt.hash('Admin@123', 10);
            await UserModel.create({
                name: 'Admin',
                email: 'admin@email.com',
                password: hashedPassword,
                gender: 'Other',
                isAdmin: true
            });
            console.log('Admin user created successfully');
        } else {
            console.log('Admin user already exists');
        }
    } catch (err) {
        console.error('Error creating admin user:', err);
    }
};

module.exports = createAdmin;
