const mongoose = require('mongoose');

const tvShowSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  duration: {
    type: String,
    required: [true, 'Duration is required'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Full Episodes', 'Mind Battles', 'Pitch Perfect', 'Insight Stories', 'Behind Insight'],
    trim: true
  },
  section: {
    type: String,
    required: [true, 'Section is required'],
    enum: ['FullEpisodes', 'MindBattles', 'PitchPerfect', 'InsightStories', 'BehindInsight'],
    trim: true
  },
  season_id: {
    type: String,
    default: null,
    trim: true
  },
  episode_number: {
    type: Number,
    default: null,
    min: [1, 'Episode number must be at least 1']
  },
  thumbnail: {
    type: String,
    required: [true, 'Thumbnail URL is required'],
    trim: true
  },
  youtube_url: {
    type: String,
    required: [true, 'YouTube URL is required'],
    trim: true
  },
  tags: {
    type: String,
    default: '',
    trim: true,
    maxlength: [500, 'Tags cannot exceed 500 characters']
  },
  meta_description: {
    type: String,
    default: '',
    trim: true,
    maxlength: [160, 'Meta description cannot exceed 160 characters']
  },
  featured: {
    type: Boolean,
    default: false
  },
  is_new: {
    type: Boolean,
    default: false
  },
  rating: {
    type: Number,
    default: 0,
    min: [0, 'Rating cannot be negative'],
    max: [5, 'Rating cannot exceed 5']
  },
  status: {
    type: String,
    required: [true, 'Status is required'],
    enum: ['draft', 'published', 'scheduled'],
    default: 'draft'
  },
  upload_date: {
    type: Date,
    default: Date.now
  },
  views: {
    type: String,
    default: '0'
  },
  likes: {
    type: Number,
    default: 0
  },
  comments_count: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Indexes for better query performance
tvShowSchema.index({ title: 'text', description: 'text' });
tvShowSchema.index({ status: 1 });
tvShowSchema.index({ category: 1 });
tvShowSchema.index({ upload_date: -1 });
tvShowSchema.index({ featured: 1 });
tvShowSchema.index({ is_new: 1 });

module.exports = mongoose.model('TVShow', tvShowSchema);