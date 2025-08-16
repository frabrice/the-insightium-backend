const Article = require('../models/Article');
const { validationResult } = require('express-validator');

const createArticle = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
    }

    const articleData = {
      title: req.body.title,
      subtitle: req.body.subtitle,
      excerpt: req.body.excerpt,
      content: req.body.content,
      categoryName: req.body.category_name,
      author: req.body.author,
      authorBio: req.body.author_bio,
      publishDate: req.body.publish_date,
      readTime: req.body.read_time,
      tags: req.body.tags,
      featuredImage: req.body.featured_image,
      featuredImageAlt: req.body.featured_image_alt,
      additionalImages: req.body.additional_images || [],
      metaDescription: req.body.meta_description,
      status: req.body.status || 'draft',
      allowComments: req.body.allow_comments !== undefined ? req.body.allow_comments : true,
      featured: req.body.featured || false,
      trending: req.body.trending || false,
      editors_pick: req.body.editors_pick || false
    };

    const article = new Article(articleData);
    const savedArticle = await article.save();

    res.status(201).json({
      success: true,
      message: 'Article created successfully',
      data: savedArticle
    });

  } catch (error) {
    console.error('Error creating article:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating article',
      error: error.message
    });
  }
};

const getArticles = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, category, featured, trending, editors_pick } = req.query;
    
    const filter = {};
    if (status) filter.status = status;
    if (category) filter.categoryName = category;
    if (featured !== undefined) filter.featured = featured === 'true';
    if (trending !== undefined) filter.trending = trending === 'true';
    if (editors_pick !== undefined) filter.editors_pick = editors_pick === 'true';

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    const articles = await Article.find(filter)
      .sort({ createdAt: -1 })
      .limit(limitNum)
      .skip((pageNum - 1) * limitNum);

    const total = await Article.countDocuments(filter);

    res.json({
      success: true,
      data: articles,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(total / limitNum),
        totalItems: total,
        itemsPerPage: limitNum,
        hasNextPage: pageNum < Math.ceil(total / limitNum),
        hasPrevPage: pageNum > 1
      }
    });

  } catch (error) {
    console.error('Error fetching articles:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching articles',
      error: error.message
    });
  }
};

const getTrendingArticles = async (req, res) => {
  try {
    const { page = 1, limit = 10, status = 'published' } = req.query;
    
    const filter = { 
      trending: true,
      status: status 
    };

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    const articles = await Article.find(filter)
      .sort({ createdAt: -1 })
      .limit(limitNum)
      .skip((pageNum - 1) * limitNum);

    const total = await Article.countDocuments(filter);

    res.json({
      success: true,
      data: articles,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(total / limitNum),
        totalItems: total,
        itemsPerPage: limitNum,
        hasNextPage: pageNum < Math.ceil(total / limitNum),
        hasPrevPage: pageNum > 1
      }
    });

  } catch (error) {
    console.error('Error fetching trending articles:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching trending articles',
      error: error.message
    });
  }
};

const getFeaturedArticles = async (req, res) => {
  try {
    const { status = 'published' } = req.query;
    
    const filter = { 
      featured: true,
      status: status 
    };

    const articles = await Article.find(filter)
      .sort({ createdAt: -1 })
      .limit(3);

    const total = await Article.countDocuments(filter);

    res.json({
      success: true,
      data: articles,
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalItems: total,
        itemsPerPage: 3,
        hasNextPage: false,
        hasPrevPage: false
      }
    });

  } catch (error) {
    console.error('Error fetching featured articles:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching featured articles',
      error: error.message
    });
  }
};

const getEditorsPickArticles = async (req, res) => {
  try {
    const { status = 'published' } = req.query;
    
    const filter = { 
      editors_pick: true,
      status: status 
    };

    const articles = await Article.find(filter)
      .sort({ createdAt: -1 })
      .limit(3);

    const total = await Article.countDocuments(filter);

    res.json({
      success: true,
      data: articles,
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalItems: total,
        itemsPerPage: 3,
        hasNextPage: false,
        hasPrevPage: false
      }
    });

  } catch (error) {
    console.error('Error fetching editor\'s pick articles:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching editor\'s pick articles',
      error: error.message
    });
  }
};

const getArticleById = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    
    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Article not found'
      });
    }

    res.json({
      success: true,
      data: article
    });

  } catch (error) {
    console.error('Error fetching article:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching article',
      error: error.message
    });
  }
};

