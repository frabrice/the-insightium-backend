const express = require('express');
const router = express.Router();

const { 
  getDashboardStats, 
  getRecentArticles, 
  getDashboardAnalytics 
} = require('../controllers/dashboardController');
const { protect, authorize } = require('../middleware/auth');

// All routes are protected and require authentication
router.use(protect);

// Admin and Editor routes
router.get('/stats', getDashboardStats);
router.get('/recent-articles', getRecentArticles);
router.get('/analytics', authorize('admin'), getDashboardAnalytics);

module.exports = router;