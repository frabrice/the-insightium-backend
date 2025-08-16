const mongoose = require('mongoose');

const podcastSchema = new mongoose.Schema({
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
  guest_id: {
    type: String,
    default: null,
    trim: true
  },
  guest_name: {
    type: String,
    default: '',
    trim: true,
    maxlength: [100, 'Guest name cannot exceed 100 characters']
  },
  series_id: {
    type: String,
    default: null,
    trim: true
  },
  episode_number: {
    type: Number,
    default: null,
    min: [1, 'Episode number must be at least 1']
  },
  image: {
    type: String,
    required: [true, 'Episode image URL is required'],
    trim: true
  },
  audio_url: {
    type: String,
    default: '',
    trim: true,
    validate: {
      validator: function(v) {
        return !v || /^https?:\/\/.*\.(mp3|wav|ogg|m4a|aac)$/i.test(v) || /^https?:\/\/.*/i.test(v);
      },
      message: 'Must be a valid audio URL'
    }
  },
  youtube_url: {
    type: String,
    default: '',
    trim: true,
    validate: {
      validator: function(v) {
        return !v || /^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\/.*/.test(v);
      },
      message: 'Must be a valid YouTube URL'
    }
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
    trim: true,
    maxlength: [50000, 'Transcript cannot exceed 50000 characters']
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
  status: {
    type: String,
    required: [true, 'Status is required'],
    enum: ['draft', 'published', 'scheduled'],
    default: 'draft'
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
    default: 0,
    min: [0, 'Rating cannot be negative'],
    max: [5, 'Rating cannot exceed 5']
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