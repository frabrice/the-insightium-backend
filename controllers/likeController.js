const Like = require('../models/Like');
const Article = require('../models/Article');

// Increment like count for an article
const incrementLike = async (req, res) => {
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

    // Find or create like record for this article
    let likeRecord = await Like.findOne({ articleId });
    
    if (!likeRecord) {
      likeRecord = await Like.create({ articleId, count: 1 });
    } else {
      likeRecord.count += 1;
      await likeRecord.save();
    }

    return res.json({
      success: true,
      message: 'Article liked',
      likeCount: likeRecord.count
    });
  } catch (error) {
    console.error('Error incrementing like:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing like',
      error: error.message
    });
  }
};

// Decrement like count for an article
const decrementLike = async (req, res) => {
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

    // Find like record for this article
    let likeRecord = await Like.findOne({ articleId });
    
    if (!likeRecord || likeRecord.count <= 0) {
      return res.json({
        success: true,
        message: 'No likes to remove',
        likeCount: 0
      });
    }

    likeRecord.count = Math.max(0, likeRecord.count - 1);
    await likeRecord.save();

    return res.json({
      success: true,
      message: 'Article unliked',
      likeCount: likeRecord.count
    });
  } catch (error) {
    console.error('Error decrementing like:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing unlike',
      error: error.message
    });
  }
};

// Get like count for an article
const getLikeCount = async (req, res) => {
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

    // Get like record
    const likeRecord = await Like.findOne({ articleId });
    const likeCount = likeRecord ? likeRecord.count : 0;

    res.json({
      success: true,
      data: {
        likeCount,
        articleId
      }
    });
  } catch (error) {
    console.error('Error getting like count:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching like count',
      error: error.message
    });
  }
};

// Get most liked articles
const getMostLikedArticles = async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const mostLiked = await Like.aggregate([
      {
        $sort: { count: -1 }
      },
      {
        $limit: parseInt(limit)
      },
      {
        $lookup: {
          from: 'articles',
          localField: 'articleId',
          foreignField: '_id',
          as: 'article'
        }
      },
      {
        $unwind: '$article'
      },
      {
        $match: {
          'article.status': 'published'
        }
      },
      {
        $project: {
          _id: '$articleId',
          likeCount: '$count',
          title: '$article.title',
          excerpt: '$article.excerpt',
          featuredImage: '$article.featuredImage',
          author: '$article.author',
          publishDate: '$article.publishDate',
          categoryName: '$article.categoryName'
        }
      }
    ]);

    res.json({
      success: true,
      data: mostLiked
    });
  } catch (error) {
    console.error('Error getting most liked articles:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching most liked articles',
      error: error.message
    });
  }
};

module.exports = {
  incrementLike,
  decrementLike,
  getLikeCount,
  getMostLikedArticles
};