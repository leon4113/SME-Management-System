const { body } = require('express-validator');

const productValidator = [
  body('name').notEmpty().withMessage('Name is required'),
  body('sku').notEmpty().withMessage('SKU is required'),
  body('price').isDecimal().withMessage('Price must be a number')
    .custom(v => v > 0).withMessage('Price > 0'),
  body('quantity').isInt({min: 0}).withMessage('Quantity > 0'),
];

module.exports = { productValidator };