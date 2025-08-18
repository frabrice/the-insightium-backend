const mongoose = require('mongoose');

const podcastSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    minlength: [1, 'Title must be at least 1 character long'],
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    minlength: [1, 'Description must be at least 1 character long'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  duration: {
    type: String,
    required: [true, 'Duration is required'],
    trim: true,
    validate: {
      validator: function(v) {
        return /^(\d{1,3}:\d{2}|\d{1,3} min)$/i.test(v);
      },
      message: 'Duration must be in format "MM:SS" or "XXX min"'
    }
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
    min: [1, 'Episode number must be at least 1'],
    max: [9999, 'Episode number cannot exceed 9999']
  },
  image: {
    type: String,
    required: [true, 'Cover image is required'],
    trim: true,
    validate: {
      validator: function(v) {
        return /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(v);
      },
      message: 'Image must be a valid URL ending with .jpg, .jpeg, .png, .gif, or .webp'
    }
  },
  audio_url: {
    type: String,
    default: '',
    trim: true,
    validate: {
      validator: function(v) {
        return !v || /^https?:\/\/.+/.test(v);
      },
      message: 'Audio URL must be a valid URL'
    }
  },
  youtube_url: {
    type: String,
    default: '',
    trim: true,
    validate: {
      validator: function(v) {
        return !v || /^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\/.+/.test(v);
      },
      message: 'YouTube URL must be a valid YouTube link'
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
    maxlength: [50000, 'Transcript cannot exceed 50,000 characters']
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