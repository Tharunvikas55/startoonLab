require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const connectDB = require('./config/db');
const createAdmin = require('./utils/adminSetup');  
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

// const path = require('path');

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
    origin: [process.env.CLIENT_ORIGIN],
    methods: ["GET", 'POST', 'PUT', 'DELETE'],
    credentials: true
}));
app.use(cookieParser());

// Connect to DB
connectDB();

 // app.use(express.static(path.join(__dirname, '..', 'frontend',  'build')));
 //    app.get('*', (req, res) => {
 //        res.sendFile(path.resolve(__dirname, '..', 'frontend', 'build', 'index.html'))
 //    });

// Create Admin User
createAdmin(); 

app.get('/', (req,res,next) => {res.send('Running'))};
// Routes
app.use('/api', authRoutes);
app.use('/api', userRoutes);  // Example user routes

// Default route

// Start server
const PORT = 3001;
app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));
