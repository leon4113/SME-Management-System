const express = require('express');
const { protect } = require('../../middleware/auth');
const { authorize } = require('../../middleware/rbac');
const { createProduct, updateProduct, getProducts } = require('./products.controller');

const router = require('express').Router();

router.get('/', protect, authorize('ADMIN', 'STAFF'), getProducts);
router.post('/', protect, authorize('ADMIN'), createProduct);
router.put('/:id', protect, authorize('ADMIN'), updateProduct);

module.exports = router;