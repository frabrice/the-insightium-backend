const mongoose = require('mongoose');

const podcastSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  duration: {
    type: String,
    trim: true
  },
  guest_id: {
    type: String,
    default: null,
    trim: true
  },
  guest_name: {
    type: String,
    default: '',
    trim: true
  },
  series_id: {
    type: String,
    default: null,
    trim: true
  },
  episode_number: {
    type: Number,
    default: null
  },
  image: {
    type: String,
    trim: true
  },
  audio_url: {
    type: String,
    default: '',
    trim: true
  },
  youtube_url: {
    type: String,
    default: '',
    trim: true
  },
  spotify_url: {
    type: String,
    default: '',
    trim: true
  },
  apple_url: {
    type: String,
    default: '',
    trim: true
  },
  google_url: {
    type: String,
    default: '',
    trim: true
  },
  transcript: {
    type: String,
    default: '',
    trim: true
  },
  tags: {
    type: String,
    default: '',
    trim: true
  },
  meta_description: {
    type: String,
    default: '',
    trim: true
  },
  featured: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'scheduled'],
    default: 'published'
  },
  publish_date: {
    type: Date,
    default: Date.now
  },
  plays: {
    type: String,
    default: '0'
  },
  downloads: {
    type: String,
    default: '0'
  },
  rating: {
    type: Number,
    default: 0
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
podcastSchema.index({ title: 'text', description: 'text' });
podcastSchema.index({ status: 1 });
podcastSchema.index({ publish_date: -1 });
podcastSchema.index({ featured: 1 });
podcastSchema.index({ guest_id: 1 });
podcastSchema.index({ series_id: 1 });

module.exports = mongoose.model('Podcast', podcastSchema);