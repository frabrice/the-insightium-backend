const Comment = require('../models/Comment');
const Article = require('../models/Article');

// Create a new comment
const createComment = async (req, res) => {
  try {
    const { articleId } = req.params;
    const { name, email, content } = req.body;
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('User-Agent');

    // Check if article exists and allows comments
    const article = await Article.findById(articleId);
    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Article not found'
      });
    }

    if (!article.allowComments) {
      return res.status(403).json({
        success: false,
        message: 'Comments are not allowed for this article'
      });
    }

    // Validate required fields
    if (!content) {
      return res.status(400).json({
        success: false,
        message: 'Comment content is required'
      });
    }

    // Create comment
    const comment = await Comment.create({
      articleId,
      name,
      email,
      content,
      ipAddress,
      userAgent
    });

    // Populate the created comment
    const populatedComment = await Comment.findById(comment._id);

    res.status(201).json({
      success: true,
      message: 'Comment created successfully',
      data: populatedComment
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = {};
      for (let field in error.errors) {
        errors[field] = error.errors[field].message;
      }
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors
      });
    }

    console.error('Error creating comment:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating comment',
      error: error.message
    });
  }
};

// Get comments for an article
const getComments = async (req, res) => {
  try {
    const { articleId } = req.params;
    const { limit = 3, page = 1, all = false } = req.query;

    // Check if article exists
    const article = await Article.findById(articleId);
    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Article not found'
      });
    }

    // Build query
    const query = { 
      articleId, 
      isApproved: true 
    };

    // Get total count
    const totalComments = await Comment.countDocuments(query);

    let comments;
    let pagination = null;

    if (all === 'true') {
      // Get all comments
      comments = await Comment.find(query)
        .sort({ createdAt: -1 })
        .select('-ipAddress -userAgent -email');
    } else {
      // Get paginated comments (default: latest 3)
      const skip = (page - 1) * limit;
      const totalPages = Math.ceil(totalComments / limit);

      comments = await Comment.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .select('-ipAddress -userAgent -email');

      pagination = {
        currentPage: parseInt(page),
        totalPages,
        totalComments,
        hasMore: page < totalPages
      };
    }

    res.json({
      success: true,
      data: {
        comments,
        totalComments,
        pagination
      }
    });
  } catch (error) {
    console.error('Error getting comments:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching comments',
      error: error.message
    });
  }
};

// Get comment count for an article
const getCommentCount = async (req, res) => {
  try {
    const { articleId } = req.params;

    // Check if article exists
    const article = await Article.findById(articleId);
    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Article not found'
      });
    }

    const commentCount = await Comment.countDocuments({ 
      articleId, 
      isApproved: true 
    });

    res.json({
      success: true,
      data: {
        commentCount,
        articleId
      }
    });
  } catch (error) {
    console.error('Error getting comment count:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching comment count',
      error: error.message
    });
  }
};

// Delete a comment (admin only - for future use)
const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;

    const comment = await Comment.findByIdAndDelete(commentId);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    res.json({
      success: true,
      message: 'Comment deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting comment',
      error: error.message
    });
  }
};

// Get recent comments across all articles (admin dashboard)
const getRecentComments = async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const recentComments = await Comment.find({ isApproved: true })
      .populate('articleId', 'title')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .select('-ipAddress -userAgent');

    res.json({
      success: true,
      data: recentComments
    });
  } catch (error) {
    console.error('Error getting recent comments:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching recent comments',
      error: error.message
    });
  }
};

module.exports = {
  createComment,
  getComments,
  getCommentCount,
  deleteComment,
  getRecentComments
};