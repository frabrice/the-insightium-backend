const express = require('express');
const router = express.Router();
const {
  createComment,
  getComments,
  getCommentCount,
  deleteComment,
  getRecentComments
} = require('../controllers/commentController');

// POST /api/comments/:articleId - Create a comment for an article
router.post('/:articleId', createComment);

// GET /api/comments/:articleId - Get comments for an article
router.get('/:articleId', getComments);

// GET /api/comments/:articleId/count - Get comment count for an article
router.get('/:articleId/count', getCommentCount);

// DELETE /api/comments/comment/:commentId - Delete a specific comment
router.delete('/comment/:commentId', deleteComment);

// GET /api/comments/recent/all - Get recent comments across all articles
router.get('/recent/all', getRecentComments);

module.exports = router;