const Podcast = require('../models/Podcast');

// Create a new podcast episode
const createPodcast = async (req, res) => {
  try {
    const podcast = new Podcast(req.body);
    const savedPodcast = await podcast.save();
    
    res.status(201).json({
      success: true,
      message: 'Podcast episode created successfully',
      data: savedPodcast
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
      message: 'Error creating podcast episode',
      error: error.message
    });
  }
};

// Get all podcast episodes with filtering and pagination
const getPodcasts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      search,
      featured,
      guest_id,
      series_id
    } = req.query;

    // Build filter object
    const filter = {};
    
    if (status && status !== 'all') {
      filter.status = status;
    }
    
    if (featured !== undefined) {
      filter.featured = featured === 'true';
    }
    
    if (guest_id && guest_id !== 'all') {
      filter.guest_id = guest_id;
    }
    
    if (series_id && series_id !== 'all') {
      filter.series_id = series_id;
    }
    
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { guest_name: { $regex: search, $options: 'i' } }
      ];
    }

    // Calculate pagination
    const skip = (page - 1) * limit;
    const totalPodcasts = await Podcast.countDocuments(filter);
    const totalPages = Math.ceil(totalPodcasts / limit);

    // Get podcasts with sorting (newest first)
    const podcasts = await Podcast.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: podcasts,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalItems: totalPodcasts,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching podcast episodes',
      error: error.message
    });
  }
};

// Get a single podcast episode by ID
const getPodcastById = async (req, res) => {
  try {
    const podcast = await Podcast.findById(req.params.id);
    
    if (!podcast) {
      return res.status(404).json({
        success: false,
        message: 'Podcast episode not found'
      });
    }
    
    res.json({
      success: true,
      data: podcast
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid podcast episode ID'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error fetching podcast episode',
      error: error.message
    });
  }
};

// Update a podcast episode
const updatePodcast = async (req, res) => {
  try {
    const podcast = await Podcast.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { 
        new: true, 
        runValidators: true 
      }
    );
    
    if (!podcast) {
      return res.status(404).json({
        success: false,
        message: 'Podcast episode not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Podcast episode updated successfully',
      data: podcast
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
        message: 'Invalid podcast episode ID'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error updating podcast episode',
      error: error.message
    });
  }
};

// Delete a podcast episode
const deletePodcast = async (req, res) => {
  try {
    const podcast = await Podcast.findByIdAndDelete(req.params.id);
    
    if (!podcast) {
      return res.status(404).json({
        success: false,
        message: 'Podcast episode not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Podcast episode deleted successfully'
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid podcast episode ID'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error deleting podcast episode',
      error: error.message
    });
  }
};

// Get podcast statistics
const getPodcastStats = async (req, res) => {
  try {
    const totalPodcasts = await Podcast.countDocuments();
    const publishedPodcasts = await Podcast.countDocuments({ status: 'published' });
    const draftPodcasts = await Podcast.countDocuments({ status: 'draft' });
    const featuredPodcasts = await Podcast.countDocuments({ featured: true });
    
    // Guest breakdown
    const guestStats = await Podcast.aggregate([
      { $match: { guest_name: { $ne: '' } } },
      { $group: { _id: '$guest_name', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);
    
    // Series breakdown
    const seriesStats = await Podcast.aggregate([
      { $match: { series_id: { $ne: null } } },
      { $group: { _id: '$series_id', count: { $sum: 1 } } }
    ]);
    
    // Average rating
    const ratingStats = await Podcast.aggregate([
      { $group: { _id: null, avgRating: { $avg: '$rating' } } }
    ]);
    
    // Total plays and downloads
    const playStats = await Podcast.aggregate([
      {
        $group: {
          _id: null,
          totalPlays: {
            $sum: {
              $toInt: {
                $replaceAll: {
                  input: { $replaceAll: { input: '$plays', find: 'K', replacement: '000' } },
                  find: ',',
                  replacement: ''
                }
              }
            }
          },
          totalDownloads: {
            $sum: {
              $toInt: {
                $replaceAll: {
                  input: { $replaceAll: { input: '$downloads', find: 'K', replacement: '000' } },
                  find: ',',
                  replacement: ''
                }
              }
            }
          }
        }
      }
    ]);
    
    res.json({
      success: true,
      data: {
        total: totalPodcasts,
        published: publishedPodcasts,
        draft: draftPodcasts,
        featured: featuredPodcasts,
        avgRating: ratingStats[0]?.avgRating || 0,
        totalPlays: playStats[0]?.totalPlays || 0,
        totalDownloads: playStats[0]?.totalDownloads || 0,
        topGuests: guestStats.slice(0, 5),
        seriesBreakdown: seriesStats.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {})
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching podcast statistics',
      error: error.message
    });
  }
};

module.exports = {
  createPodcast,
  getPodcasts,
  getPodcastById,
  updatePodcast,
  deletePodcast,
  getPodcastStats
};