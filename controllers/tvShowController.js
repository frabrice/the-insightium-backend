const TVShow = require('../models/TVShow');

// Create a new TV show episode
const createTVShow = async (req, res) => {
  try {
    const tvShow = new TVShow(req.body);
    const savedTVShow = await tvShow.save();
    
    res.status(201).json({
      success: true,
      message: 'TV show episode created successfully',
      data: savedTVShow
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = [];
      for (let field in error.errors) {
        errors.push({
          type: 'field',
          value: req.body[field],
          msg: error.errors[field].message,
          path: field,
          location: 'body'
        });
      }
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error creating TV show episode',
      error: error.message
    });
  }
};

// Get all TV show episodes with filtering and pagination
const getTVShows = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      status,
      search,
      featured,
      is_new
    } = req.query;

    // Build filter object
    const filter = {};
    
    if (category && category !== 'all') {
      filter.category = category;
    }
    
    if (status && status !== 'all') {
      filter.status = status;
    }
    
    if (featured !== undefined) {
      filter.featured = featured === 'true';
    }
    
    if (is_new !== undefined) {
      filter.is_new = is_new === 'true';
    }
    
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Calculate pagination
    const skip = (page - 1) * limit;
    const totalTVShows = await TVShow.countDocuments(filter);
    const totalPages = Math.ceil(totalTVShows / limit);

    // Get TV shows with sorting (newest first)
    const tvShows = await TVShow.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: tvShows,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalItems: totalTVShows,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching TV show episodes',
      error: error.message
    });
  }
};

// Get a single TV show episode by ID
const getTVShowById = async (req, res) => {
  try {
    const tvShow = await TVShow.findById(req.params.id);
    
    if (!tvShow) {
      return res.status(404).json({
        success: false,
        message: 'TV show episode not found'
      });
    }
    
    res.json({
      success: true,
      data: tvShow
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid TV show episode ID'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error fetching TV show episode',
      error: error.message
    });
  }
};

// Update a TV show episode
const updateTVShow = async (req, res) => {
  try {
    const tvShow = await TVShow.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { 
        new: true, 
        runValidators: true 
      }
    );
    
    if (!tvShow) {
      return res.status(404).json({
        success: false,
        message: 'TV show episode not found'
      });
    }
    
    res.json({
      success: true,
      message: 'TV show episode updated successfully',
      data: tvShow
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = [];
      for (let field in error.errors) {
        errors.push({
          type: 'field',
          value: req.body[field],
          msg: error.errors[field].message,
          path: field,
          location: 'body'
        });
      }
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors
      });
    }
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid TV show episode ID'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error updating TV show episode',
      error: error.message
    });
  }
};

// Delete a TV show episode
const deleteTVShow = async (req, res) => {
  try {
    const tvShow = await TVShow.findByIdAndDelete(req.params.id);
    
    if (!tvShow) {
      return res.status(404).json({
        success: false,
        message: 'TV show episode not found'
      });
    }
    
    res.json({
      success: true,
      message: 'TV show episode deleted successfully'
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid TV show episode ID'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error deleting TV show episode',
      error: error.message
    });
  }
};

// Get TV show statistics
const getTVShowStats = async (req, res) => {
  try {
    const totalTVShows = await TVShow.countDocuments();
    const publishedTVShows = await TVShow.countDocuments({ status: 'published' });
    const draftTVShows = await TVShow.countDocuments({ status: 'draft' });
    const featuredTVShows = await TVShow.countDocuments({ featured: true });
    const newTVShows = await TVShow.countDocuments({ is_new: true });
    
    // Category breakdown
    const categoryStats = await TVShow.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);
    
    // Average rating
    const ratingStats = await TVShow.aggregate([
      { $group: { _id: null, avgRating: { $avg: '$rating' } } }
    ]);
    
    res.json({
      success: true,
      data: {
        total: totalTVShows,
        published: publishedTVShows,
        draft: draftTVShows,
        featured: featuredTVShows,
        new: newTVShows,
        avgRating: ratingStats[0]?.avgRating || 0,
        categoryBreakdown: categoryStats.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {})
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching TV show statistics',
      error: error.message
    });
  }
};

module.exports = {
  createTVShow,
  getTVShows,
  getTVShowById,
  updateTVShow,
  deleteTVShow,
  getTVShowStats
};