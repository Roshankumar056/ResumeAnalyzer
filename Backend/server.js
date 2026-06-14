require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = async () => {
    const db = require('./config/db');
    await db();
};

const resumeRoutes = require('./routes/resumeRoutes');

const app = express();

// Database Connection
connectDB();

// Global Middlewares
app.use(cors());
app.use(express.json()); // Essential to parse json bodies like jobDescription

// API Routes routing mapping
app.use('/api/resume', resumeRoutes);

// Base sanity check path route
app.get('/', (req, res) => {
    res.send('AI Resume Analyzer API Server running smoothly.');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server executing safely on port ${PORT}`);
});