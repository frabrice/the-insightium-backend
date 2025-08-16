const express = require('express');
const router = express.Router();
const {
  createPodcast,
  getPodcasts,
  getPodcastById,
  updatePodcast,
  deletePodcast,
  getPodcastStats
} = require('../controllers/podcastController');
const { protect, authorize } = require('../middleware/auth');

// All routes are protected and require authentication
router.use(protect);

// Admin only routes
router.post('/', authorize('admin', 'editor'), createPodcast);
router.put('/:id', authorize('admin', 'editor'), updatePodcast);
router.delete('/:id', authorize('admin'), deletePodcast);

// Admin and Editor routes
router.get('/', getPodcasts);
router.get('/stats', getPodcastStats);
router.get('/:id', getPodcastById);

module.exports = router;