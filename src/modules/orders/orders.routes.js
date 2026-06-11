const express = require('express');
const { createOrder, updateOrder, getOrders } = require('./orders.controller');
const { protect } = require('../../middleware/auth')
const { authorize } = require('../../middleware/rbac')
const { orderValidator, updateOrderValidator } = require('./orders.validator')
const { validate } = require('../../middleware/validate')

const router = express.Router();

router.post('/', protect, authorize('ADMIN', 'STAFF'), ...orderValidator, validate, createOrder);
router.get('/', protect, authorize('ADMIN', 'STAFF'), getOrders);
router.patch('/:id', protect, authorize('ADMIN', 'STAFF'), ...updateOrderValidator, validate, updateOrder);


module.exports = router;