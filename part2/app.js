const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();

const session = require('express-session');
// Configure session middleware
app.use(session({
    secret: process.env.SESSION_SECRET || '3a7b21f95d8e4c0a1f6e7d3b9c5a8f0e2d1c0b7a6f8e5d2c1a0f9e7d4c3b2a1', // Strong, unique secret
    resave: false,
    saveUninitialized: true,
    cookie: { 
        secure: process.env.NODE_ENV === 'production',
        maxAge: 1 * 60 * 60 * 1000 // 1 hours
     }
}));

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '/public')));

// Routes
const walkRoutes = require('./routes/walkRoutes');
const userRoutes = require('./routes/userRoutes');
const dogRoutes = require('./routes/dogRoutes');

app.use('/api/walks', walkRoutes);
app.use('/api/users', userRoutes);
app.use('/api/dogs', dogRoutes);

// Export the app instead of listening here
module.exports = app;