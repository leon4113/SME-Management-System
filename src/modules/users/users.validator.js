const { body } = require('express-validator');

const userValidator = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
    .matches(/[!@#$%^&*]/).withMessage('Password must contain at least one special character'),
  body('role').isIn(['ADMIN', 'STAFF']).withMessage('Role must be either admin or user')
];

module.exports = { userValidator };