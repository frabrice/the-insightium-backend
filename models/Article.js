const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  subtitle: {
    type: String,
    trim: true
  },
  excerpt: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  categoryName: {
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
  author: {
    type: String,
    required: true,
    trim: true
  },
  authorBio: {
    type: String,
    trim: true
  },
  publishDate: {
    type: Date,
    default: Date.now
  },
  readTime: {
    type: String,
    trim: true
  },
  tags: {
    type: String,
    trim: true
  },
  featuredImage: {
    type: String,
    required: true,
    trim: true
  },
  featuredImageAlt: {
    type: String,
    trim: true
  },
  additionalImages: [{
    id: String,
    url: String,
    alt: String,
    caption: String
  }],
  metaDescription: {
    type: String,
    trim: true,
    maxlength: 160
  },
  status: {
    type: String,
    enum: ['draft', 'review', 'published'],
    default: 'draft'
  },
  allowComments: {
    type: Boolean,
    default: true
  },
  featured: {
    type: Boolean,
    default: false
  },
  trending: {
    type: Boolean,
    default: false
  },
  editors_pick: {
    type: Boolean,
    default: false
  },
  isMainArticle: {
    type: Boolean,
    default: false
  },
  isSecondMainArticle: {
    type: Boolean,
    default: false
  },
  mainArticlePosition: {
    type: String,
    enum: ['main', 'second', null],
    default: null
  },
  views: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

articleSchema.index({ title: 'text', content: 'text', excerpt: 'text' });
articleSchema.index({ categoryName: 1 });
articleSchema.index({ status: 1 });
articleSchema.index({ featured: 1 });
articleSchema.index({ trending: 1 });
articleSchema.index({ editors_pick: 1 });
articleSchema.index({ publishDate: -1 });

module.exports = mongoose.model('Article', articleSchema);