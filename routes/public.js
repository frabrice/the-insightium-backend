const express = require('express');
const Article = require('../models/Article');
const Video = require('../models/Video');
const TVShow = require('../models/TVShow');
const Podcast = require('../models/Podcast');
const { optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Apply optional auth to all routes (for potential future features like user preferences)
router.use(optionalAuth);

// @desc    Get all published articles for magazine page
// @route   GET /api/public/articles
// @access  Public
const getPublicArticles = async (req, res) => {
  try {
    const { category, featured, trending, limit = 20, page = 1 } = req.query;

    // Build query for published articles only
    let query = { status: 'published' };

    // Add filters
    if (category) {
      query.category = category;
    }
    
    if (featured === 'true') {
      query.featured = true;
    }
    
    if (trending === 'true') {
      query.trending = true;
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get articles with pagination
    const articles = await Article.find(query)
      .sort({ publishDate: -1, createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .select('title subtitle excerpt content author categoryName category featured trending publishDate views readTime tags featured_image featuredImage allowComments')
      .lean();

    // Get total count
    const totalArticles = await Article.countDocuments(query);

    res.json({
      success: true,
      data: {
        articles,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalArticles / limit),
          totalArticles,
          hasMore: page < Math.ceil(totalArticles / limit)
        }
      }
    });

  } catch (error) {
    console.error('Error fetching public articles:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching articles',
      error: error.message
    });
  }
};

// @desc    Get single published article
// @route   GET /api/public/articles/:id
// @access  Public
const getPublicArticle = async (req, res) => {
  try {
    const { id } = req.params;

    const article = await Article.findOne({ 
      _id: id, 
      status: 'published' 
    }).select('title subtitle excerpt content author authorBio categoryName category featured trending publishDate views readTime tags featured_image featuredImage featuredImageAlt allowComments')
      .lean();

    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Article not found or not published'
      });
    }

    // Increment view count
    await Article.findByIdAndUpdate(id, { $inc: { views: 1 } });

    res.json({
      success: true,
      data: article
    });

  } catch (error) {
    console.error('Error fetching public article:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching article',
      error: error.message
    });
  }
};

// @desc    Get all published videos for magazine page
// @route   GET /api/public/videos
// @access  Public
const getPublicVideos = async (req, res) => {
  try {
    const { category, featured, limit = 20, page = 1 } = req.query;

    let query = { status: 'published' };

    if (category) {
      query.category = category;
    }
    
    if (featured === 'true') {
      query.featured = true;
    }

    const skip = (page - 1) * limit;

    const videos = await Video.find(query)
      .sort({ upload_date: -1, createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .select('title description category featured youtube_url thumbnail thumbnail_url duration views creator upload_date tags')
      .lean();

    const totalVideos = await Video.countDocuments(query);

    res.json({
      success: true,
      data: {
        videos,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalVideos / limit),
          totalVideos,
          hasMore: page < Math.ceil(totalVideos / limit)
        }
      }
    });

  } catch (error) {
    console.error('Error fetching public videos:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching videos',
      error: error.message
    });
  }
};

// @desc    Get single published video
// @route   GET /api/public/videos/:id
// @access  Public
const getPublicVideo = async (req, res) => {
  try {
    const { id } = req.params;

    const video = await Video.findOne({ 
      _id: id, 
      status: 'published' 
    }).select('title description category featured youtube_url thumbnail thumbnail_url duration views creator upload_date tags transcript meta_description')
      .lean();

    if (!video) {
      return res.status(404).json({
        success: false,
        message: 'Video not found or not published'
      });
    }

    // Increment view count
    await Video.findByIdAndUpdate(id, { $inc: { views: 1 } });

    res.json({
      success: true,
      data: video
    });

  } catch (error) {
    console.error('Error fetching public video:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching video',
      error: error.message
    });
  }
};

