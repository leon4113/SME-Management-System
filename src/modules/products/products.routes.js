const express = require('express');
const { protect } = require('../../middleware/auth');
const { authorize } = require('../../middleware/rbac');
const { createProduct, updateProduct, getProducts } = require('./products.controller');
const { productValidator } = require('./products.validator')
const { validate } = require('../../middleware/validate')


const router = require('express').Router();

router.get('/', protect, authorize('ADMIN', 'STAFF'), getProducts);
router.post('/', protect, authorize('ADMIN'), productValidator, validate, createProduct);
router.put('/:id', protect, authorize('ADMIN'), productValidator, validate, updateProduct);

module.exports = router;