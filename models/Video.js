const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  duration: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: [
      'Research World',
      'Spirit of Africa',
      'Tech Trends',
      'Need to Know',
      'Echoes of Home',
      'Career Campus',
      'Mind and Body Quest',
      'E! Corner'
    ]
  },
  section: {
    type: String,
    default: 'Magazine'
  },
  thumbnail: {
    type: String,
    trim: true
  },
  youtube_url: {
    type: String,
    trim: true
  },
  tags: {
    type: String,
    trim: true
  },
  meta_description: {
    type: String,
    trim: true
  },
  is_new: {
    type: Boolean,
    default: false
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  status: {
    type: String,
    enum: ['published'],
    default: 'published'
  },
  upload_date: {
    type: Date,
    default: Date.now
  },
  views: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

videoSchema.index({ title: 'text', description: 'text' });
videoSchema.index({ category: 1 });
videoSchema.index({ status: 1 });
videoSchema.index({ upload_date: -1 });

module.exports = mongoose.model('Video', videoSchema);