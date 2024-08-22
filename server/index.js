require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const connectDB = require('./config/db');
const createAdmin = require('./utils/adminSetup');  
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

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

// Create Admin User
createAdmin(); 

// Routes
app.use('/api', authRoutes);
app.use('/api', userRoutes);  // Example user routes

// Default route
app.get('/', (req, res) => res.json({message:"Hello world"}));

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));
