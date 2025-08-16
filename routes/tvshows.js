const express = require('express');
const router = express.Router();
const {
  createTVShow,
  getTVShows,
  getTVShowById,
  updateTVShow,
  deleteTVShow,
  getTVShowStats
} = require('../controllers/tvShowController');
const { protect, authorize } = require('../middleware/auth');

// All routes are protected and require authentication
router.use(protect);

// Admin only routes
router.post('/', authorize('admin', 'editor'), createTVShow);
router.put('/:id', authorize('admin', 'editor'), updateTVShow);
router.delete('/:id', authorize('admin'), deleteTVShow);

// Admin and Editor routes
router.get('/', getTVShows);
router.get('/stats', getTVShowStats);
router.get('/:id', getTVShowById);

module.exports = router;