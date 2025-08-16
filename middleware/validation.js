const { body } = require('express-validator');

const validateArticle = [
  body('title')
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 1, max: 200 })
    .withMessage('Title must be between 1 and 200 characters'),
  
  body('excerpt')
    .notEmpty()
    .withMessage('Excerpt is required')
    .isLength({ min: 1, max: 500 })
    .withMessage('Excerpt must be between 1 and 500 characters'),
  
  body('content')
    .notEmpty()
    .withMessage('Content is required')
    .isLength({ min: 1 })
    .withMessage('Content cannot be empty'),
  
  body('category_name')
    .notEmpty()
    .withMessage('Category is required')
    .isIn([
      'Research World',
      'Spirit of Africa', 
      'Tech Trends',
      'Need to Know',
      'Echoes of Home',
      'Career Campus',
      'Mind and Body Quest',
      'E! Corner'
    ])
    .withMessage('Invalid category'),
  
  body('author')
    .notEmpty()
    .withMessage('Author is required')
    .isLength({ min: 1, max: 100 })
    .withMessage('Author name must be between 1 and 100 characters'),
  
  body('featured_image')
    .notEmpty()
    .withMessage('Featured image is required')
    .isURL()
    .withMessage('Featured image must be a valid URL'),
  
  body('status')
    .optional()
    .isIn(['draft', 'review', 'published'])
    .withMessage('Invalid status'),
  
  body('meta_description')
    .optional()
    .isLength({ max: 160 })
    .withMessage('Meta description must be max 160 characters'),
  
  body('allow_comments')
    .optional()
    .isBoolean()
    .withMessage('Allow comments must be a boolean'),
  
  body('featured')
    .optional()
    .isBoolean()
    .withMessage('Featured must be a boolean'),
  
  body('trending')
    .optional()
    .isBoolean()
    .withMessage('Trending must be a boolean')
];

const validateVideo = [
  body('title')
    .notEmpty()
    .withMessage('Title is required'),
  
  body('description')
    .notEmpty()
    .withMessage('Description is required'),
  
  body('category')
    .notEmpty()
    .withMessage('Category is required')
    .isIn([
      'Research World',
      'Spirit of Africa', 
      'Tech Trends',
      'Need to Know',
      'Echoes of Home',
      'Career Campus',
      'Mind and Body Quest',
      'E! Corner'
    ])
    .withMessage('Invalid category')
];

module.exports = {
  validateArticle,
  validateVideo
};