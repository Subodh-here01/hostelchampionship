require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const teamRoutes = require('./routes/teams');
const matchRoutes = require('./routes/matches');
const standingRoutes = require('./routes/standings');
const galleryRoutes = require('./routes/gallery');
const venueRoutes = require('./routes/venues');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*', // For development flexibility; can be locked down to client URL in production
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-admin-secret']
}));
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ limit: '15mb', extended: true }));

// Database Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/hostel_championship';
mongoose.connect(MONGO_URI)
  .then(() => console.log('Successfully connected to MongoDB database.'))
  .catch(err => {
    console.error('Database connection failed:', err.message);
    process.exit(1);
  });

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/standings', standingRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/venues', venueRoutes);

// Health Check Endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date() });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'An internal server error occurred.' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Hostel Championship server running on port ${PORT}`);
});
