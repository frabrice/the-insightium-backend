const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/database');
const errorHandler = require('./middleware/errorHandler');

// Import routes
const authRoutes = require('./routes/auth');
const publicRoutes = require('./routes/public');
const articlesRoutes = require('./routes/articles');
const videosRoutes = require('./routes/videos');
const tvShowsRoutes = require('./routes/tvshows');
const podcastsRoutes = require('./routes/podcasts');
const dashboardRoutes = require('./routes/dashboard');
const likesRoutes = require('./routes/likes');
const commentsRoutes = require('./routes/comments');

const app = express();

connectDB();

const corsOptions = {
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'X-Requested-With',
    'Accept',
    'Origin',
    'Cache-Control',
    'X-File-Name'
  ],
  credentials: false, // Set to false when origin is '*'
  optionsSuccessStatus: 200 // For legacy browser support
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Public routes (no authentication required)
app.use('/api/auth', authRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/likes', likesRoutes);
app.use('/api/comments', commentsRoutes);

// Protected routes (authentication required)
app.use('/api/articles', articlesRoutes);
app.use('/api/videos', videosRoutes);
app.use('/api/tvshows', tvShowsRoutes);
app.use('/api/podcasts', podcastsRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'TheInsight Backend API is running',
    timestamp: new Date().toISOString(),
    cors: {
      origin: corsOptions.origin,
      methods: corsOptions.methods,
      allowedHeaders: corsOptions.allowedHeaders,
      credentials: corsOptions.credentials
    },
    environment: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 5000
  });
});

// CORS test endpoint
app.get('/api/cors-test', (req, res) => {
  const requestOrigin = req.headers.origin || 'No origin header';
  const userAgent = req.headers['user-agent'] || 'No user agent';
  
  res.json({
    success: true,
    message: 'CORS is working correctly!',
    requestInfo: {
      origin: requestOrigin,
      method: req.method,
      userAgent: userAgent,
      timestamp: new Date().toISOString()
    },
    corsConfig: {
      allowedOrigin: corsOptions.origin,
      allowedMethods: corsOptions.methods,
      allowedHeaders: corsOptions.allowedHeaders
    }
  });
});

app.use(errorHandler);

app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false,
    message: 'Route not found' 
  });
});

module.exports = app;