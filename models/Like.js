const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
  articleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Article',
    required: true
  },
  count: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for efficient querying
likeSchema.index({ articleId: 1 }, { unique: true });

module.exports = mongoose.model('Like', likeSchema);