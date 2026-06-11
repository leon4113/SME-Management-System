const express = require('express');
const { createOrder, getOrders } = require('./orders.controller');
const { protect } = require('../../middleware/auth')
const { authorize } = require('../../middleware/rbac')
const { orderValidator } = require('./orders.validator')
const { validate } = require('../../middleware/validate')

const router = express.Router();

router.post('/', protect, authorize('ADMIN', 'STAFF'), orderValidator, validate, createOrder);
router.get('/', protect, authorize('ADMIN', 'STAFF'), getOrders);

module.exports = router;