const updateArticle = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
    }

    const articleData = {
      title: req.body.title,
      subtitle: req.body.subtitle,
      excerpt: req.body.excerpt,
      content: req.body.content,
      categoryName: req.body.category_name,
      author: req.body.author,
      authorBio: req.body.author_bio,
      publishDate: req.body.publish_date,
      readTime: req.body.read_time,
      tags: req.body.tags,
      featuredImage: req.body.featured_image,
      featuredImageAlt: req.body.featured_image_alt,
      additionalImages: req.body.additional_images || [],
      metaDescription: req.body.meta_description,
      status: req.body.status || 'draft',
      allowComments: req.body.allow_comments !== undefined ? req.body.allow_comments : true,
      featured: req.body.featured || false,
      trending: req.body.trending || false,
      editors_pick: req.body.editors_pick || false
    };

    const updatedArticle = await Article.findByIdAndUpdate(
      req.params.id,
      articleData,
      { new: true, runValidators: true }
    );

    if (!updatedArticle) {
      return res.status(404).json({
        success: false,
        message: 'Article not found'
      });
    }

    res.json({
      success: true,
      message: 'Article updated successfully',
      data: updatedArticle
    });

  } catch (error) {
    console.error('Error updating article:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating article',
      error: error.message
    });
  }
};

const deleteArticle = async (req, res) => {
  try {
    const deletedArticle = await Article.findByIdAndDelete(req.params.id);

    if (!deletedArticle) {
      return res.status(404).json({
        success: false,
        message: 'Article not found'
      });
    }

    res.json({
      success: true,
      message: 'Article deleted successfully',
      data: deletedArticle
    });

  } catch (error) {
    console.error('Error deleting article:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting article',
      error: error.message
    });
  }
};

const setMainArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const { position } = req.body;

    if (!['main', 'second'].includes(position)) {
      return res.status(400).json({
        success: false,
        message: 'Position must be either "main" or "second"'
      });
    }

    const article = await Article.findById(id);
    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Article not found'
      });
    }

    if (position === 'main') {
      await Article.updateMany(
        { isMainArticle: true },
        { 
          isMainArticle: false, 
          mainArticlePosition: null 
        }
      );
      
      article.isMainArticle = true;
      article.isSecondMainArticle = false;
      article.mainArticlePosition = 'main';
    } else if (position === 'second') {
      await Article.updateMany(
        { isSecondMainArticle: true },
        { 
          isSecondMainArticle: false, 
          mainArticlePosition: null 
        }
      );
      
      article.isSecondMainArticle = true;
      article.isMainArticle = false;
      article.mainArticlePosition = 'second';
    }

    await article.save();

    res.json({
      success: true,
      message: `Article set as ${position} main article successfully`,
      data: article
    });

  } catch (error) {
    console.error('Error setting main article:', error);
    res.status(500).json({
      success: false,
      message: 'Error setting main article',
      error: error.message
    });
  }
};

const removeMainArticle = async (req, res) => {
  try {
    const { id } = req.params;

    const article = await Article.findById(id);
    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Article not found'
      });
    }

    article.isMainArticle = false;
    article.isSecondMainArticle = false;
    article.mainArticlePosition = null;

    await article.save();

    res.json({
      success: true,
      message: 'Article removed from main articles successfully',
      data: article
    });

  } catch (error) {
    console.error('Error removing main article:', error);
    res.status(500).json({
      success: false,
      message: 'Error removing main article',
      error: error.message
    });
  }
};

const getMainArticles = async (req, res) => {
  try {
    const mainArticle = await Article.findOne({ 
      isMainArticle: true, 
      status: 'published' 
    });
    
    const secondMainArticle = await Article.findOne({ 
      isSecondMainArticle: true, 
      status: 'published' 
    });

    res.json({
      success: true,
      data: {
        main: mainArticle,
        second: secondMainArticle
      }
    });

  } catch (error) {
    console.error('Error fetching main articles:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching main articles',
      error: error.message
    });
  }
};

const getLatestArticlesExcludingMain = async (req, res) => {
  try {
    const { limit = 3 } = req.query;
    
    const articles = await Article.find({
      status: 'published',
      isMainArticle: { $ne: true },
      isSecondMainArticle: { $ne: true }
    })
    .sort({ createdAt: -1 })
    .limit(parseInt(limit));

    res.json({
      success: true,
      data: articles,
      count: articles.length
    });

  } catch (error) {
    console.error('Error fetching latest articles excluding main:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching latest articles',
      error: error.message
    });
  }
};

module.exports = {
  createArticle,
  getArticles,
  getArticleById,
  updateArticle,
  deleteArticle,
  setMainArticle,
  removeMainArticle,
  getMainArticles,
  getLatestArticlesExcludingMain,
  getTrendingArticles,
  getFeaturedArticles,
  getEditorsPickArticles
};