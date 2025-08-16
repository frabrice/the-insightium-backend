const Video = require('../models/Video');
const { validationResult } = require('express-validator');

const createVideo = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
    }

    const videoData = {
      title: req.body.title,
      description: req.body.description,
      duration: req.body.duration,
      category: req.body.category,
      section: req.body.section || 'Magazine',
      thumbnail: req.body.thumbnail,
      youtube_url: req.body.youtube_url,
      tags: req.body.tags,
      meta_description: req.body.meta_description,
      is_new: req.body.is_new || false,
      rating: req.body.rating || 0,
      status: req.body.status || 'published',
      upload_date: req.body.upload_date || new Date()
    };

    const video = new Video(videoData);
    const savedVideo = await video.save();

    res.status(201).json({
      success: true,
      message: 'Video created successfully',
      data: savedVideo
    });

  } catch (error) {
    console.error('Error creating video:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating video',
      error: error.message
    });
  }
};

const getVideos = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, category, featured, trending } = req.query;
    
    const filter = {};
    if (status) filter.status = status;
    if (category) filter.category = category;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    const videos = await Video.find(filter)
      .sort({ createdAt: -1 })
      .limit(limitNum)
      .skip((pageNum - 1) * limitNum);

    const total = await Video.countDocuments(filter);

    res.json({
      success: true,
      data: videos,
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
    console.error('Error fetching videos:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching videos',
      error: error.message
    });
  }
};

const getVideoById = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    
    if (!video) {
      return res.status(404).json({
        success: false,
        message: 'Video not found'
      });
    }

    res.json({
      success: true,
      data: video
    });

  } catch (error) {
    console.error('Error fetching video:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching video',
      error: error.message
    });
  }
};

const updateVideo = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
    }

    const videoData = {
      title: req.body.title,
      description: req.body.description,
      duration: req.body.duration,
      category: req.body.category,
      section: req.body.section || 'Magazine',
      thumbnail: req.body.thumbnail,
      youtube_url: req.body.youtube_url,
      tags: req.body.tags,
      meta_description: req.body.meta_description,
      is_new: req.body.is_new || false,
      rating: req.body.rating || 0,
      status: req.body.status || 'published',
      upload_date: req.body.upload_date
    };

    const updatedVideo = await Video.findByIdAndUpdate(
      req.params.id,
      videoData,
      { new: true, runValidators: true }
    );

    if (!updatedVideo) {
      return res.status(404).json({
        success: false,
        message: 'Video not found'
      });
    }

    res.json({
      success: true,
      message: 'Video updated successfully',
      data: updatedVideo
    });

  } catch (error) {
    console.error('Error updating video:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating video',
      error: error.message
    });
  }
};

const deleteVideo = async (req, res) => {
  try {
    const deletedVideo = await Video.findByIdAndDelete(req.params.id);

    if (!deletedVideo) {
      return res.status(404).json({
        success: false,
        message: 'Video not found'
      });
    }

    res.json({
      success: true,
      message: 'Video deleted successfully',
      data: deletedVideo
    });

  } catch (error) {
    console.error('Error deleting video:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting video',
      error: error.message
    });
  }
};

module.exports = {
  createVideo,
  getVideos,
  getVideoById,
  updateVideo,
  deleteVideo
};