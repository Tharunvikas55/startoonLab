
const express=require('express')
const cors=require('cors')
const mongoose=require('mongoose')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
const cookieParser=require('cookie-parser')
const UserModel = require('./model/User')

const app=express()
app.use(express.json())
app.use(cors({
    origin:["http://localhost:5173"],
    methods:["GET",'POST','PUT','DELETE'],
    credentials:true
}))
app.use(cookieParser())
mongoose.connect("mongodb://localhost:27017/startoon")
    .then(result=>console.log("Connected to mongodb"))
    .catch(err=>console.log(err))


 // Create the admin user (run this once)
const createAdmin = async () => {
        const adminExists = await UserModel.findOne({ email: 'admin@email.com' });
        if (!adminExists) {
            const hashedPassword = await bcrypt.hash('Admin@123', 10);
            UserModel.create({
                name: 'Admin',
                email: 'admin@email.com',
                password: hashedPassword,
                gender: 'Other',
                isAdmin: true
            });
        }
};
createAdmin();
    
const verifyUser = async (req, res, next) => {
    const accessToken = req.cookies.accessToken;

    if (!accessToken) {
        const tokenRefreshed = await renewToken(req, res);
        if (tokenRefreshed) {
            return next();
        } else {
            return res.status(403).json({ valid: false, message: "Invalid or missing access token" });
        }
    } else {
        jwt.verify(accessToken, "jwt-access-token-secret-key", (err, decoded) => {
            if (err) {
                const tokenRefreshed = renewToken(req, res);
                if (tokenRefreshed) {
                    return next();
                } else {
                    return res.status(403).json({ valid: false, message: "Invalid access token" });
                }
            } else {
                req.email = decoded.email;
                req.isAdmin = decoded.isAdmin; // Ensure this is set correctly
                return next();
            }
        });
    }
};

const renewToken = (req, res) => {
    return new Promise((resolve, reject) => {
        const refreshToken = req.cookies.RefreshToken;

        if (!refreshToken) {
            res.clearCookie('accessToken');
            resolve(false);
        } else {
            jwt.verify(refreshToken, "jwt-refresh-token-secret-key", (err, decoded) => {
                if (err) {
                    res.clearCookie('accessToken');
                    resolve(false);
                } else {
                    const newAccessToken = jwt.sign({ email: decoded.email }, "jwt-access-token-secret-key", { expiresIn: '5m' });
                    res.cookie("accessToken", newAccessToken, { maxAge: 300000, httpOnly: true, secure: true, sameSite: 'strict' });
                    resolve(true);
                }
            });
        }
    });
};

app.get('/',(req,res)=>{
    res.send('Running');
})
app.get('/dashboard', verifyUser, (req, res) => {
    UserModel.findOne({ email: req.email })
    .then(user => {
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
    })
    .catch(err => {
        console.error("Error fetching user:", err);
        res.status(500).json({ valid: false, message: "Internal Server Error" });
    });
});

app.post('/login', (req, res) => {  
    const { email, password } = req.body;
    UserModel.findOne({ email: email })
    .then(user => {
        if (user) {
            bcrypt.compare(password, user.password, (err, response) => {
                if (response) {
                    const accessToken = jwt.sign({ email: email, isAdmin: user.isAdmin }, "jwt-access-token-secret-key", { expiresIn: '5m' });
                    const refreshToken = jwt.sign({ email: email, isAdmin: user.isAdmin }, "jwt-refresh-token-secret-key", { expiresIn: '30m' });
                    res.cookie("accessToken", accessToken, { maxAge: 300000, httpOnly: true, secure: true, sameSite: 'strict' });
                    res.cookie("RefreshToken", refreshToken, { maxAge: 1800000, httpOnly: true, secure: true, sameSite: 'strict' });
                    user.count += 1;
                    user.lastLoginDate = new Date();
                    user.save()
                    .then(() => {
                        return res.json({ Login: true, user: { name: user.name, email: user.email, isAdmin: user.isAdmin } });
                    })
                    .catch(err => {
                        return res.status(500).json({ Login: false, message: "Error updating user data", error: err.message });
                    });
                } else {
                    return res.json({ Login: false, message: "Password Incorrect" });
                }
            });
        } else {
            return res.json({ Login: false, message: "User account not found" });
        }
    })
    .catch(err => {
        return res.status(500).json({ Login: false, message: "Error finding user", error: err.message });
    });
});


app.post('/logout', (req, res) => {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    return res.json({ success: true, message: "Logged out successfully" });
});
app.post('/register', (req, res) => {
    const { name, gender, email, password } = req.body;
    bcrypt.hash(password, 10)
        .then(hash => {
            UserModel.create({ name, gender, email, password: hash })
                .then(user => res.status(201).json(user))
                .catch(error => res.status(500).json(error));
        })
        .catch(error => {
            console.log(error.message);
            res.status(500).json({ error: error.message });
        });
});

// app.get('/admin-dashboard', verifyUser, (req, res) => {
//     if (req.isAdmin) {
//         UserModel.find()
//         .then(users => {
//             return res.json({ valid: true, users });
//         })
//         .catch(err => {
//             return res.status(500).json({ valid: false, message: "Internal Server Error", error: err.message });
//         });
//     } else {
//         return res.status(403).json({ valid: false, message: "Unauthorized Access" });
//     }
// });
app.get('/admin-dashboard', verifyUser, async (req, res) => {
    if (req.isAdmin) {
        try {
            // Extract keyword from query parameters
            const keyword = req.query.keyword;
            
            // Build query based on keyword if provided and ensure isAdmin is false
            const query = {
                isAdmin: false,  // Ensure we only get non-admin users
                ...(keyword ? { name: { $regex: keyword, $options: 'i' } } : {})  // Case-insensitive search if keyword is provided
            };
            
            // Fetch users from the database, excluding the `isAdmin` field
            const users = await UserModel.find(query, { isAdmin: 0 }); // 0 means exclude
            
            res.json({ valid: true, users });
        } catch (err) {
            res.status(500).json({ valid: false, message: "Internal Server Error", error: err.message });
        }
    } else {
        res.status(403).json({ valid: false, message: "Unauthorized Access" });
    }
});




app.listen(3001,()=>console.log("server is running in port http://localhost:3001"));