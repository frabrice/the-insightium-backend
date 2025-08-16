const express = require('express');
const router = express.Router();
const {
  incrementLike,
  decrementLike,
  getLikeCount,
  getMostLikedArticles
} = require('../controllers/likeController');

// POST /api/likes/:articleId/increment - Increment like count for an article
router.post('/:articleId/increment', incrementLike);

// POST /api/likes/:articleId/decrement - Decrement like count for an article
router.post('/:articleId/decrement', decrementLike);

// GET /api/likes/:articleId - Get like count for an article
router.get('/:articleId', getLikeCount);

// GET /api/likes/most-liked/articles - Get most liked articles
router.get('/most-liked/articles', getMostLikedArticles);

module.exports = router;