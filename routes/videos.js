const express = require('express');
const router = express.Router();
const {
  createVideo,
  getVideos,
  getVideoById,
  updateVideo,
  deleteVideo
} = require('../controllers/videoController');
const { validateVideo } = require('../middleware/validation');
const { protect, authorize } = require('../middleware/auth');

// All routes are protected and require authentication
router.use(protect);

// Admin only routes
router.post('/', authorize('admin', 'editor'), validateVideo, createVideo);
router.put('/:id', authorize('admin', 'editor'), validateVideo, updateVideo);
router.delete('/:id', authorize('admin'), deleteVideo);

// Admin and Editor routes
router.get('/', getVideos);
router.get('/:id', getVideoById);

module.exports = router;