const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  articleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Article',
    required: true
  },
  name: {
    type: String,
    default: 'Anonymous',
    trim: true,
    maxlength: 100
  },
  email: {
    type: String,
    default: 'anonymous@example.com',
    trim: true,
    lowercase: true
  },
  content: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  isApproved: {
    type: Boolean,
    default: true // Auto-approve for now, can be changed later
  },
  ipAddress: {
    type: String,
    trim: true
  },
  userAgent: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Index for efficient querying
commentSchema.index({ articleId: 1, createdAt: -1 });
commentSchema.index({ isApproved: 1 });

module.exports = mongoose.model('Comment', commentSchema);