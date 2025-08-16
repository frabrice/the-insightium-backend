const express = require('express');
const router = express.Router();

const { createArticle, getArticles, getArticleById, updateArticle, deleteArticle, setMainArticle, removeMainArticle, getMainArticles, getLatestArticlesExcludingMain, getTrendingArticles, getFeaturedArticles, getEditorsPickArticles } = require('../controllers/articleController');
const { validateArticle } = require('../middleware/validation');
const { protect, authorize } = require('../middleware/auth');

// All routes are protected and require authentication
router.use(protect);

// Admin only routes
router.post('/', authorize('admin', 'editor'), validateArticle, createArticle);
router.put('/:id', authorize('admin', 'editor'), validateArticle, updateArticle);
router.delete('/:id', authorize('admin'), deleteArticle);
router.put('/:id/set-main', authorize('admin'), setMainArticle);
router.put('/:id/remove-main', authorize('admin'), removeMainArticle);

// Admin and Editor routes
router.get('/', getArticles);
router.get('/trending', getTrendingArticles);
router.get('/featured', getFeaturedArticles);
router.get('/editors-pick', getEditorsPickArticles);
router.get('/main-articles', getMainArticles);
router.get('/latest-excluding-main', getLatestArticlesExcludingMain);
router.get('/:id', getArticleById);

module.exports = router;