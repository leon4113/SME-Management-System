const { body } = require('express-validator');

const orderValidator = [
  body('items').isArray({ min: 1 }).withMessage('Items must be an array'),
  body('items.*.productId').notEmpty().withMessage('Product ID is required'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
];

const updateOrderValidator = [
  body('status').isIn(['COMPLETED', 'CANCELLED']).withMessage('Status must be COMPLETED or CANCELLED')
];

module.exports = { orderValidator, updateOrderValidator };