// @desc    Get all published TV shows
// @route   GET /api/public/tvshows
// @access  Public
const getPublicTVShows = async (req, res) => {
  try {
    const { category, featured, limit = 20, page = 1 } = req.query;

    let query = { status: 'published' };

    if (category) {
      query.category = category;
    }
    
    if (featured === 'true') {
      query.featured = true;
    }

    const skip = (page - 1) * limit;

    const tvShows = await TVShow.find(query)
      .sort({ air_date: -1, createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .select('title description category featured youtube_url thumbnail duration views air_date tags season episode_number')
      .lean();

    const totalShows = await TVShow.countDocuments(query);

    res.json({
      success: true,
      data: {
        tvShows,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalShows / limit),
          totalShows,
          hasMore: page < Math.ceil(totalShows / limit)
        }
      }
    });

  } catch (error) {
    console.error('Error fetching public TV shows:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching TV shows',
      error: error.message
    });
  }
};

// @desc    Get all published podcasts
// @route   GET /api/public/podcasts
// @access  Public
const getPublicPodcasts = async (req, res) => {
  try {
    const { category, featured, limit = 20, page = 1 } = req.query;

    let query = { status: 'published' };

    if (category) {
      query.category = category;
    }
    
    if (featured === 'true') {
      query.featured = true;
    }

    const skip = (page - 1) * limit;

    const podcasts = await Podcast.find(query)
      .sort({ publish_date: -1, createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .select('title description duration guest_name series_id episode_number image youtube_url spotify_url apple_url google_url tags featured status publish_date plays downloads rating likes comments_count')
      .lean();

    const totalPodcasts = await Podcast.countDocuments(query);

    res.json({
      success: true,
      data: {
        podcasts,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalPodcasts / limit),
          totalPodcasts,
          hasMore: page < Math.ceil(totalPodcasts / limit)
        }
      }
    });

  } catch (error) {
    console.error('Error fetching public podcasts:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching podcasts',
      error: error.message
    });
  }
};

// @desc    Get single published TV show
// @route   GET /api/public/tvshows/:id
// @access  Public
const getPublicTVShow = async (req, res) => {
  try {
    const { id } = req.params;

    const tvShow = await TVShow.findOne({ 
      _id: id, 
      status: 'published' 
    }).select('title description duration category section season_id episode_number thumbnail youtube_url tags meta_description featured is_new rating status upload_date views likes comments_count')
      .lean();

    if (!tvShow) {
      return res.status(404).json({
        success: false,
        message: 'TV show not found or not published'
      });
    }

    // Increment view count (views is stored as string)
    const currentViews = parseInt(tvShow.views) || 0;
    await TVShow.findByIdAndUpdate(id, { views: (currentViews + 1).toString() });

    res.json({
      success: true,
      data: tvShow
    });

  } catch (error) {
    console.error('Error fetching public TV show:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching TV show',
      error: error.message
    });
  }
};

// @desc    Get single published podcast
// @route   GET /api/public/podcasts/:id
// @access  Public
const getPublicPodcast = async (req, res) => {
  try {
    const { id } = req.params;

    const podcast = await Podcast.findOne({ 
      _id: id, 
      status: 'published' 
    }).select('title description duration guest_name series_id episode_number image youtube_url spotify_url apple_url google_url transcript tags meta_description featured status publish_date plays downloads rating likes comments_count')
      .lean();

    if (!podcast) {
      return res.status(404).json({
        success: false,
        message: 'Podcast not found or not published'
      });
    }

    // Increment play count
    await Podcast.findByIdAndUpdate(id, { $inc: { plays: 1 } });

    res.json({
      success: true,
      data: podcast
    });

  } catch (error) {
    console.error('Error fetching public podcast:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching podcast',
      error: error.message
    });
  }
};

// Routes
router.get('/articles', getPublicArticles);
router.get('/articles/:id', getPublicArticle);
router.get('/videos', getPublicVideos);
router.get('/videos/:id', getPublicVideo);
router.get('/tvshows', getPublicTVShows);
router.get('/tvshows/:id', getPublicTVShow);
router.get('/podcasts', getPublicPodcasts);
router.get('/podcasts/:id', getPublicPodcast);

// Health check
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Public API is running',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;